"use client";

import { useState } from "react";

export type ProductFormValues = {
  name: string;
  price: number;
  category: "optical" | "sun" | "lens";
  color: "black" | "gold" | "silver" | "brown" | "clear";
  stock: number;
  description: string;
  tag: string;
  isRecommended: boolean;
  inStock: boolean;
  isActive: boolean;
  images: string[]; // ตอนนี้ยังเป็น URL list (Cloudinary ค่อยทำส่วนที่ 8)
};

type Props = {
  mode: "create" | "edit";
  initial?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  submitLabel: string;
};

const categories: ProductFormValues["category"][] = ["optical", "sun", "lens"];
const colors: ProductFormValues["color"][] = ["black", "gold", "silver", "brown", "clear"];

export default function ProductForm({ mode, initial, onSubmit, submitLabel }: Props) {
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    price: initial?.price ?? 0,
    category: initial?.category ?? "optical",
    color: initial?.color ?? "black",
    stock: initial?.stock ?? 0,
    description: initial?.description ?? "",
    tag: initial?.tag ?? "",
    isRecommended: initial?.isRecommended ?? false,
    inStock: initial?.inStock ?? true,
    isActive: initial?.isActive ?? true,
    images: initial?.images ?? [],
  });

  const [imgInput, setImgInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  function set<K extends keyof ProductFormValues>(key: K, v: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function addImage() {
    const url = imgInput.trim();
    if (!url) return;
    setValues((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImgInput("");
  }

  function removeImage(index: number) {
    setValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.name.trim()) return setError("กรุณากรอกชื่อสินค้า");
    if (!Number.isFinite(values.price) || values.price <= 0) return setError("กรุณากรอกราคาให้ถูกต้อง");
    if (!Number.isFinite(values.stock) || values.stock < 0) return setError("stock ต้องเป็น 0 หรือมากกว่า");

    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      {error ? (
        <div className="text-sm text-red-600 border rounded-xl p-3">{error}</div>
      ) : null}

      <div className="grid gap-2">
        <label className="text-sm font-medium">ชื่อสินค้า</label>
        <input
          className="border rounded-xl px-3 py-2"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="เช่น Minimal Classic Frame"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">ราคา</label>
          <input
            type="number"
            className="border rounded-xl px-3 py-2"
            value={values.price}
            onChange={(e) => set("price", Number(e.target.value))}
            min={0}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Stock</label>
          <input
            type="number"
            className="border rounded-xl px-3 py-2"
            value={values.stock}
            onChange={(e) => set("stock", Number(e.target.value))}
            min={0}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">หมวดหมู่</label>
          <select
            className="border rounded-xl px-3 py-2"
            value={values.category}
            onChange={(e) => set("category", e.target.value as ProductFormValues["category"])}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">สีกรอบ (color)</label>
          <select
            className="border rounded-xl px-3 py-2"
            value={values.color}
            onChange={(e) => set("color", e.target.value as ProductFormValues["color"])}
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Tag</label>
          <input
            className="border rounded-xl px-3 py-2"
            value={values.tag}
            onChange={(e) => set("tag", e.target.value)}
            placeholder="เช่น new, best-seller"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">คำอธิบาย</label>
        <textarea
          className="border rounded-xl px-3 py-2 min-h-[120px]"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="รายละเอียดสินค้า..."
        />
      </div>

            <div className="grid gap-2">
        <label className="text-sm font-medium">รูปสินค้า (Upload ไป Cloudinary)</label>

        <input
          type="file"
          accept="image/*"
          multiple
          className="border rounded-xl px-3 py-2"
          onChange={async (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setLoading(true);
  setError("");

  try {
    // 1) ขอ signature จาก server
    const signRes = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "minimal-glasses/products" }),
    });

    const signData = (await signRes.json()) as {
      ok?: boolean;
      cloudName?: string;
      apiKey?: string;
      timestamp?: string;
      folder?: string;
      signature?: string;
      error?: string;
    };

    if (!signRes.ok || !signData.ok || !signData.cloudName || !signData.apiKey || !signData.timestamp || !signData.signature) {
      throw new Error(signData.error ?? "ขอ signature ไม่สำเร็จ");
    }

    const uploadedUrls: string[] = [];

    // 2) อัปโหลดทีละไฟล์ไป Cloudinary (signed)
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signData.apiKey);
      form.append("timestamp", signData.timestamp);
      form.append("signature", signData.signature);
      form.append("folder", signData.folder ?? "minimal-glasses/products");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        { method: "POST", body: form }
      );

      const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message ?? "อัปโหลดรูปไม่สำเร็จ");
      }

      uploadedUrls.push(data.secure_url);
    }

    setValues((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setError(msg);
  } finally {
    setLoading(false);
    e.target.value = "";
  }
}}

        />

        {values.images.length > 0 ? (
          <div className="border rounded-2xl p-3 grid gap-2">
            {values.images.map((url, i) => (
              <div key={url + i} className="flex items-center gap-3">
                {/* preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-16 h-16 object-cover rounded-xl border" />
                <div className="text-xs break-all text-neutral-700 flex-1">{url}</div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="text-xs border rounded-lg px-2 py-1 hover:bg-neutral-50"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-neutral-500">
            ยังไม่มีรูป (เลือกไฟล์เพื่ออัปโหลดได้เลย)
          </div>
        )}
      </div>


      <div className="grid md:grid-cols-3 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.isRecommended}
            onChange={(e) => set("isRecommended", e.target.checked)}
          />
          Recommended
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.inStock}
            onChange={(e) => set("inStock", e.target.checked)}
          />
          inStock (legacy)
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
          />
          Active
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white rounded-xl px-4 py-2 text-sm disabled:opacity-60"
        >
          {loading ? "กำลังบันทึก..." : submitLabel}
        </button>

        <div className="text-xs text-neutral-500">
          โหมด: {mode === "create" ? "สร้างสินค้า" : "แก้ไขสินค้า"}
        </div>
      </div>
    </form>
  );
}
