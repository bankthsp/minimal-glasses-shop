import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import { Order } from "../../models/Order";
import { Product } from "../../models/Product"; // ✅ เพิ่ม (ปรับ path ตามโปรเจกต์จริง)

// status ที่อนุญาต (สำหรับ filter + admin)
const allowedStatuses = ["pending", "paid", "shipped", "completed", "cancelled"] as const;
type OrderStatus = (typeof allowedStatuses)[number];

function isOrderStatus(v: string | null): v is OrderStatus {
  return v !== null && (allowedStatuses as readonly string[]).includes(v);
}

// โครงสร้างที่เราจะใช้ตอน list (lean object)
type OrderListRow = {
  _id: unknown;
  customerName?: string;
  phone?: string;
  totalAmount?: number;
  status?: string;
  createdAt?: Date;
  items?: unknown[];
};

type OrderItemPayload = {
  productId: string;
  name: string;
  price: number;
  quantity: number; // ✅ ของเดิมใช้ quantity
};

type OrderPayload = {
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  paymentMethod?: "bank_transfer" | "cash_on_pickup";
  items?: OrderItemPayload[];
  totalAmount?: number;
};

// POST /api/orders → สร้างคำสั่งซื้อ + เช็ก/ตัด stock
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = (await req.json()) as OrderPayload;
    const items = body.items ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "ไม่มีรายการสินค้า" }, { status: 400 });
    }

    // เก็บรายการที่ “ตัด stock สำเร็จแล้ว” เผื่อ rollback
    const deducted: { productId: string; quantity: number }[] = [];

    for (const it of items) {
      const productId = it.productId;
      const qty = it.quantity;

      if (!productId || !Number.isFinite(qty) || qty <= 0) {
        // rollback
        for (const d of deducted) {
          await Product.updateOne({ _id: d.productId }, { $inc: { stock: d.quantity } });
        }
        return NextResponse.json({ error: "ข้อมูลสินค้าไม่ถูกต้อง" }, { status: 400 });
      }

      // ✅ ตัด stock แบบ atomic: ต้องมี stock >= qty เท่านั้นถึงจะตัดได้
      const updated = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!updated) {
        // ❌ stock ไม่พอ → rollback ทั้งหมดที่ตัดไปแล้ว
        for (const d of deducted) {
          await Product.updateOne({ _id: d.productId }, { $inc: { stock: d.quantity } });
        }
        return NextResponse.json(
          { error: "สต็อกสินค้าไม่พอ กรุณาปรับจำนวนแล้วลองใหม่" },
          { status: 400 }
        );
      }

      deducted.push({ productId, quantity: qty });
    }

    // ✅ (แนะนำ) คำนวณ total ใหม่จาก items เพื่อกัน client ส่งมั่ว
    const computedTotal = items.reduce((sum, it) => sum + (it.price ?? 0) * (it.quantity ?? 0), 0);

    const orderDoc = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      address: body.address,
      note: body.note,
      paymentMethod: body.paymentMethod,
      items: items,
      totalAmount: computedTotal, // ใช้ computedTotal
      status: "pending",
    });

    return NextResponse.json(
      {
        ok: true,
        orderId: orderDoc._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      {
        error: "ไม่สามารถบันทึกคำสั่งซื้อได้",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}


//PATCH /api/orders/:id  body: { "status": "paid" }
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { orderId, status } = body;

    const allowed = ["pending", "paid", "shipped", "cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "ไม่พบออเดอร์" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



// GET /api/orders → ดึงรายการคำสั่งซื้อ (ไว้ใช้หน้า Admin ภายหลัง) + filter status
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    const filter: { status?: OrderStatus } = {};
    if (isOrderStatus(statusParam)) {
      filter.status = statusParam;
    }

    const docs: OrderListRow[] = await Order.find(filter)
      .sort({ createdAt: -1 })
      .select("_id customerName phone totalAmount status createdAt items")
      .lean();

    const orders = docs.map((o) => ({
      id: String(o._id),
      customerName: o.customerName ?? "",
      phone: o.phone ?? "",
      totalAmount: o.totalAmount ?? 0,
      status: o.status ?? "pending",
      createdAt: o.createdAt ? o.createdAt.toISOString() : "",
      itemsCount: Array.isArray(o.items) ? o.items.length : 0,
    }));

    return NextResponse.json({ ok: true, orders }, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      {
        error: "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
