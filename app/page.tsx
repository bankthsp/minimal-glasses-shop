// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "./components/layout/Container";

const featuredProducts = [
  {
    id: "1",
    name: "กรอบแว่น Minimal ดำด้าน",
    price: "2,490",
    color: "สีดำด้าน",
    tag: "เหมาะกับทำงาน/ทางการ",
    image: "/placeholder-frame-1.jpg", // เดี๋ยวค่อยเปลี่ยนเป็นรูปจริง
  },
  {
    id: "2",
    name: "กรอบแว่น ทอง Minimal",
    price: "3,200",
    color: "สีทองอ่อน",
    tag: "ลุคสุภาพ เรียบหรู",
    image: "/placeholder-frame-2.jpg",
  },
  {
    id: "3",
    name: "กรอบแว่น สีเงิน บางพิเศษ",
    price: "2,890",
    color: "สีเงิน",
    tag: "น้ำหนักเบา ใส่สบาย",
    image: "/placeholder-frame-3.jpg",
  },
  {
    id: "4",
    name: "กรอบแว่น ทูโทน น้ำตาล/ใส",
    price: "2,690",
    color: "น้ำตาลใส",
    tag: "สายแฟฯ มินิมอล",
    image: "/placeholder-frame-4.jpg",
  },
];

export default function Home() {
  return (
    <main className="bg-orange-50">
      {/* HERO SECTION */}
      <section className="border-b border-orange-100">
        <Container className="flex flex-col items-center gap-10 py-12 md:flex-row md:items-center md:justify-between md:py-20">
          {/* ด้านซ้าย: ข้อความ */}
          <div className="max-w-xl space-y-6 text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-orange-500">
              TEERAMON OPTIC
            </p>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              ร้านแว่นตา{" "}
              <span className="text-orange-600">โดยนักทัศนมาตร</span>
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
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-orange-300 bg-white/70 px-6 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-white"
              >
                นัดตรวจสายตา
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              * มีบริการอธิบายเลนส์ให้เหมาะกับการใช้งาน และดูแลหลังการขาย
            </p>
          </div>

          {/* ด้านขวา: รูป mockup ร้าน/กรอบแว่น (ใช้โลโก้ไปก่อน) */}
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

      {/* SERVICES SECTION */}
      <section className="bg-white">
        <Container className="section py-16 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              ทำไมต้อง TEERAMON OPTIC
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              ดูแลสายตาโดยนักทัศนมาตร พร้อมอุปกรณ์ตรวจวัดที่ทันสมัย
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-6 text-sm text-slate-700">
              <h3 className="text-base font-semibold text-orange-700">
                ตรวจวัดสายตาโดยนักทัศนมาตร
              </h3>
              <p className="mt-2">
                ตรวจสายตาอย่างละเอียด ทั้งสายตาสั้น ยาว เอียง
                เพื่อให้ได้ค่าสายตาที่แม่นยำ ก่อนเลือกเลนส์และกรอบแว่น
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <h3 className="text-base font-semibold text-slate-900">
                ศูนย์เลนส์โปรเกรสซีฟ
              </h3>
              <p className="mt-2">
                เชี่ยวชาญเลนส์โปรเกรสซีฟสำหรับคนทำงาน ใช้คอม
                หรือผู้ที่ต้องการเลนส์หลายระยะในแว่นเดียว โดยทางร้านมีเลนส์จริงให้ทดลองทุกรุ่น
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <h3 className="text-base font-semibold text-slate-900 ">
                กรอบแว่นมินิมอล คัดเฉพาะรุ่น
              </h3>
              <p className="mt-2">
                เลือกกรอบแว่นดีไซน์เรียบง่าย ใส่ได้ทุกโอกาส ทั้งทำงานและวันสบาย
                เน้นเบา ใส่สบาย ไม่กดรัด
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-slate-50">
        <Container className="section space-y-6 md:py-16">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                กรอบแว่นแนะนำ
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                ตัวอย่างกรอบแว่นแนวมินิมอลที่ได้รับความนิยม (ตัวอย่างข้อมูล mock)
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              ดูสินค้าเพิ่มเติม →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm/50 hover:shadow-md transition"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  {/* ตอนนี้ใช้พื้นหลังเฉย ๆ ไว้ค่อยใส่รูปจริงภายหลัง */}
                  {/* <Image ... /> */}
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    รูปสินค้า (ใส่ทีหลัง)
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 text-sm">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-slate-500">{product.color}</div>
                  </div>
                  <div className="text-xs text-orange-600">{product.tag}</div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="text-base font-semibold text-slate-900">
                      ฿{product.price}
                    </div>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-orange-500 hover:text-orange-600">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA ล่าง */}
      <section className="border-t border-orange-100 bg-orange-50 ">
        <Container className="section flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              อยากเปลี่ยนแว่นใหม่ หรือตรวจเช็คสายตา?
            </h2>
            <p className="mt-1 text-sm text-slate-700">
              สามารถจองคิวล่วงหน้าเพื่อลดเวลารอหน้าร้าน
              หรือแวะเข้ามาพูดคุยให้เราช่วยแนะนำได้เลย
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            จองคิวตรวจสายตา
          </Link>
        </Container>
      </section>
    </main>
  );
}
