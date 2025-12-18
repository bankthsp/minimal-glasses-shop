// app/about/page.tsx
// About (เกี่ยวกับร้าน) — Bento Grid (Apple/Linear-ish)
// Updates:
// - Add social links (Facebook / TikTok / Instagram) + Google Maps + LINE OA
// - Improve theme contrast by alternating Dark / Light / Orange / Gray cards
// - Mobile bento: 2-column grid on phones (still looks like bento)
// - NEW:
//   1) Service card: auto-sliding images (CSS-only, safe for Server Components) — full-frame + bigger
//   2) Expert card: doctor photo + certificates (images)
//   3) Social buttons: add platform icons (+ LINE OA)

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export const metadata = {
  title: "เกี่ยวกับร้าน | Teeramon Optic",
  description: "ทำความรู้จัก Teeramon Optic — ร้านแว่นตาโดยนักทัศนมาตร",
};

const SOCIAL = {
  facebook: "https://www.facebook.com/teeramonoptics",
  tiktok: "https://www.tiktok.com/@teeramon_optict",
  instagram: "https://www.instagram.com/teeramonoptic/",
  lineoa: "https://line.me/R/ti/p/@741wcnor",
  map: "https://share.google/hocF4a8Dxa1da2DAy",
} as const;

/**
 * TODO: Replace these with real files under /public/about/
 * Example:
 *  - /public/about/service-1.jpg
 *  - /public/about/doctor.jpg
 *  - /public/about/cert-1.jpg
 */
const IMAGES = {
  services: [
    "/about/service-1.jpg",
    "/about/service-2.jpg",
    "/about/service-3.jpg",
  ],
  doctor: "/about/doctor.jpg",
  certificates: [
    "/about/cert-1.jpg",
    "/about/cert-2.jpg",
    "/about/cert-3.jpg",
  ],
} as const;

/**
 * Badge
 * Safe rendering: avoid passing unknown objects into the span.
 */
function Badge({
  text,
  children,
  fallback = "",
  tone = "light",
}: {
  text?: string;
  children?: ReactNode;
  fallback?: string;
  tone?: "light" | "dark";
}) {
  const raw: unknown = text ?? children ?? fallback;

  let content: ReactNode = "";
  if (raw == null || raw === false || raw === true) content = fallback;
  else if (typeof raw === "string") content = raw;
  else if (typeof raw === "number") content = String(raw);
  else if (typeof raw === "object") content = typeof children === "object" ? children : fallback;
  else content = fallback;

  if (content === "") return null;

  const cls =
    tone === "dark"
      ? "border-white/15 bg-white/10 text-white"
      : "border-orange-200/70 bg-white/70 text-orange-800";

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium shadow-sm " +
        cls
      }
    >
      {content}
    </span>
  );
}

type CardVariant = "light" | "orange" | "gray" | "dark";

function Card({
  className = "",
  children,
  variant = "light",
}: {
  className?: string;
  children?: ReactNode;
  variant?: CardVariant;
}) {
  const base =
    "group relative overflow-hidden rounded-3xl border p-5 sm:p-6 transition hover:-translate-y-0.5";

  const variants: Record<CardVariant, string> = {
    light:
      "border-orange-100/80 bg-white/78 text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
    orange:
      "border-orange-300/40 bg-orange-50/80 text-slate-900 shadow-[0_14px_45px_rgba(249,115,22,0.16)]",
    gray:
      "border-slate-200/70 bg-slate-100/70 text-slate-900 shadow-[0_12px_36px_rgba(0,0,0,0.10)]",
    dark:
      "border-white/10 bg-slate-900 text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`.trim()}>
      {/* subtle glow */}
      <div
        className={
          "pointer-events-none absolute inset-0 opacity-70 " +
          (variant === "dark"
            ? "[background:radial-gradient(70%_60%_at_30%_20%,rgba(249,115,22,0.18),transparent_70%)]"
            : "[background:radial-gradient(70%_60%_at_30%_20%,rgba(249,115,22,0.14),transparent_65%)]")
        }
      />
      <div className="relative">{children ?? null}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-orange-200/35 bg-white/75 px-4 py-3">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}

/* ---------------------------------
 * Simple inline SVG icons (no deps)
 * --------------------------------- */
function IconFacebook(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
    </svg>
  );
}

function IconInstagram(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
    </svg>
  );
}

