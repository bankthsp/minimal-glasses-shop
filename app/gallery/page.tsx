"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "../components/layout/Container";
import { galleryItems, FACEBOOK_URL, type GalleryItem } from "./data";

const TAGS = ["ทั้งหมด", "กรอบสายตา", "แว่นกันแดด", "เลนส์", "อื่นๆ"] as const;

function LightboxModal({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          aria-label="ปิด"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z" />
          </svg>
        </button>

        {/* รูปภาพ */}
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title ?? item.brand ?? "แว่นตา"}
            className="h-full w-full object-cover"
          />
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="flex flex-col gap-4 p-6">
          {item.tag && (
            <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              {item.tag}
            </span>
          )}

          <div>
            {item.brand && (
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {item.brand}
              </div>
            )}
            {item.title && (
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {item.title}
              </h2>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
              </svg>
              สอบถาม / สั่งผ่าน Facebook
            </a>
            <Link
              href="/appointment"
              className="inline-flex items-center justify-center rounded-full border border-orange-300 px-5 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-50"
            >
              นัดตรวจสายตา
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            * สอบถามราคาและรายละเอียดเพิ่มเติมผ่าน Facebook ได้เลย
          </p>
        </div>
      </div>
    </div>
  );
}

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
    >
      {/* รูปภาพ */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.title ?? item.brand ?? "แว่นตา"}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2394a3b8' font-size='14' font-family='sans-serif'%3Eรูปภาพ%3C/text%3E%3Ctext x='50%25' y='58%25' text-anchor='middle' fill='%2394a3b8' font-size='12' font-family='sans-serif'%3Eกำลังจะมา%3C/text%3E%3C/svg%3E";
        }}
      />

      {/* Overlay เมื่อ hover */}
      <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {item.tag && (
          <span className="mb-1 rounded-full bg-orange-500/90 px-2.5 py-0.5 text-xs font-semibold text-white">
            {item.tag}
          </span>
        )}
        {(item.title || item.brand) && (
          <div className="text-center">
            {item.brand && (
              <div className="text-xs text-white/80">{item.brand}</div>
            )}
            {item.title && (
              <div className="text-sm font-semibold text-white">
                {item.title}
              </div>
            )}
          </div>
        )}
        <div className="mt-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          ดูรายละเอียด →
        </div>
      </div>
    </button>
  );
}

export default function GalleryPage() {
  const [activeTag, setActiveTag] =
    useState<(typeof TAGS)[number]>("ทั้งหมด");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const filtered =
    activeTag === "ทั้งหมด"
      ? galleryItems
      : galleryItems.filter((i) => i.tag === activeTag);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-slate-100 bg-orange-50/60">
        <Container className="py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                TEERAMON OPTIC
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                แกลเลอรีแว่นตา
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                เลือกดูแว่นตาและกรอบของเราได้เลย — สอบถาม/สั่งผ่าน Facebook
              </p>
            </div>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 md:self-auto self-start"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
              </svg>
              สอบถาม / Facebook
            </a>
          </div>

          {/* Filter tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeTag === tag
                    ? "bg-orange-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery grid */}
      <section className="py-10">
        <Container>
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">
              ไม่มีสินค้าในหมวดนี้
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelected(item)}
                />
              ))}
            </div>
          )}

          {/* CTA ด้านล่าง */}
          <div className="mt-16 rounded-3xl border border-orange-100 bg-orange-50 p-8 text-center">
            <p className="text-sm font-semibold text-orange-700">
              ดูเพิ่มเติมได้ที่ Facebook ของร้าน
            </p>
            <p className="mt-1 text-sm text-slate-600">
              อัปเดตรูปใหม่ๆ โปรโมชัน และบรรยากาศร้านผ่านโซเชียลมีเดียของเรา
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
                </svg>
                ไปที่ Facebook
              </a>
              <a
                href="https://www.instagram.com/teeramonoptic/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Lightbox */}
      {selected && (
        <LightboxModal item={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
