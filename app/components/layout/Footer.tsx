// components/layout/Footer.tsx
import Link from "next/link";
import Container from "./Container";

const currentYear = new Date().getFullYear();

const SOCIAL = [
  {
    label: "LINE OA",
    href: "https://line.me/R/ti/p/@741wcnor",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M12 3c5 0 9 3.1 9 7s-4 7-9 7c-.7 0-1.4-.1-2.1-.2L6 20.8c-.3.2-.7-.1-.6-.5l.8-3.2C4 15.9 3 14 3 10c0-3.9 4-7 9-7zm-3 7h6v2H9v-2zm0-3h6v2H9V7zm0 6h4v2H9v-2z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/teeramonoptics",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/teeramonoptic/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@teeramon_optic",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M16.6 3c.5 2.6 2.2 4.6 4.4 5v2.8c-1.8 0-3.4-.6-4.8-1.6v6.2c0 3.5-2.8 6.3-6.3 6.3S3.6 18.9 3.6 15.4s2.8-6.3 6.3-6.3c.4 0 .7 0 1.1.1v3.1c-.3-.1-.7-.2-1.1-.2-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V3h3.4z" />
      </svg>
    ),
  },
  {
    label: "Google Maps",
    href: "https://maps.app.goo.gl/BjpoiYegCirNNqjYA",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M12 2a7 7 0 0 1 7 7c0 5.1-7 13-7 13S5 14.1 5 9a7 7 0 0 1 7-7zm0 9.5A2.5 2.5 0 1 0 12 6.5a2.5 2.5 0 0 0 0 5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-slate-200 bg-slate-50">
      <Container className="grid gap-8 py-8 text-sm text-slate-600 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="text-base font-semibold text-slate-900">TEERAMON OPTIC</div>
          <p className="mt-2 max-w-sm leading-relaxed text-slate-600">
            ร้านแว่นตาและศูนย์เลนส์โปรเกรสซีฟ โดยนักทัศนมาตร
            ตรวจวัดสายตาอย่างละเอียด และแนะนำเลนส์ให้เหมาะกับการใช้งาน
          </p>

          {/* Social icons */}
          <div className="mt-4 flex gap-2">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-2">
          <div className="font-medium text-slate-900">เมนู</div>
          <nav className="flex flex-col gap-1.5">
            <Link href="/" className="hover:text-orange-600 transition">หน้าแรก</Link>
            <Link href="/products" className="hover:text-orange-600 transition">สินค้าทั้งหมด</Link>
            <Link href="/gallery" className="hover:text-orange-600 transition">Gallery</Link>
            <Link href="/appointment" className="hover:text-orange-600 transition">นัดตรวจสายตา</Link>
            <Link href="/about" className="hover:text-orange-600 transition">เกี่ยวกับร้าน</Link>
            <Link href="/contact" className="hover:text-orange-600 transition">ติดต่อเรา</Link>
          </nav>
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          <div className="font-medium text-slate-900">ติดต่อ</div>
          <a href="https://maps.app.goo.gl/BjpoiYegCirNNqjYA" target="_blank" rel="noreferrer" className="flex items-start gap-1.5 hover:text-orange-600 transition">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M12 2a7 7 0 0 1 7 7c0 5.1-7 13-7 13S5 14.1 5 9a7 7 0 0 1 7-7zm0 9.5A2.5 2.5 0 1 0 12 6.5a2.5 2.5 0 0 0 0 5z" />
            </svg>
            ดูแผนที่ร้าน
          </a>
          <a href="https://www.facebook.com/teeramonoptics" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-orange-600 transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
            </svg>
            teeramonoptics
          </a>
          <a href="https://www.instagram.com/teeramonoptic/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-orange-600 transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
            </svg>
            @teeramonoptic
          </a>
          <a href="https://www.tiktok.com/@teeramon_optic" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-orange-600 transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M16.6 3c.5 2.6 2.2 4.6 4.4 5v2.8c-1.8 0-3.4-.6-4.8-1.6v6.2c0 3.5-2.8 6.3-6.3 6.3S3.6 18.9 3.6 15.4s2.8-6.3 6.3-6.3c.4 0 .7 0 1.1.1v3.1c-.3-.1-.7-.2-1.1-.2-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V3h3.4z" />
            </svg>
            @teeramon_optic
          </a>
          <a href="https://line.me/R/ti/p/@741wcnor" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-orange-600 transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M12 3c5 0 9 3.1 9 7s-4 7-9 7c-.7 0-1.4-.1-2.1-.2L6 20.8c-.3.2-.7-.1-.6-.5l.8-3.2C4 15.9 3 14 3 10c0-3.9 4-7 9-7zm-3 7h6v2H9v-2zm0-3h6v2H9V7zm0 6h4v2H9v-2z" />
            </svg>
            LINE OA @741wcnor
          </a>
          <div className="mt-2 text-xs text-slate-500">เปิดทุกวัน 10:00 – 20:00 น.</div>
        </div>
      </Container>

      <div className="border-t border-slate-200 bg-white/80">
        <Container className="flex items-center justify-between py-3 text-xs text-slate-400">
          <span>© {currentYear} TEERAMON OPTIC. All rights reserved.</span>
          <span className="hidden sm:block">ร้านแว่นตาโดยนักทัศนมาตร</span>
        </Container>
      </div>
    </footer>
  );
}
