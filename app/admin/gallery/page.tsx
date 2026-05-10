"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type GalleryItem = {
  _id: string;
  imageUrl: string;
  title: string;
  brand: string;
  tag: string;
};

type UploadState = {
  file: File;
  preview: string;
  status: "idle" | "uploading" | "done" | "error";
  progress: number;
  result?: GalleryItem;
};

const TAG_OPTIONS = ["", "กรอบสายตา", "แว่นกันแดด", "เลนส์", "อื่นๆ"];

async function uploadToCloudinary(
  file: File,
  onProgress: (p: number) => void
): Promise<{ url: string; publicId: string }> {
  // 1. Get signature from our API
  const sigRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "teeramon/gallery" }),
  });
  const sig = await sigRes.json();

  // 2. Upload to Cloudinary
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 200) resolve({ url: data.secure_url, publicId: data.public_id });
      else reject(new Error(data.error?.message ?? "Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
    xhr.send(form);
  });
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [dragging, setDragging] = useState(false);
  const [meta, setMeta] = useState({ title: "", brand: "", tag: "" });
  const inputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/gallery");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newUploads: UploadState[] = [...files]
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "idle",
        progress: 0,
      }));
    setUploads((prev) => [...prev, ...newUploads]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleUploadAll = async () => {
    const pending = uploads.filter((u) => u.status === "idle");
    if (pending.length === 0) return;

    for (let i = 0; i < uploads.length; i++) {
      if (uploads[i].status !== "idle") continue;

      setUploads((prev) =>
        prev.map((u, idx) => (idx === i ? { ...u, status: "uploading" } : u))
      );

      try {
        const { url, publicId } = await uploadToCloudinary(
          uploads[i].file,
          (p) =>
            setUploads((prev) =>
              prev.map((u, idx) => (idx === i ? { ...u, progress: p } : u))
            )
        );

        // Save to DB
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: url, publicId, ...meta }),
        });
        const saved = await res.json();

        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: "done", progress: 100, result: saved } : u
          )
        );
      } catch {
        setUploads((prev) =>
          prev.map((u, idx) => (idx === i ? { ...u, status: "error" } : u))
        );
      }
    }

    await loadItems();
  };

  const removeUpload = (i: number) => {
    setUploads((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const deleteItem = async (id: string) => {
    if (!confirm("ลบรูปนี้ออกจาก Gallery?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it._id !== id));
  };

  const hasPending = uploads.some((u) => u.status === "idle");

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">จัดการ Gallery</h1>
          <p className="mt-1 text-sm text-slate-500">
            ลากรูปมาวางด้านล่าง หรือคลิกเพื่อเลือกไฟล์ — รูปจะอัปโหลดไป Cloudinary อัตโนมัติ
          </p>
          <div className="mt-3">
            <Link
              href="/admin/gallery/import-fb"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
              </svg>
              Import จาก Facebook
            </Link>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-12 transition ${
            dragging
              ? "border-orange-500 bg-orange-50"
              : "border-slate-300 bg-white hover:border-orange-400 hover:bg-orange-50/40"
          }`}
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-orange-600">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5H3v5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5h-2zm-8 1V4.83L8.41 7.41 7 6l5-5 5 5-1.41 1.41L13 4.83V14h-2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-800">
              {dragging ? "วางรูปที่นี่เลย!" : "ลากรูปมาวาง หรือคลิกเพื่อเลือก"}
            </p>
            <p className="mt-1 text-xs text-slate-500">รองรับ JPG, PNG, WEBP — หลายรูปพร้อมกันได้</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>

        {/* Metadata fields */}
        {uploads.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-sm font-semibold text-slate-700">ข้อมูลที่ใช้กับทุกรูปที่อัปโหลด (แก้ทีหลังได้)</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">ชื่อสินค้า</label>
                <input
                  type="text"
                  placeholder="เช่น กรอบ Oval Silver"
                  value={meta.title}
                  onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">ยี่ห้อ</label>
                <input
                  type="text"
                  placeholder="เช่น Paul Hueman"
                  value={meta.brand}
                  onChange={(e) => setMeta((m) => ({ ...m, brand: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">ประเภท</label>
                <select
                  value={meta.tag}
                  onChange={(e) => setMeta((m) => ({ ...m, tag: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                >
                  {TAG_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t || "— ไม่ระบุ —"}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Upload queue */}
        {uploads.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                รูปที่รอ upload ({uploads.filter((u) => u.status === "idle").length} รูป)
              </p>
              {hasPending && (
                <button
                  onClick={handleUploadAll}
                  className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  อัปโหลดทั้งหมด →
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {uploads.map((u, i) => (
                <div key={i} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.preview} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="line-clamp-1 text-xs font-medium text-slate-700">{u.file.name}</p>
                      <p className="text-xs text-slate-400">{(u.file.size / 1024).toFixed(0)} KB</p>
                    </div>

                    {u.status === "uploading" && (
                      <div className="space-y-1">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-orange-500 transition-all"
                            style={{ width: `${u.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">{u.progress}%</p>
                      </div>
                    )}

                    {u.status === "done" && (
                      <p className="text-xs font-semibold text-emerald-600">✓ อัปโหลดเสร็จแล้ว</p>
                    )}
                    {u.status === "error" && (
                      <p className="text-xs font-semibold text-red-500">✗ เกิดข้อผิดพลาด</p>
                    )}

                    {u.status === "idle" && (
                      <button
                        onClick={() => removeUpload(i)}
                        className="self-start text-xs text-slate-400 hover:text-red-500"
                      >
                        ลบออก
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current gallery items */}
        <div>
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Gallery ปัจจุบัน ({items.length} รูป)
          </h2>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              ยังไม่มีรูปใน Gallery — อัปโหลดรูปด้านบนได้เลย
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <div key={item._id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-2">
                    {item.tag && (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600">
                        {item.tag}
                      </span>
                    )}
                    <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-700">
                      {item.title || item.brand || "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="absolute right-2 top-2 hidden h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow group-hover:flex"
                    title="ลบ"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                      <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