function IconTikTok(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M16.6 3c.5 2.6 2.2 4.6 4.4 5v2.8c-1.8 0-3.4-.6-4.8-1.6v6.2c0 3.5-2.8 6.3-6.3 6.3S3.6 18.9 3.6 15.4s2.8-6.3 6.3-6.3c.4 0 .7 0 1.1.1v3.1c-.3-.1-.7-.2-1.1-.2-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V3h3.4z" />
    </svg>
  );
}

function IconMapPin(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M12 2a7 7 0 0 1 7 7c0 5.1-7 13-7 13S5 14.1 5 9a7 7 0 0 1 7-7zm0 9.5A2.5 2.5 0 1 0 12 6.5a2.5 2.5 0 0 0 0 5z" />
    </svg>
  );
}

function IconLine(props: { className?: string }) {
  // Minimal LINE-like chat bubble (no official asset)
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M12 3c5 0 9 3.1 9 7s-4 7-9 7c-.7 0-1.4-.1-2.1-.2L6 20.8c-.3.2-.7-.1-.6-.5l.8-3.2C4 15.9 3 14 3 10c0-3.9 4-7 9-7zm-3 7h6v2H9v-2zm0-3h6v2H9V7zm0 6h4v2H9v-2z" />
    </svg>
  );
}

function ExternalButton({
  href,
  label,
  hint,
  icon,
  tone = "light",
}: {
  href: string;
  label: string;
  hint: string;
  icon?: ReactNode;
  tone?: "light" | "dark";
}) {
  const cls =
    tone === "dark"
      ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
      : "border-orange-200/60 bg-white/70 text-orange-800 hover:bg-white";

  const hintCls =
    "mt-0.5 text-xs " + (tone === "dark" ? "text-white/70" : "text-slate-600");

  const rightCls =
    "text-xs font-semibold " +
    (tone === "dark" ? "text-white/70" : "text-slate-500");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition " +
        cls
      }
    >
      <div className="flex items-center gap-3">
        <div
          className={
            "grid h-10 w-10 place-items-center rounded-2xl border " +
            (tone === "dark"
              ? "border-white/10 bg-white/10"
              : "border-orange-200/40 bg-orange-50/70")
          }
        >
          <span className={tone === "dark" ? "text-white" : "text-orange-700"}>
            {icon}
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className={hintCls}>{hint}</div>
        </div>
      </div>
      <div className={rightCls}>Open →</div>
    </a>
  );
}

/* ---------------------------------
 * Service image slider (CSS-only)
 * - Works in Server Component
 * - No JS, no external libs
 * - Full-frame + bigger for “premium” look
 * --------------------------------- */
