import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import { GalleryItem } from "../../models/GalleryItem";

export async function GET() {
  try {
    await connectDB();
    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const item = await GalleryItem.create({
      imageUrl: body.imageUrl,
      publicId: body.publicId ?? "",
      title: body.title ?? "",
      brand: body.brand ?? "",
      tag: body.tag ?? "",
      order: body.order ?? 0,
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
