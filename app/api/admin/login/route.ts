import { NextRequest, NextResponse } from "next/server";

type LoginBody = { password?: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);

  const password =
    isRecord(body) && typeof body.password === "string" ? body.password : undefined;

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? "admin_session";
  const COOKIE_VALUE = process.env.ADMIN_COOKIE_VALUE ?? "ok";

  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Missing ADMIN_PASSWORD in env" },
      { status: 500 }
    );
  }

  if (!password) {
    return NextResponse.json({ error: "กรุณาใส่รหัสผ่าน" }, { status: 400 });
  }

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });

  res.cookies.set({
    name: COOKIE_NAME,
    value: COOKIE_VALUE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // production ค่อยเปิด secure: true (https)
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 วัน
  });

  return res;
}
