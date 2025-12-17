// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Product } from "../../../models/Product";

/**
 * helper: แปลงชื่อเป็น slug
 */
function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    // ✅ อนุญาตภาษาไทย + อังกฤษ + ตัวเลข
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}


/**
 * GET /api/products/[id]
 * ดึงสินค้ารายตัว (admin + product detail)
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();

    const doc = await Product.findById(id);

    if (!doc) {
      return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
    }

    return NextResponse.json({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      price: doc.price,
      category: doc.category,
      color: doc.color,
      stock: doc.stock,
      description: doc.description,
      tag: doc.tag,
      isRecommended: doc.isRecommended,
      isActive: doc.isActive,
      images: doc.images,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลสินค้าได้", detail: err.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[id]
 * แก้ไขสินค้า (admin)
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();

    const body = (await req.json()) as {
      name?: string;
      price?: number | string;
      category?: string;
      color?: string;
      stock?: number | string;
      description?: string;
      tag?: string;
      isRecommended?: boolean;
      isActive?: boolean;
      images?: string[];
      slug?: unknown; // ✅ กัน client ส่งมา
    };

    // ✅ ห้ามรับ slug จาก client (กันค่าว่าง/กันแก้ URL เอง)
    if ("slug" in body) {
      delete body.slug;
    }

    // ✅ normalize ตัวเลข
    if (body.stock !== undefined) {
      const n = typeof body.stock === "number" ? body.stock : Number(body.stock);
      if (Number.isFinite(n) && n >= 0) body.stock = n;
      else delete body.stock;
    }

    if (body.price !== undefined) {
      const n = typeof body.price === "number" ? body.price : Number(body.price);
      if (Number.isFinite(n) && n >= 0) body.price = n;
      else delete body.price;
    }

    // ✅ ทำ update แบบ whitelist (ไม่ spread ทั้งก้อน)
    const update: Record<string, unknown> = {};

    if (typeof body.name === "string") update.name = body.name;
    if (typeof body.price === "number") update.price = body.price;
    if (typeof body.category === "string") update.category = body.category;
    if (typeof body.color === "string") update.color = body.color;
    if (typeof body.stock === "number") update.stock = body.stock;
    if (typeof body.description === "string") update.description = body.description;
    if (typeof body.tag === "string") update.tag = body.tag;
    if (typeof body.isRecommended === "boolean") update.isRecommended = body.isRecommended;
    if (typeof body.isActive === "boolean") update.isActive = body.isActive;
    if (Array.isArray(body.images)) update.images = body.images.filter((x) => typeof x === "string");

    // ✅ ถ้าแก้ name → regenerate slug เสมอ
    if (typeof body.name === "string" && body.name.trim()) {
      const baseSlug = slugify(body.name);
      let slug = baseSlug;
      let count = 1;

      while (
        await Product.exists({
          slug,
          _id: { $ne: id },
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }

      update.slug = slug;
    }

    const doc = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
    }

    return NextResponse.json(
      { ok: true, id: doc._id.toString(), slug: doc.slug, stock: doc.stock },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: "ไม่สามารถแก้ไขสินค้าได้", detail: err.message },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/products/[id]
 * ลบสินค้า (admin)
 */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();

    const doc = await Product.findByIdAndDelete(id);

    if (!doc) {
      return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: "ไม่สามารถลบสินค้าได้", detail: err.message },
      { status: 500 }
    );
  }
}
