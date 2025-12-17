// app/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "./Container";

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้า" },
  { href: "/about", label: "เกี่ยวกับร้าน" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export default function Navbar() {
  const pathname = usePathname();

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

        {/* เมนู (จอ md ขึ้นไป) */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  isActive
                    ? "text-orange-600"
                    : "text-slate-700 hover:text-orange-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ปุ่ม Call to Action */}
        <Link
          href="/appointment"
          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
        นัดตรวจสายตา
      </Link>
      </Container>
    </header>
  );
}
