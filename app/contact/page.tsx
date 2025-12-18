// app/contact/page.tsx
// Contact (ติดต่อเรา) — New concept (NOT bento)
// Design goals:
// - Modern, high-contrast, “premium” look (Apple/Linear-ish vibe) but different layout
// - Users can contact in 1–2 clicks (tel / map / social)
// - Works now without backend: mailto form + quick links
// - Server Component (no "use client")

import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "ติดต่อเรา | Teeramon Optic",
  description: "ติดต่อ Teeramon Optic — นัดตรวจสายตา สอบถามสินค้า หรือปรึกษาเลนส์",
};

const CONTACT = {
  facebook: "https://www.facebook.com/teeramonoptics",
  tiktok: "https://www.tiktok.com/@teeramon_optict",
  instagram: "https://www.instagram.com/teeramonoptic/",
  map: "https://maps.app.goo.gl/qDbwLYZK4q7Z7nGV7",
  // TODO: replace with real values
  phoneDisplay: "+66 00 000 0000",
  phoneDial: "+660000000000",
  email: "hello@teeramonoptic.com",
  line: "@teeramonoptic",
} as const;

/* ---------------------------------
 * Small UI helpers
 * --------------------------------- */

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-orange-200/60 bg-white/60 px-3 py-1 text-xs font-semibold text-orange-800 shadow-sm">
      {children}
    </span>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs font-semibold text-white/80">
      {children}
    </kbd>
  );
}

function IconPhone(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M6.6 10.8c1.6 3.1 3.5 5 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2.1.7 3.2.8.5.1.9.5.9 1v3.4c0 .6-.5 1-1 1C10.5 21.2 2.8 13.5 2.8 4.8c0-.6.4-1 1-1h3.4c.5 0 .9.4 1 .9.1 1.1.4 2.2.8 3.2.2.4.1.9-.2 1.2l-2.2 2.5z" />
    </svg>
  );
}

function IconMail(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2 8 5 8-5H4zm16 12V10l-8 5-8-5v10h16z" />
    </svg>
  );
}

function IconMapPin(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M12 2a7 7 0 0 1 7 7c0 5.1-7 13-7 13S5 14.1 5 9a7 7 0 0 1 7-7zm0 9.5A2.5 2.5 0 1 0 12 6.5a2.5 2.5 0 0 0 0 5z" />
    </svg>
  );
}

function IconFacebook(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
    </svg>
  );
}

function IconInstagram(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
    </svg>
  );
}

function IconTikTok(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M16.6 3c.5 2.6 2.2 4.6 4.4 5v2.8c-1.8 0-3.4-.6-4.8-1.6v6.2c0 3.5-2.8 6.3-6.3 6.3S3.6 18.9 3.6 15.4s2.8-6.3 6.3-6.3c.4 0 .7 0 1.1.1v3.1c-.3-.1-.7-.2-1.1-.2-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V3h3.4z" />
    </svg>
  );
}

function ActionButton({
  href,
  label,
  sub,
  icon,
  tone = "light",
}: {
  href: string;
  label: string;
  sub: string;
  icon: ReactNode;
  tone?: "light" | "dark";
}) {
  const isExternal = !href.startsWith("/") && !href.startsWith("#");
  const cls =
    tone === "dark"
      ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
      : "border-orange-200/60 bg-white/75 text-slate-900 hover:bg-white";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={
        "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition " +
        cls
      }
    >
      <div className="flex items-center gap-3">
        <div
          className={
            "grid h-10 w-10 place-items-center rounded-2xl border " +
            (tone === "dark"
              ? "border-white/10 bg-white/10 text-white"
              : "border-orange-200/40 bg-orange-50/70 text-orange-700")
          }
        >
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className={"mt-0.5 text-xs " + (tone === "dark" ? "text-white/70" : "text-slate-600")}>
            {sub}
          </div>
        </div>
      </div>
      <div className={"text-xs font-semibold " + (tone === "dark" ? "text-white/70" : "text-slate-500")}>
        Open →
      </div>
    </a>
  );
}

