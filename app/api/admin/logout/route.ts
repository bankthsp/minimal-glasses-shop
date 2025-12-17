import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// POST /api/admin/logout
export async function POST(_req: NextRequest) {
  // ถ้าใช้ cookie เก็บ token ก็ลบได้ตรงนี้
  const res = NextResponse.json({ ok: true });

  // ถ้าไม่ได้ใช้ cookie ก็ไม่เป็นไร ปล่อยไว้ได้
  res.cookies.delete("token");
  res.cookies.delete("admin_token");

  return res;
}
