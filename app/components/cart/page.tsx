// app/cart/page.tsx
"use client";

import Container from "../../components/layout/Container";
import { useCart } from "../../components/cart/CartContext";
import { CART_ENABLED } from "../../config/shopConfig";
import Link from "next/link";

export default function CartPage() {
  const { items, totalAmount, totalQuantity, removeFromCart, clearCart } =
    useCart();

  if (!CART_ENABLED) {
    return (
      <main className="min-h-[60vh] bg-slate-50">
        <Container className="py-10 space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900">
            ตะกร้าสินค้า
          </h1>
          <p className="text-sm text-slate-600">
            ระบบสั่งซื้อออนไลน์ยังไม่เปิดให้ใช้งานในขณะนี้
            หากต้องการสอบถามราคาหรือค่าสายตา สามารถติดต่อร้านได้โดยตรงครับ
          </p>
          <Link
            href="/products"
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-orange-500 hover:text-orange-600"
          >
            กลับไปดูสินค้า
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-slate-50">
      <Container className="py-10 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              ตะกร้าสินค้า
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              มีสินค้า {totalQuantity} ชิ้นในตะกร้า
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-slate-500 hover:text-red-500"
            >
              ล้างตะกร้าทั้งหมด
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex min-height-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 py-10">
            <div className="text-center text-sm text-slate-500 space-y-2">
              <p>ตะกร้าของคุณยังว่างอยู่</p>
              <Link
                href="/products"
                className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:border-orange-500 hover:text-orange-600"
              >
                เลือกดูกรอบแว่นและเลนส์
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[2fr,1fr] items-start">
            {/* รายการสินค้า */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {item.product.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.product.tag}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      จำนวน: {item.quantity} ชิ้น
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm font-semibold text-slate-900">
                      ฿
                      {(
                        item.quantity * item.product.price
                      ).toLocaleString("th-TH")}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      ลบออก
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* สรุปยอด */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm space-y-3">
              <div className="flex items-center justify-between">
                <span>ยอดรวมสินค้า</span>
                <span>฿{totalAmount.toLocaleString("th-TH")}</span>
              </div>
              <p className="text-xs text-slate-500">
                * ราคานี้เป็นตัวอย่าง mock สำหรับระบบหน้าบ้านเท่านั้น
                ขั้นตอนชำระเงินจริงเราจะไปทำในส่วน Checkout + Backend ภายหลัง
              </p>
              <Link
                href="/checkout"
                className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                ดำเนินการสั่งซื้อ
              </Link>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
