import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "../../../lib/mongodb";
import { GalleryItem } from "../../../models/GalleryItem";

function sign(params: Record<string, string>, apiSecret: string) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(sorted + apiSecret).digest("hex");
}

export async function POST(req: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Missing Cloudinary env" }, { status: 500 });
  }

  const body = await req.json();
  const { fbUrl, title = "", brand = "", tag = "" } = body as {
    fbUrl: string; title?: string; brand?: string; tag?: string;
  };

  if (!fbUrl) {
    return NextResponse.json({ error: "fbUrl is required" }, { status: 400 });
  }

  // Upload to Cloudinary from URL (server-side)
  const folder = "teeramon/gallery";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = sign({ folder, timestamp }, apiSecret);

  const form = new FormData();
  form.append("file", fbUrl);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  const uploadData = await uploadRes.json();

  if (!uploadRes.ok) {
    return NextResponse.json(
      { error: uploadData.error?.message ?? "Cloudinary upload failed" },
      { status: 500 }
    );
  }

  // Save to MongoDB
  await connectDB();
  const item = await GalleryItem.create({
    imageUrl: uploadData.secure_url,
    publicId: uploadData.public_id,
    title,
    brand,
    tag,
    order: 0,
  });

  return NextResponse.json(item, { status: 201 });
}
