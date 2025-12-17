// app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import { Product, type ProductDocument } from "../../models/Product";

/**
 * helper: แปลงชื่อเป็น slug
 */
function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // ✅ รองรับทุกภาษา
    .replace(/\s+/g, "-");
}


/**
 * helper: map product document → response object
 */
function mapProduct(doc: ProductDocument) {
  return {
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
  };
}

/**
 * GET /api/products
 * ดึงรายการสินค้า (ใช้ทั้งหน้าเว็บ + admin)
 */
export async function GET() {
  try {
    await connectDB();

    const docs = await Product.find()
      .sort({ createdAt: -1 })
      .lean<ProductDocument[]>();

    const products = docs.map((doc) => ({
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
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    const err = error as Error;
    return NextResponse.json(
      {
        error: "ไม่สามารถดึงข้อมูลสินค้าได้",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * เพิ่มสินค้า (admin)
 */
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = (await request.json()) as {
      name?: string;
      price?: number;
      category?: string;
      color?: string;
      stock?: number;
      description?: string;
      tag?: string;
      isRecommended?: boolean;
      inStock?: boolean;
      isActive?: boolean;
      images?: string[];
    };

    const {
      name,
      price,
      category,
      color,
      stock,
      description,
      tag,
      isRecommended,
      inStock,
      isActive,
      images,
    } = body;

    if (!name || price == null || !category || !color) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลสินค้าให้ครบ (ชื่อ ราคา หมวดหมู่ สี)" },
        { status: 400 }
      );
    }

    // generate slug อัตโนมัติ
const baseSlug = slugify(name);

// ✅ ถ้า baseSlug ว่าง (เช่นชื่อไทยล้วน) ให้ใช้ slug แบบสุ่มสั้น ๆ แทน
const fallback = `product-${Date.now().toString(36)}`;

let slug = baseSlug || fallback;
let count = 1;

while (await Product.exists({ slug })) {
  slug = `${(baseSlug || fallback)}-${count++}`;
}


    const doc = await Product.create({
      name,
      slug,
      price,
      category,
      color,
      stock: stock ?? 0,
      description: description ?? "",
      tag: tag ?? "",
      isRecommended: isRecommended ?? false,
      isActive: isActive ?? true,
      images: images ?? [],
    });

    return NextResponse.json(mapProduct(doc), { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกสินค้าได้" },
      { status: 500 }
    );
  }
}
