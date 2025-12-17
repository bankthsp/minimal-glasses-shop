import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type SignBody = {
  folder?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/**
 * Cloudinary signature:
 * signature = sha1( param1=value1&param2=value2&... + API_SECRET )
 * (ต้องเรียง key ตามตัวอักษร)
 */
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
    return NextResponse.json(
      { error: "Missing Cloudinary env (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET)" },
      { status: 500 }
    );
  }

  const body: unknown = await req.json().catch(() => ({}));
  const folder =
    isRecord(body) && typeof body.folder === "string"
      ? body.folder
      : "minimal-glasses/products";

  // timestamp ต้องเป็นวินาที
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // params ที่ต้องเซ็น (ใส่เท่าที่เราจะใช้)
  const paramsToSign: Record<string, string> = {
    folder,
    timestamp,
  };

  const signature = sign(paramsToSign, apiSecret);

  return NextResponse.json(
    {
      ok: true,
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    },
    { status: 200 }
  );
}