function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-orange-700">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{desc}</p>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO (new idea): full-bleed dark hero with spotlight + quick actions */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(60%_55%_at_20%_20%,rgba(249,115,22,0.25),transparent_60%),radial-gradient(40%_40%_at_80%_30%,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-orange-500/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>CONTACT</Pill>
                <Pill>Fast response</Pill>
                <Pill>Appointments</Pill>
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                ติดต่อเรา
                <span className="text-orange-300"> แบบเร็ว</span>
                <span className="text-white/80"> และชัดเจน</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
                เลือกช่องทางที่สะดวกที่สุด: โทร / แชท / แผนที่ / หรือส่งข้อความ
                (หน้าแบบใหม่ไม่ซ้ำ Bento)
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`tel:${CONTACT.phoneDial}`}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
                >
                  <IconPhone className="h-4 w-4" />
                  โทรเลย
                </a>
                <a
                  href={CONTACT.map}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
                >
                  <IconMapPin className="h-4 w-4" />
                  เปิดแผนที่
                </a>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
                >
                  ดูสินค้า <Kbd>⌘</Kbd>
                </Link>
              </div>
            </div>

            {/* HERO right: glass panel quick links */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">Quick links</div>
                  <Pill>1–2 clicks</Pill>
                </div>

                <div className="mt-4 grid gap-3">
                  <ActionButton
                    href={`tel:${CONTACT.phoneDial}`}
                    label="Phone"
                    sub={CONTACT.phoneDisplay}
                    icon={<IconPhone />}
                    tone="dark"
                  />
                  <ActionButton
                    href={`mailto:${CONTACT.email}`}
                    label="Email"
                    sub={CONTACT.email}
                    icon={<IconMail />}
                    tone="dark"
                  />
                  <ActionButton
                    href={CONTACT.map}
                    label="Google Maps"
                    sub="นำทางไปที่ร้าน"
                    icon={<IconMapPin />}
                    tone="dark"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-white/70">
                  Tip: ถ้าต้องการนัดตรวจสายตา ให้แจ้ง “ช่วงเวลาที่สะดวก” + “ปัญหาที่ต้องการปรึกษา”
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT: split layout (not bento) */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left column: form */}
          <div className="lg:col-span-7">


            {/* FAQ (new idea): collapsible details */}
            <div className="mt-8">
              <SectionTitle
                eyebrow="FAQ"
                title="ถามบ่อย"
                desc="ช่วยลดการถามซ้ำ และทำให้ลูกค้าติดต่อได้ตรงประเด็น"
              />
              <div className="mt-4 space-y-3">
                {[
                  {
                    q: "อยากนัดตรวจสายตาต้องทำยังไง?",
                    a: "แนะนำให้ส่งช่วงเวลาที่สะดวก + ปัญหาที่ต้องการปรึกษา (เช่น มองไกล/ใกล้, ปวดตา, ใช้คอมเยอะ) แล้วทีมงานจะตอบกลับเพื่อยืนยันนัด",
                  },
                  {
                    q: "ต้องเตรียมอะไรไปที่ร้านไหม?",
                    a: "(Mock) ถ้ามีแว่นเดิม แนะนำให้นำมาด้วย เพื่อช่วยประเมินค่าสายตาและการใช้งานเดิม",
                  },
                  {
                    q: "ติดต่อช่องทางไหนเร็วที่สุด?",
                    a: "โดยทั่วไป Facebook/IG DM จะสะดวกและตอบไว — ถ้าต้องการด่วนให้โทรได้เลย",
                  },
                ].map((item) => (
                  <details
                    key={item.q}
                    className="rounded-2xl border border-orange-100/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                  >
                    <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                      {item.q}
                    </summary>
                    <div className="mt-2 text-sm text-slate-700">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: contact routes + store info (sticky on desktop) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
 
              <div className="mt-6 rounded-3xl border border-slate-200/70 bg-slate-100/70 p-5 shadow-[0_12px_36px_rgba(0,0,0,0.10)]">
                <div className="text-sm font-semibold text-slate-900">Social</div>
                <div className="mt-4 grid gap-3">
                  <ActionButton
                    href={CONTACT.facebook}
                    label="Facebook"
                    sub="/teeramonoptics"
                    icon={<IconFacebook />}
                  />
                  <ActionButton
                    href={CONTACT.instagram}
                    label="Instagram"
                    sub="@teeramonoptic"
                    icon={<IconInstagram />}
                  />
                  <ActionButton
                    href={CONTACT.tiktok}
                    label="TikTok"
                    sub="@teeramon_optict"
                    icon={<IconTikTok />}
                  />
                </div>
              </div>            
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">© Teeramon Optic</div>
          <div className="flex flex-wrap gap-2">
            <Link className="text-sm font-semibold text-orange-700 hover:underline" href="/">
              Home
            </Link>
            <Link className="text-sm font-semibold text-orange-700 hover:underline" href="/products">
              Products
            </Link>
            <a className="text-sm font-semibold text-orange-700 hover:underline" href={CONTACT.map} target="_blank" rel="noreferrer">
              Map
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
