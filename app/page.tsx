// app/page.tsx
export const revalidate = 0;


import Link from "next/link";
import Image from "next/image";
import Container from "./components/layout/Container";

import { connectDB } from "./lib/mongodb"; // ⚠️ ปรับ path ให้ตรงของกู๋บุ๊ง
import { Product } from "./models/Product"; // ⚠️ ปรับ path ให้ตรงของกู๋บุ๊ง

type ProductRow = {
  id: string;
  name: string;
  price: number;
  color: string;
  tag: string;
  images: string[];
  isRecommended: boolean;
};
type LeanProductDoc = {
  _id: unknown;
  name?: unknown;
  price?: unknown;
  color?: unknown;
  tag?: unknown;
  images?: unknown;
  isRecommended?: unknown;
};
function toStringOrEmpty(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function toNumberOrZero(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function toBool(v: unknown): boolean {
  return v === true;
}

function mapToProductRow(d: LeanProductDoc): ProductRow {
  return {
    id: String(d._id),
    name: toStringOrEmpty(d.name),
    price: toNumberOrZero(d.price),
    color: toStringOrEmpty(d.color),
    tag: toStringOrEmpty(d.tag),
    images: toStringArray(d.images),
    isRecommended: toBool(d.isRecommended),
  };
}


async function getFeaturedProducts(): Promise<ProductRow[]> {
  await connectDB();

  const recommendedDocs = await Product.find({ isRecommended: true, isActive: true })
  .sort({ createdAt: -1 })
  .limit(4)
  .select("_id name price color tag images isRecommended")
  .lean<LeanProductDoc[]>();

  let docs = recommendedDocs;

  if (docs.length < 4) {
    const excludeIds = docs.map((d) => d._id);

    const moreDocs = await Product.find({
  isActive: true,
  _id: { $nin: excludeIds },
})
  .sort({ createdAt: -1 })
  .limit(4 - docs.length)
  .select("_id name price color tag images isRecommended")
  .lean<LeanProductDoc[]>();


    docs = docs.concat(moreDocs);
  }

  return docs.map(mapToProductRow);
}


export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <main className="bg-orange-50">
      {/* HERO SECTION */}
      <section className="border-b border-orange-100">
        <Container className="flex flex-col items-center gap-10 py-12 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-xl space-y-6 text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-orange-500">
              TEERAMON OPTIC
            </p>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              ร้านแว่นตา <span className="text-orange-600">โดยนักทัศนมาตร</span>
            </h1>
            <p className="text-base text-slate-700 md:text-lg">
              ตรวจวัดสายตาอย่างละเอียด เลนส์โปรเกรสซีฟ และเลนส์ทุกชนิด
              พร้อมกรอบแว่นดีไซน์เรียบหรู ใส่สบาย ใช้ได้ทุกวัน
            </p>

            <div className="flex flex-col gap-3 md:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                ดูกรอบแว่นทั้งหมด
              </Link>
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center rounded-full border border-orange-300 bg-white/70 px-6 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-white"
              >
                นัดตรวจสายตา
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              * มีบริการอธิบายเลนส์ให้เหมาะกับการใช้งาน และดูแลหลังการขาย
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-white shadow-md md:h-40 md:w-40">
              <Image
                src="/logo-teeramon.png"
                alt="Teeramon Optic Logo"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-xs text-slate-600">
              TEERAMON OPTIC – ศูนย์เลนส์โปรเกรสซีฟและเลนส์สายตาทุกชนิด
            </p>
          </div>
        </Container>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-slate-50">
        <Container className="section space-y-6 md:py-16">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">กรอบแว่นแนะนำ</h2>
              <p className="mt-1 text-sm text-slate-600">
                ดึงจากฐานข้อมูลจริง (recommended ก่อน)
              </p>
            </div>
            <Link href="/products" className="text-sm font-medium text-orange-600 hover:text-orange-700">
              ดูสินค้าเพิ่มเติม →
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              ยังไม่มีสินค้าในระบบ
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm/50 hover:shadow-md transition"
                >
                  <div className="relative h-40 sm:h-44 md:h-32 w-full overflow-hidden bg-slate-100">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        รูปสินค้า (ยังไม่มี)
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4 text-sm">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.color}</div>
                    </div>

                    <div className="text-xs text-orange-600">{p.tag}</div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="text-base font-semibold text-slate-900">
                        ฿{p.price.toLocaleString()}
                      </div>

                      <Link
                        href={`/products/${p.id}`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* CTA ล่าง (ของเดิม) */}
      {/* ... */}
    </main>
  );
}
