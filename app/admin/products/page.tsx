"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ProductsApiResponse = {
  ok?: boolean;
  products?: unknown;
  error?: string;
};

type ProductRow = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  color: string;
  isActive: boolean;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function toProductRow(p: unknown): ProductRow | null {
  if (!isRecord(p)) return null;

  const _id = typeof p._id === "string" ? p._id : typeof p.id === "string" ? p.id : "";
  const name = typeof p.name === "string" ? p.name : "";
  const price = typeof p.price === "number" ? p.price : Number(p.price ?? 0);
  const stock = typeof p.stock === "number" ? p.stock : Number(p.stock ?? 0);
  const category = typeof p.category === "string" ? p.category : "";
  const color = typeof p.color === "string" ? p.color : "";
  const isActive =
    typeof p.isActive === "boolean" ? p.isActive : Boolean(p.isActive ?? true);

  if (!_id || !name) return null;

  return { _id, name, price, stock, category, color, isActive };
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = (await res.json()) as ProductsApiResponse;

      // หมายเหตุ: API ของกู๋บุ๊งตอนนี้ GET /api/products ส่งกลับเป็น "array" ตรง ๆ
      // แต่เราเขียนรองรับ 2 แบบ:
      // 1) array ตรง ๆ
      // 2) { ok: true, products: [...] }
      let rawList: unknown = data;

      if (Array.isArray(data)) {
        rawList = data;
      } else if (isRecord(data) && Array.isArray(data.products)) {
        rawList = data.products;
      }

      const list = Array.isArray(rawList) ? rawList : [];

      const mapped = list
        .map(toProductRow)
        .filter((x): x is ProductRow => x !== null);

      setItems(mapped);

      if (!res.ok) {
        setError((isRecord(data) && typeof data.error === "string" && data.error) || "โหลดสินค้าไม่สำเร็จ");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (id: string) => {
      if (!confirm("ลบสินค้านี้ใช่ไหม?")) return;

      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("ลบไม่สำเร็จ");
        return;
      }

      await load();
    },
    [load]
  );

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Products</h1>
            <p className="text-sm text-neutral-500">จัดการสินค้า</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={load}
              className="border rounded-xl px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Refresh
            </button>
            <Link
              href="/admin/products/new"
              className="bg-orange-500 text-white rounded-xl px-3 py-2 text-sm"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-neutral-500">กำลังโหลด...</div>
        ) : error ? (
          <div className="mt-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="mt-6 overflow-x-auto border rounded-2xl">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-700">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3">Stock</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Color</th>
                  <th className="text-left p-3">Active</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 text-right">{p.price.toLocaleString()}</td>
                    <td className="p-3 text-right">{p.stock}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.color}</td>
                    <td className="p-3">{p.isActive ? "Yes" : "No"}</td>
                    <td className="p-3 flex gap-2">
                      <Link
                        href={`/admin/products/${p._id}`}
                        className="border rounded-xl px-3 py-1 text-sm hover:bg-neutral-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => remove(p._id)}
                        className="border rounded-xl px-3 py-1 text-sm hover:bg-neutral-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 ? (
                  <tr>
                    <td className="p-3 text-neutral-500" colSpan={7}>
                      ไม่มีสินค้า
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
