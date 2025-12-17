import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import {Order} from "../../../models/Order";

const allowedStatuses = ["pending", "paid", "shipped", "completed", "cancelled"] as const;
type OrderStatus = (typeof allowedStatuses)[number];

type RouteContext = {
  // ✅ ในบางโหมด next ส่ง params มาเป็น Promise
  params: Promise<{ id: string }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (allowedStatuses as readonly string[]).includes(value);
}

function isValidObjectId(value: string): boolean {
  return mongoose.Types.ObjectId.isValid(value);
}

async function getIdOrResponse(ctx: RouteContext): Promise<{ id: string } | NextResponse> {
  const { id } = await ctx.params; // ✅ unwrap promise

  if (!id) {
    return NextResponse.json(
      { error: "ต้องระบุ id ใน URL เช่น /api/orders/<id>" },
      { status: 400 }
    );
  }

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "รูปแบบ id ไม่ถูกต้อง", debug: { received: id, length: id.length } },
      { status: 400 }
    );
  }

  return { id };
}

// GET /api/orders/:id
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const parsed = await getIdOrResponse(ctx);
  if (parsed instanceof NextResponse) return parsed;

  try {
    await connectDB();

    const doc = await Order.findById(parsed.id).lean<unknown>();
    if (!doc) {
      return NextResponse.json({ error: "ไม่พบออเดอร์นี้" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, order: doc });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "ดึงข้อมูลออเดอร์ไม่สำเร็จ", detail: message },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/:id  body: { "status": "paid" }
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const parsed = await getIdOrResponse(ctx);
  if (parsed instanceof NextResponse) return parsed;

  try {
    const body: unknown = await req.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    if (!("status" in body)) {
      return NextResponse.json({ error: "ต้องส่ง status" }, { status: 400 });
    }

    const statusValue = body.status;
    if (!isOrderStatus(statusValue)) {
      return NextResponse.json(
        { error: `status ไม่ถูกต้อง (ต้องเป็น ${allowedStatuses.join(", ")})` },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Order.findByIdAndUpdate(
      parsed.id,
      { status: statusValue },
      { new: true, runValidators: true }
    ).lean<unknown>();

    if (!updated) {
      return NextResponse.json({ error: "ไม่พบออเดอร์นี้" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (error) {
    if (isRecord(error) && error.name === "ValidationError") {
      const message = typeof error.message === "string" ? error.message : "ValidationError";
      return NextResponse.json(
        { error: "ข้อมูลอัปเดตไม่ถูกต้อง", detail: message },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "อัปเดตออเดอร์ไม่สำเร็จ", detail: message },
      { status: 500 }
    );
  }
}
