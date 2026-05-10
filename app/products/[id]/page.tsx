"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "../../components/layout/Container";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "optical" | "sun" | "lens";
  color: "black" | "gold" | "silver" | "brown" | "clear";
  description: string;
  tag: string;
  isRecommended: boolean;
  stock: number; // ✅ ใช้ตัวนี้เป็นหลัก
  //inStock: boolean; // (ยังคงไว้ชั่วคราว)
  images: string[];
};

const FACEBOOK_URL = "https://www.facebook.com/teeramonoptics";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("ไม่พบสินค้า");
            return;
          }
          throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
        }

        const data = (await res.json()) as Product;
        setProduct(data);
        setActiveImage(0);
      } catch (err) {
        console.error("load product error:", err);
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูล"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);


  if (loading) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Container className="py-12">
          <p className="text-center text-sm text-slate-500">
            กำลังโหลดข้อมูลสินค้า...
          </p>
        </Container>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Container className="py-12 space-y-4">
          <p className="text-center text-sm text-red-500">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/products")}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
            >
              กลับไปหน้ารายการสินค้า
            </button>
          </div>
        </Container>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <Container className="py-4 flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/products"
            className="rounded-full border border-transparent px-3 py-1 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            สินค้าทั้งหมด
          </Link>
          <span>/</span>
          <span className="text-slate-700">{product.name}</span>
        </Container>
      </section>

      <section className="py-8">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr,1.2fr]">
          {/* รูปสินค้า */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-xl bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images?.[activeImage] || "/placeholder.png"}
                alt={product.name}
                className="h-80 w-full object-cover"
              />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {(product.images?.length ? product.images : ["/placeholder.png"]).map(
                (url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`overflow-hidden rounded-lg border p-1 transition ${
                      i === activeImage
                        ? "border-orange-500"
                        : "border-slate-200 hover:border-orange-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="h-16 w-full object-cover rounded-md"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* รายละเอียด */}
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-orange-500">
              {product.tag || "แว่นตา Minimal"}
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {product.name}
            </h1>

            <p className="text-sm text-slate-500">
              หมวดหมู่:{" "}
              {product.category === "optical"
                ? "กรอบแว่นสายตา"
                : product.category === "sun"
                ? "แว่นกันแดด"
                : "เลนส์สายตา"}
              {" · "}
              สี:{" "}
              {(
                {
                  black: "ดำ",
                  gold: "ทอง",
                  silver: "เงิน",
                  brown: "น้ำตาล",
                  clear: "ใส",
                } as const
              )[product.color] || "อื่น ๆ"}
            </p>

            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-semibold text-orange-600">
                ฿{product.price.toLocaleString("th-TH")}
              </p>

              {/* ✅ สถานะสินค้าใช้ stock */}
              {product.stock > 0 ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                  มีสินค้า {product.stock} ชิ้น
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  สินค้าหมดชั่วคราว
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                {product.description ||
                  "รายละเอียดสินค้าโดยย่อ เช่น ขนาดกรอบ น้ำหนัก วัสดุ และความเหมาะสมในการใช้งาน จะใส่เพิ่มเติมในขั้นตอนหลังบ้าน (Admin)."}
              </p>
              <p className="text-slate-500">
                หากต้องการสอบถามเลนส์ที่เหมาะสม สามารถนัดตรวจสายตากับนักทัศนมาตรของร้านได้
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
                </svg>
                สอบถาม / สั่งผ่าน Facebook
              </a>

              <Link
                href="/appointment"
                className="inline-flex items-center justify-center rounded-full border border-orange-400 px-5 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
              >
                นัดตรวจสายตา / ปรึกษาเลนส์
              </Link>
            </div>

            <p className="pt-1 text-xs text-slate-400">
              * ขณะนี้ยังไม่เปิดให้สั่งซื้อออนไลน์ สอบถาม/สั่งซื้อผ่าน Facebook ได้เลย
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
