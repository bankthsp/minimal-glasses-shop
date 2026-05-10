// app/api/dev/seed-products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Product } from "../../../models/Product";
import { mockProducts } from "../../../data/products";

export async function GET() {
  try {
    // กันไว้ไม่ให้เรียก seed ใน production โดยไม่ตั้งใจ
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Seed route is disabled in production" },
        { status: 403 }
      );
    }

    await connectDB();

    const count = await Product.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        ok: true,
        message: "มีสินค้าในระบบแล้ว ไม่จำเป็นต้อง seed อีก",
        count,
      });
    }

    // ใช้ any เฉพาะตรงนี้ เพื่อไม่ให้ TS บ่นเรื่อง type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source = mockProducts as any[];

    await Product.insertMany(
      source.map((p) => ({
        name: p.name,
        price: p.price,
        category: p.category,
        color: p.color,
        description: p.description,
        tag: p.tag,
        isRecommended: p.isRecommended,
        //inStock: p.inStock,
        images: p.images,
      }))
    );

    const newCount = await Product.countDocuments();

    return NextResponse.json({
      ok: true,
      message: "Seed ข้อมูลสินค้าสำเร็จ",
      count: newCount,
    });
    } catch (error) {
    console.error("Seed products error:", error);
    const err = error as Error;
    return NextResponse.json(
      {
        error: "ไม่สามารถ seed ข้อมูลได้",
        detail: err.message,           // 👈 เพิ่ม detail
      },
      { status: 500 }
    );
  }
}
