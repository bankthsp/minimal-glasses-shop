"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "../components/layout/Container";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "optical" | "sun" | "lens";
  color: "black" | "gold" | "silver" | "brown" | "clear";
  description: string;
  tag: string;
  isRecommended: boolean;
  stock: number;        // ✅ ใช้ตัวนี้
  inStock: boolean;     // (ยังคงไว้ชั่วคราว)
  images: string[];
};


const categoryOptions = [
  { value: "all", label: "ทั้งหมด" },
  { value: "optical", label: "กรอบแว่นสายตา" },
  { value: "sun", label: "แว่นกันแดด" },
  { value: "lens", label: "เลนส์" },
] as const;

const colorOptions = [
  { value: "all", label: "ทุกสี" },
  { value: "black", label: "ดำ" },
  { value: "gold", label: "ทอง" },
  { value: "silver", label: "เงิน" },
  { value: "brown", label: "น้ำตาล" },
  { value: "clear", label: "ใส" },
] as const;

const priceOptions = [
  { value: "all", label: "ทุกช่วงราคา" },
  { value: "0-2500", label: "ไม่เกิน 2,500" },
  { value: "2500-4000", label: "2,500 – 4,000" },
  { value: "4000+", label: "มากกว่า 4,000" },
] as const;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]["value"]>("all");
  const [color, setColor] =
    useState<(typeof colorOptions)[number]["value"]>("all");
  const [priceRange, setPriceRange] =
    useState<(typeof priceOptions)[number]["value"]>("all");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
        }

        const data = (await res.json()) as Product[];
        setProducts(data);
      } catch (err) {
        console.error("load products error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const keyword = search.trim().toLowerCase();
        if (
          !(
            p.name.toLowerCase().includes(keyword) ||
            p.tag.toLowerCase().includes(keyword)
          )
        ) {
          return false;
        }
      }

      if (category !== "all" && p.category !== category) return false;
      if (color !== "all" && p.color !== color) return false;

      if (priceRange !== "all") {
        const price = p.price;
        if (priceRange === "0-2500" && price > 2500) return false;
        if (priceRange === "2500-4000" && (price <= 2500 || price > 4000))
          return false;
        if (priceRange === "4000+" && price <= 4000) return false;
      }

      return true;
    });
  }, [products, search, category, color, priceRange]);

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <Container className="py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                สินค้าในร้าน
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                เลือกกรอบแว่น เลนส์ หรือแว่นกันแดดในสไตล์ที่เหมาะกับคุณ
              </p>
            </div>
            <p className="text-sm text-slate-500">
              แสดงทั้งหมด{" "}
              <span className="font-medium text-orange-600">
                {filteredProducts.length}
              </span>{" "}
              รายการ
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-white/80">
        <Container className="py-4 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="ค้นหา เช่น Minimal ดำ, โปรเกรสซีฟ..."
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-16">หมวดหมู่</span>
                <select
                  className="min-w-[140px] rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none transition hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as (typeof categoryOptions)[number]["value"])
                  }
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-10">สีกรอบ</span>
                <select
                  className="min-w-[120px] rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none transition hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={color}
                  onChange={(e) =>
                    setColor(e.target.value as (typeof colorOptions)[number]["value"])
                  }
                >
                  {colorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-16">ช่วงราคา</span>
                <select
                  className="min-w-[150px] rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none transition hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={priceRange}
                  onChange={(e) =>
                    setPriceRange(e.target.value as (typeof priceOptions)[number]["value"])
                  }
                >
                  {priceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          {loading && (
            <p className="text-center text-sm text-slate-500">
              กำลังโหลดข้อมูลสินค้า...
            </p>
          )}

          {error && !loading && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className="text-center text-sm text-slate-500">
              ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
            </p>
          )}

          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md"
              >
                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-slate-50 text-slate-300 text-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-orange-500">
                    {product.tag || "แว่นตา Minimal"}
                  </p>
                  <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    หมวดหมู่:{" "}
                    {product.category === "optical"
                      ? "กรอบแว่นสายตา"
                      : product.category === "sun"
                      ? "แว่นกันแดด"
                      : "เลนส์สายตา"}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-semibold text-orange-600">
                    ฿{product.price.toLocaleString("th-TH")}
                  </p>
                  {product.stock > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                          มีสินค้า ({product.stock} ชิ้น)
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                          สินค้าหมด
                        </span>
                      )}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
