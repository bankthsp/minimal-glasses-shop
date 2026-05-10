import { NextRequest, NextResponse } from "next/server";

const PAGE_ID = process.env.FACEBOOK_PAGE_ID ?? "teeramonoptics";
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN ?? "";

type FBImage = { source: string; width: number; height: number };
type FBPhoto = { id: string; images?: FBImage[]; name?: string; created_time?: string };

export async function GET(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "ยังไม่ได้ตั้งค่า FACEBOOK_PAGE_ACCESS_TOKEN" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const after = searchParams.get("after") ?? "";

  const url = new URL(`https://graph.facebook.com/v19.0/${PAGE_ID}/photos`);
  url.searchParams.set("fields", "images,name,created_time");
  url.searchParams.set("type", "uploaded");
  url.searchParams.set("limit", "24");
  url.searchParams.set("access_token", ACCESS_TOKEN);
  if (after) url.searchParams.set("after", after);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "Facebook API error" },
      { status: 500 }
    );
  }

  const photos = ((data.data ?? []) as FBPhoto[])
    .map((photo) => {
      const images = photo.images ?? [];
      const largest = [...images].sort((a, b) => b.width - a.width)[0];
      const thumb = [...images].sort((a, b) => a.width - b.width).find((i) => i.width >= 200);
      return {
        id: photo.id,
        url: largest?.source ?? "",
        thumb: thumb?.source ?? largest?.source ?? "",
        name: photo.name ?? "",
        created_time: photo.created_time ?? "",
      };
    })
    .filter((p) => p.url);

  return NextResponse.json({ photos, paging: data.paging ?? null });
}
