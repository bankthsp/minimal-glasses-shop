"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const TAG_OPTIONS = ["", "กรอบสายตา", "แว่นกันแดด", "เลนส์", "อื่นๆ"];

type FBPhoto = {
  id: string;
  url: string;
  thumb: string;
  name: string;
  created_time: string;
};

type ImportStatus = "idle" | "importing" | "done" | "error";

type PhotoState = FBPhoto & {
  selected: boolean;
  status: ImportStatus;
};

export default function ImportFbPage() {
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ title: "", brand: "", tag: "" });
  const [importing, setImporting] = useState(false);

  const loadPhotos = useCallback(async (after?: string) => {
    setLoading(true);
    setError("");
    try {
      const url = after
        ? `/api/admin/fb-photos?after=${encodeURIComponent(after)}`
        : "/api/admin/fb-photos";
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "โหลดรูปไม่สำเร็จ");
        return;
      }

      const newPhotos: PhotoState[] = (data.photos ?? []).map((p: FBPhoto) => ({
        ...p,
        selected: false,
        status: "idle" as ImportStatus,
      }));

      setPhotos((prev) => (after ? [...prev, ...newPhotos] : newPhotos));
      setNextCursor(data.paging?.cursors?.after ?? null);
    } catch {
      setError("เชื่อมต่อ Facebook ไม่ได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const toggleSelect = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id && p.status === "idle" ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectAll = () => {
    setPhotos((prev) =>
      prev.map((p) => (p.status === "idle" ? { ...p, selected: true } : p))
    );
  };

  const clearAll = () => {
    setPhotos((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  const selectedCount = photos.filter((p) => p.selected).length;

  const handleImport = async () => {
    const targets = photos.filter((p) => p.selected && p.status === "idle");
    if (targets.length === 0) return;
    setImporting(true);

    for (const photo of targets) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, status: "importing" } : p))
      );

      try {
        const res = await fetch("/api/admin/fb-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fbUrl: photo.url, ...meta }),
        });

        const status: ImportStatus = res.ok ? "done" : "error";
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id ? { ...p, status, selected: false } : p
          )
        );
      } catch {
        setPhotos((prev) =>
          prev.map((p) => (p.id === photo.id ? { ...p, status: "error" } : p))
        );
      }
    }

    setImporting(false);
  };

  const doneCount = photos.filter((p) => p.status === "done").length;
  const errorCount = photos.filter((p) => p.status === "error").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/admin/gallery" className="hover:text-orange-600">
                ← จัดการ Gallery
              </Link>
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Import จาก Facebook
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              เลือกรูปจากเพจ Facebook แล้วกด Import — รูปจะถูกอัปโหลดไป Cloudinary โดยอัตโนมัติ
            </p>
          </div>

          <Link
            href="/admin/gallery"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            ดู Gallery
          </Link>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">เกิดข้อผิดพลาด</p>
            <p className="mt-1">{error}</p>
            {error.includes("FACEBOOK_PAGE_ACCESS_TOKEN") && (
              <p className="mt-2 text-xs text-red-500">
                ต้องตั้งค่า FACEBOOK_PAGE_ACCESS_TOKEN และ FACEBOOK_PAGE_ID ใน Vercel Environment Variables ก่อน
              </p>
            )}
          </div>
        )}

        {/* Stats bar */}
        {doneCount + errorCount > 0 && (
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            {doneCount > 0 && (
              <span className="font-semibold text-emerald-600">✓ Import สำเร็จ {doneCount} รูป</span>
            )}
            {errorCount > 0 && (
              <span className="font-semibold text-red-500">✗ ล้มเหลว {errorCount} รูป</span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            ข้อมูลที่ใช้กับทุกรูปที่ Import (แก้ทีหลังได้)
          </p>
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

        {/* Toolbar */}
        {photos.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              เลือกอยู่ {selectedCount} รูป
            </span>
            <button
              onClick={selectAll}
              className="text-sm text-orange-600 hover:underline"
            >
              เลือกทั้งหมด
            </button>
            {selectedCount > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-slate-400 hover:text-slate-600 hover:underline"
              >
                ยกเลิก
              </button>
            )}

            {selectedCount > 0 && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="ml-auto rounded-full bg-orange-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
              >
                {importing ? "กำลัง Import..." : `Import ${selectedCount} รูป →`}
              </button>
            )}
          </div>
        )}

        {/* Photo grid */}
        {loading && photos.length === 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : photos.length === 0 && !loading && !error ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
            ไม่พบรูปในเพจ
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                disabled={photo.status !== "idle"}
                onClick={() => toggleSelect(photo.id)}
                className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                  photo.status === "done"
                    ? "border-emerald-400 opacity-60"
                    : photo.status === "error"
                    ? "border-red-400 opacity-60"
                    : photo.status === "importing"
                    ? "border-orange-400 opacity-70"
                    : photo.selected
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-transparent hover:border-orange-300"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.thumb}
                  alt={photo.name || "Facebook photo"}
                  className="h-full w-full object-cover"
                />

                {/* Status overlay */}
                {photo.status === "done" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/30">
                    <span className="text-2xl">✓</span>
                  </div>
                )}
                {photo.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                    <span className="text-2xl">✗</span>
                  </div>
                )}
                {photo.status === "importing" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}

                {/* Selected checkmark */}
                {photo.selected && photo.status === "idle" && (
                  <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white shadow">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Load more */}
        {nextCursor && !loading && (
          <div className="flex justify-center">
            <button
              onClick={() => loadPhotos(nextCursor)}
              className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
            >
              โหลดรูปเพิ่มเติม
            </button>
          </div>
        )}

        {loading && photos.length > 0 && (
          <div className="text-center text-sm text-slate-400">กำลังโหลด...</div>
        )}
      </div>
    </div>
  );
}
