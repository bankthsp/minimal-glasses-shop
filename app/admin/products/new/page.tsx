"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductForm, {
  type ProductFormValues,
} from "../_components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  async function create(values: ProductFormValues) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await res.json()) as { error?: string };

    if (!res.ok) {
      throw new Error(data.error ?? "สร้างสินค้าไม่สำเร็จ");
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Add Product</h1>
            <p className="text-sm text-neutral-500">เพิ่มสินค้าใหม่</p>
          </div>

          <Link
            href="/admin/products"
            className="border rounded-xl px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Back
          </Link>
        </div>

        <ProductForm
          mode="create"
          submitLabel="Create"
          onSubmit={create}
        />
      </div>
    </div>
  );
}
