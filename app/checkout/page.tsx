"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "../components/layout/Container";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const STORAGE_KEY = "teeramon_cart";

const cartEnabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CART_ENABLED === "true";

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<"bank_transfer" | "cash_on_pickup">("bank_transfer");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!cartEnabled) {
      setLoaded(true);
      return;
    }

    if (typeof window === "undefined") return;

    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as CartItem[];
        setItems(parsed);
      } catch (e) {
        console.error("parse cart error:", e);
      }
    }

    setLoaded(true);
  }, []);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cartEnabled) return;

    if (items.length === 0) {
      setError("ตะกร้าสินค้าว่าง กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
      return;
    }
    if (!customerName || !phone || !address) {
      setError("กรุณากรอก ชื่อ เบอร์โทร และที่อยู่ ให้ครบถ้วน");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        customerName,
        phone,
        email,
        address,
        note,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ไม่สามารถบันทึกคำสั่งซื้อได้");
      }

      // เคลียร์ตะกร้า
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setItems([]);

      setSuccessMessage(
        `บันทึกคำสั่งซื้อเรียบร้อยแล้ว หมายเลขคำสั่งซื้อ: ${data.orderId}`
      );

      // จะเปลี่ยนเป็น redirect ไปหน้า Thank you ก็ได้
      // router.push("/"); 
    } catch (err) {
      console.error("checkout error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // กรณียังไม่เปิดระบบ cart/checkout
  if (!cartEnabled) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Container className="py-12 space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            สรุปคำสั่งซื้อ
          </h1>
          <p className="text-sm text-slate-500">
            ขณะนี้ยังไม่เปิดให้สั่งซื้อออนไลน์ผ่านเว็บไซต์
            ระบบสั่งซื้อจะเปิดใช้งานในภายหลัง
          </p>
          <Link
            href="/products"
            className="inline-flex rounded-full border border-orange-400 px-5 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
          >
            ดูสินค้าทั้งหมด
          </Link>
        </Container>
      </main>
    );
  }

  if (!loaded) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Container className="py-12">
          <p className="text-center text-sm text-slate-500">
            กำลังโหลดข้อมูลตะกร้า...
          </p>
        </Container>
      </main>
    );
  }

  if (loaded && items.length === 0 && !successMessage) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Container className="py-12 space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            สรุปคำสั่งซื้อ
          </h1>
          <p className="text-sm text-slate-500">
            ยังไม่มีสินค้าในตะกร้า กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ
          </p>
          <Link
            href="/products"
            className="inline-flex rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            เลือกดูสินค้า
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <Container className="py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            สรุปคำสั่งซื้อ
          </h1>
          <Link
            href="/cart"
            className="text-sm text-orange-600 hover:underline"
          >
            กลับไปแก้ไขตะกร้า
          </Link>
        </Container>
      </section>

      <section className="py-8">
        <Container className="grid gap-8 lg:grid-cols-[1.6fr,1.1fr]">
          {/* ฟอร์มข้อมูลลูกค้า */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              ข้อมูลสำหรับจัดส่ง / ติดต่อกลับ
            </h2>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {successMessage && (
              <p className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                {successMessage}
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  เบอร์ติดต่อ *
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                อีเมล (ถ้ามี)
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                ที่อยู่สำหรับจัดส่ง / ติดต่อกลับ *
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                หมายเหตุเพิ่มเติม
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                rows={3}
                placeholder="เช่น ต้องการนัดรับแว่นที่สาขา, ช่วงเวลาที่สะดวกให้โทรกลับ ฯลฯ"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">
                วิธีชำระเงิน
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-orange-400">
                  <input
                    type="radio"
                    className="h-4 w-4 text-orange-600"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                  />
                  โอนผ่านบัญชีธนาคาร (ชำระก่อนรับสินค้า)
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-orange-400">
                  <input
                    type="radio"
                    className="h-4 w-4 text-orange-600"
                    checked={paymentMethod === "cash_on_pickup"}
                    onChange={() => setPaymentMethod("cash_on_pickup")}
                  />
                  ชำระที่หน้าร้าน / วันมารับแว่น
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !!successMessage}
              className={`mt-2 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition ${
                submitting || !!successMessage
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {submitting ? "กำลังบันทึกคำสั่งซื้อ..." : "ยืนยันคำสั่งซื้อ"}
            </button>

            <p className="text-xs text-slate-400">
              * ระบบนี้เป็นการแจ้งคำสั่งซื้อเบื้องต้น
              เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันรายละเอียดและสรุปยอดการชำระเงินอีกครั้ง
            </p>
          </form>

          {/* สรุปตะกร้าทางขวา */}
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              สรุปรายการสินค้า
            </h2>
            <div className="space-y-3 text-sm text-slate-700">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      ฿{item.price.toLocaleString("th-TH")} x{" "}
                      {item.quantity} ชิ้น
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    ฿
                    {(item.price * item.quantity).toLocaleString("th-TH")}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-3 border-slate-200" />

            <div className="flex justify-between text-sm text-slate-700">
              <span>ยอดรวมสินค้า</span>
              <span className="text-lg font-semibold text-orange-600">
                ฿{total.toLocaleString("th-TH")}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              * ค่าจัดส่งและส่วนลด (ถ้ามี) จะสรุปอีกครั้งตอนยืนยันออเดอร์กับเจ้าหน้าที่
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
