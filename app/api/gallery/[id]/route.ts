import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { GalleryItem } from "../../../models/GalleryItem";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    await GalleryItem.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
