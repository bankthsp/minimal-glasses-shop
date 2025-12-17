"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../_components/ProductForm";

type ProductApi = {
  id: string;
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
  images: string[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export default function EditProductClient({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductApi | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
      const data = (await res.json()) as unknown;

      if (!res.ok) {
        const msg = isRecord(data) && typeof data.error === "string" ? data.error : "โหลดสินค้าไม่สำเร็จ";
        setError(msg);
        setLoading(false);
        return;
      }

      if (!isRecord(data)) {
        setError("รูปแบบข้อมูลไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      const p: ProductApi = {
        id: String(data.id ?? ""),
        name: String(data.name ?? ""),
        price: Number(data.price ?? 0),
        category: (data.category ?? "optical") as ProductApi["category"],
        color: (data.color ?? "black") as ProductApi["color"],
        stock: Number(data.stock ?? 0),
        description: String(data.description ?? ""),
        tag: String(data.tag ?? ""),
        isRecommended: Boolean(data.isRecommended ?? false),
        inStock: Boolean(data.inStock ?? true),
        isActive: Boolean(data.isActive ?? true),
        images: Array.isArray(data.images) ? data.images.filter((x) => typeof x === "string") : [],
      };

      setProduct(p);
      setLoading(false);
    }

    void load();
  }, [id]);

  async function update(values: Omit<ProductApi, "id">) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await res.json()) as { error?: string };

    if (!res.ok) {
      throw new Error(data.error ?? "แก้ไขสินค้าไม่สำเร็จ");
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Edit Product</h1>
            <p className="text-sm text-neutral-500">แก้ไขข้อมูลสินค้า</p>
          </div>

          <Link
            href="/admin/products"
            className="border rounded-xl px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Back
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-neutral-500">กำลังโหลด...</div>
        ) : error ? (
          <div className="mt-6 text-sm text-red-600">{error}</div>
        ) : product ? (
          <ProductForm
            mode="edit"
            submitLabel="Save"
            initial={{
              name: product.name,
              price: product.price,
              category: product.category,
              color: product.color,
              stock: product.stock,
              description: product.description,
              tag: product.tag,
              isRecommended: product.isRecommended,
              inStock: product.inStock,
              isActive: product.isActive,
              images: product.images,
            }}
            onSubmit={async (v) => update(v)}
          />
        ) : (
          <div className="mt-6 text-sm text-neutral-500">ไม่พบสินค้า</div>
        )}
      </div>
    </div>
  );
}