function ServiceAutoSlider({
  images,
  altPrefix = "Service",
}: {
  images: readonly string[];
  altPrefix?: string;
}) {
  const safeImages = images.length ? images : ["/about/placeholder.jpg"];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-200/35 bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes teeramonFade {
            0%{opacity:0}
            8%{opacity:1}
            30%{opacity:1}
            38%{opacity:0}
            100%{opacity:0}
          }
          @media (prefers-reduced-motion: reduce) {
            .teeramon-slide { animation: none !important; opacity: 1 !important; }
            .teeramon-slide + .teeramon-slide { display: none !important; }
          }
        `,
        }}
      />

      {/* Full-frame slider (no bottom bar) */}
      <div className="relative h-[280px] w-full sm:h-[360px] md:h-[420px]">
        {safeImages.map((src, idx) => (
          <div
            key={src + idx}
            className="teeramon-slide absolute inset-0"
            style={{
              animation: `teeramonFade ${safeImages.length * 4}s infinite`,
              animationDelay: `${idx * 4}s`,
              opacity: 0,
            }}
          >
            <Image
              src={src}
              alt={`${altPrefix} ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}

        {/* overlays for premium look + legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,rgba(249,115,22,0.22),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

        {/* caption (overlay) */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="text-xs font-semibold text-white/90">
            (Mock) รูปบริการ / บรรยากาศร้าน
          </div>
          <Badge text="Auto" fallback="Auto" tone="dark" />
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      {/* Header */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge text="TEERAMON OPTIC" fallback="TEERAMON OPTIC" />
            <Badge
              text="ร้านแว่นตา โดยนักทัศนมาตร"
              fallback="ร้านแว่นตา โดยนักทัศนมาตร"
            />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            เกี่ยวกับร้าน <span className="text-orange-600">Teeramon Optic</span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-700">
            (Mock) จัดหน้าแบบ Bento Grid และปรับธีมสีให้ contrast ชัดขึ้น โดยสลับกล่อง
            ขาว/ส้ม/เทา/ดำ ให้ยังคุมโทนอบอุ่นของร้าน
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
            >
              ดูสินค้า
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-white"
            >
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        {/*
          Mobile bento:
          - base: 2 columns so it still feels like bento on phones
          - md: 12 columns like desktop
        */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-12">
          {/* Story (big) */}
          <Card variant="orange" className="col-span-2 md:col-span-7 md:row-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-orange-800">เรื่องราวของร้าน</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  ใส่ใจการมองเห็นแบบละเอียด
                  <span className="text-orange-600"> เหมือนทำให้คนในบ้าน</span>
                </h2>
              </div>
              <div className="hidden sm:block">
                <div className="h-12 w-12 rounded-2xl border border-orange-200/70 bg-white/70" />
              </div>
            </div>

            <p className="mt-4 leading-relaxed text-slate-700">
              (Mock) เล่าความตั้งใจของร้าน เช่น การตรวจวัดสายตาอย่างละเอียด การแนะนำเลนส์ให้เหมาะกับการใช้งานจริง
              และการดูแลหลังการขายให้ลูกค้าใช้งานได้ทุกวันอย่างมั่นใจ
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="แนวทาง" value="Personal care" />
              <Stat label="สไตล์" value="Minimal" />
              <Stat label="โทนสี" value="Cream / Orange" />
            </div>

            <div className="mt-6 rounded-2xl border border-orange-200/35 bg-white/75 p-4">
              <div className="text-sm font-semibold text-slate-900">โฟกัสหลักของเรา</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li>• (Mock) ตรวจวัดสายตา + ปรับเลนส์ให้เหมาะกับงาน/ไลฟ์สไตล์</li>
                <li>• (Mock) คัดกรอบที่ใส่สบายและเข้ากับใบหน้า</li>
                <li>• (Mock) บริการหลังการขาย: ปรับแว่น/ทำความสะอาด/ให้คำปรึกษา</li>
              </ul>
            </div>
          </Card>

          {/* Expert (doctor photo + certificates) */}
          <Card variant="light" className="col-span-2 md:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-orange-700">ผู้เชี่ยวชาญ</div>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">นักทัศนมาตร</h3>
              </div>
              <Badge text="Certified" fallback="Certified" />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              (Mock) ใส่ประวัติย่อ เช่น ประสบการณ์ทำงาน แนวทางการดูแลลูกค้า และสิ่งที่ร้านให้ความสำคัญ
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-5">
              {/* Doctor photo */}
              <div className="sm:col-span-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-orange-200/35 bg-orange-50/60">
                  <Image
                    src={IMAGES.doctor}
                    alt="Doctor / Optometrist"
                    fill
                    sizes="(max-width: 640px) 100vw, 280px"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,rgba(249,115,22,0.16),transparent_60%)]" />
                </div>
              </div>

              {/* Certificates */}
              <div className="sm:col-span-3">
                <div className="grid grid-cols-3 gap-2">
                  {IMAGES.certificates.map((src, idx) => (
                    <div
                      key={src + idx}
                      className="relative aspect-[4/5] overflow-hidden rounded-xl border border-orange-200/35 bg-white/70"
                    >
                      <Image
                        src={src}
                        alt={`Certificate ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 33vw, 140px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-600">(Mock) รูปเกียรติบัตร/ใบรับรอง</div>
              </div>
            </div>
          </Card>

          {/* ช่องทาง (with icons) */}
          <Card variant="gray" className="col-span-2 md:col-span-5 md:row-span-2">
            <div className="text-sm font-semibold text-orange-700">ช่องทาง</div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">ติดตามร้าน</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">อัปเดตงาน/โปรโมชัน/บรรยากาศร้าน</p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <ExternalButton
                href={SOCIAL.lineoa}
                label="LINE OA"
                hint="@741wcnor"
                icon={<IconLine />}
              />
              <ExternalButton
                href={SOCIAL.facebook}
                label="Facebook"
                hint="/teeramonoptics"
                icon={<IconFacebook />}
              />
              <ExternalButton
                href={SOCIAL.tiktok}
                label="TikTok"
                hint="@teeramon_optict"
                icon={<IconTikTok />}
              />
              <ExternalButton
                href={SOCIAL.instagram}
                label="Instagram"
                hint="@teeramonoptic"
                icon={<IconInstagram />}
              />
              <ExternalButton
                href={SOCIAL.map}
                label="Google Maps"
                hint="นำทางไปที่ร้าน"
                icon={<IconMapPin />}
              />
            </div>
          </Card>

          {/* Service (with auto sliding images) */}
          <Card variant="light" className="col-span-2 md:col-span-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-orange-700">บริการ</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">บริการที่ลูกค้าพบได้ในร้าน</h3>
                <p className="mt-2 text-sm text-slate-700">(Mock) เพิ่มรูปประกอบและสไลด์อัตโนมัติเพื่อให้กล่องมีชีวิตขึ้น</p>
              </div>
              <Badge text="Service" fallback="Service" />
            </div>

            {/* Give more width to the slider, and make it feel “full frame” */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-8 sm:items-stretch">
              <div className="sm:col-span-3">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: "ตรวจวัดสายตาอย่างละเอียด", desc: "คัดกรอง/วัดค่าสายตา/แนะนำเลนส์ตามการใช้งาน" },
                    { title: "ประกอบเลนส์และปรับแว่น", desc: "ปรับจมูก/ขาแว่น/ความกระชับให้พอดี" },
                    { title: "แนะนำกรอบและเลนส์", desc: "เลือกให้เหมาะกับใบหน้า งาน และงบประมาณ" },
                  ].map((v) => (
                    <div key={v.title} className="rounded-2xl border border-orange-200/35 bg-white/75 p-4">
                      <div className="text-sm font-semibold text-slate-900">{v.title}</div>
                      <div className="mt-1 text-sm text-slate-700">{v.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-5">
                <ServiceAutoSlider images={IMAGES.services} altPrefix="Service" />
              </div>
            </div>
          </Card>

          {/* CTA (dark) */}
          <Card variant="dark" className="col-span-2 md:col-span-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-orange-300">พร้อมเริ่ม?</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">นัดตรวจสายตาหรือปรึกษาการเลือกเลนส์</h3>
                <p className="mt-2 text-sm text-white/75">(Mock) ใส่ข้อความเชิญชวนสั้น ๆ ที่สุภาพและชัดเจน</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
                >
                  ติดต่อเรา
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
                >
                  ดูกรอบแว่น
                </Link>
                <a
                  href={SOCIAL.map}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
                >
                  เปิดแผนที่
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer note */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-orange-100/80 bg-white/60 p-5 text-sm text-slate-700">
          หมายเหตุ: เนื้อหาในหน้านี้เป็น Mock ชั่วคราว — เดี๋ยวค่อยแทนด้วยข้อมูลจริง (ประวัติร้าน/บริการ/เวลา/ที่อยู่/รูปภาพ)
        </div>
      </section>
    </main>
  );
}
