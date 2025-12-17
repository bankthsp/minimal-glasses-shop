import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      preferredDate,
      timeSlot,
      note,
    } = body;

    const resend = new Resend(process.env.RESEND_API_KEY);

    // ✅ ดึงค่าเมลตัวเองจาก env
    const targetEmail = process.env.APPOINTMENT_NOTIFY_EMAIL;

    // ✅ กันเคสลืมตั้งค่า env
    if (!targetEmail) {
      console.error("APPOINTMENT_NOTIFY_EMAIL is not set in .env.local");
      return NextResponse.json(
        { error: "ระบบยังไม่ได้ตั้งค่าอีเมลปลายทาง (APPOINTMENT_NOTIFY_EMAIL)" },
        { status: 500 }
      );
    }

    const subject = "📅 มีการนัดหมายตรวจสายตาใหม่";

    const html = `
      <h2>รายละเอียดการนัดหมาย</h2>
      <p><strong>ชื่อ:</strong> ${fullName}</p>
      <p><strong>เบอร์โทร:</strong> ${phone}</p>
      <p><strong>อีเมลลูกค้า:</strong> ${email}</p>
      <p><strong>วันที่ต้องการนัด:</strong> ${preferredDate}</p>
      <p><strong>ช่วงเวลา:</strong> ${timeSlot}</p>
      <p><strong>หมายเหตุ:</strong> ${note || "-"}</p>
    `;

    const { error } = await resend.emails.send({
      from: "Teeramon Optic <onboarding@resend.dev>",
      to: [targetEmail],   // 🔥 ตอนนี้ ts รู้แล้วว่า targetEmail เป็น string แน่นอน
      subject,
      html,
    });

    if (error) {
      console.error("EMAIL ERROR:", error);
      return NextResponse.json(
        { error: "ไม่สามารถส่งอีเมลได้ (Testing Mode)" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("APPOINTMENT API ERROR:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
