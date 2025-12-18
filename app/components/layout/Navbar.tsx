// app/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Container from "./Container";

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้า" },
  { href: "/about", label: "เกี่ยวกับร้าน" },
  { href: "/contact", label: "ติดต่อเรา" },
];

function IconMenu(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
    </svg>
  );
}

function IconClose(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ปิดเมนูเมื่อเปลี่ยนหน้า
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const activeHref = useMemo(() => {
    // สำหรับ highlight active link (รองรับ /products/xxx)
    for (const l of navLinks) {
      if (l.href === "/") {
        if (pathname === "/") return l.href;
      } else if (pathname.startsWith(l.href)) {
        return l.href;
      }
    }
    return "";
  }, [pathname]);

  return (
    <header className="border-b border-orange-200 bg-orange-50/90 backdrop-blur">
      <Container className="flex items-center justify-between py-3 md:py-4">
        {/* โลโก้ + ชื่อร้าน */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src="/logo-teeramon.png"
              alt="Teeramon Optic Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[0.18em] text-orange-600 uppercase">
              TEERAMON OPTIC
            </div>
            <div className="text-xs text-slate-700">
              ร้านแว่นตา โดยนักทัศนมาตร
            </div>
          </div>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "transition " +
                (activeHref === link.href
                  ? "text-orange-600"
                  : "text-slate-700 hover:text-orange-600")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Desktop CTA */}
          <Link
            href="/appointment"
            className="hidden rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 md:inline-flex"
          >
            นัดตรวจสายตา
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white/70 p-2 text-orange-700 shadow-sm transition hover:bg-white md:hidden"
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </Container>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="md:hidden">
          <Container className="pb-4">
            <div className="rounded-2xl border border-orange-200 bg-white/80 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <nav className="grid gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={
                      "rounded-xl px-3 py-2 text-sm font-semibold transition " +
                      (activeHref === link.href
                        ? "bg-orange-50 text-orange-700"
                        : "text-slate-800 hover:bg-orange-50/70")
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-3 border-t border-orange-200/60 pt-3">
                <Link
                  href="/appointment"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
                >
                  นัดตรวจสายตา
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
