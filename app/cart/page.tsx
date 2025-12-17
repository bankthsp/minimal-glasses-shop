"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

export default function CartPage() {
  const router = useRouter();   // 👈 เพิ่มบรรทัดนี้
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false); // 👈 ตรงนี้สำคัญ ชื่อ setLoaded แบบนี้


     useEffect(() => {
    if (!cartEnabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);


  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    }
  };

  const handleChangeQty = (id: string, qty: number) => {
    if (qty < 1) return;
    updateCart(
      items.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    updateCart(items.filter((item) => item.id !== id));
  };

  const handleClear = () => {
    updateCart([]);
  };

  if (!cartEnabled) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Container className="py-12 space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            ตะกร้าสินค้า
          </h1>
          <p className="text-sm text-slate-500">
            ขณะนี้ยังไม่เปิดให้สั่งซื้อออนไลน์ผ่านเว็บไซต์
            ระบบตะกร้าจะเปิดใช้งานในภายหลัง
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

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <Container className="py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            ตะกร้าสินค้า
          </h1>
          <Link
            href="/products"
            className="text-sm text-orange-600 hover:underline"
          >
            เลือกสินค้าเพิ่ม
          </Link>
        </Container>
      </section>

      <section className="py-8">
        <Container className="grid gap-8 lg:grid-cols-[2fr,1.2fr]">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <p className="text-sm text-slate-500">
                  ยังไม่มีสินค้าในตะกร้า
                </p>
                <div className="mt-4">
                  <Link
                    href="/products"
                    className="inline-flex rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
                  >
                    เลือกดูสินค้า
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    สินค้าในตะกร้า{" "}
                    <span className="font-medium text-orange-600">
                      {items.length}
                    </span>{" "}
                    รายการ
                  </p>
                  <button
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    ล้างตะกร้าทั้งหมด
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          ฿{item.price.toLocaleString("th-TH")} ต่อชิ้น
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-full border border-slate-300 bg-slate-50">
                          <button
                            onClick={() =>
                              handleChangeQty(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              handleChangeQty(
                                item.id,
                                Number(e.target.value) || 1
                              )
                            }
                            className="w-12 border-x border-slate-200 bg-white py-1 text-center text-sm outline-none"
                          />
                          <button
                            onClick={() =>
                              handleChangeQty(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="w-24 text-right text-sm font-semibold text-slate-900">
                          ฿
                          {(item.price * item.quantity).toLocaleString(
                            "th-TH"
                          )}
                        </p>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-xs text-slate-400 hover:text-red-500"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              สรุปยอดชำระ
            </h2>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>ยอดรวมสินค้า</span>
                <span>฿{total.toLocaleString("th-TH")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ค่าจัดส่ง</span>
                <span>คิดตามจริงหลังจากยืนยันคำสั่งซื้อ</span>
              </div>
            </div>
            <button
            disabled={items.length === 0}
            onClick={() => {
                if (items.length === 0) return;
                router.push("/checkout");
            }}
            className={`mt-2 inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition ${
                items.length === 0
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
            >
            ดำเนินการสั่งซื้อ (Demo)
            </button>

            <p className="text-xs text-slate-400">
              * ขั้นตอนชำระเงินจริงและเชื่อมระบบชำระเงินจะทำในเฟสถัดไป
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
