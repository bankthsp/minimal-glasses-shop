// app/appointment/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import Container from "../components/layout/Container";

interface AppointmentForm {
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  timeSlot: string;
  note: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function AppointmentPage() {
  const [form, setForm] = useState<AppointmentForm>({
    fullName: "",
    phone: "",
    email: "",
    preferredDate: "",
    timeSlot: "",
    note: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setStatus("submitting");
  setErrorMessage(null);

  try {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    console.log("appointments status:", res.status);

    // 👇 ไม่ใช้ any แล้ว ใช้ unknown + เช็กแบบปลอดภัย
    let data: unknown = null;

    try {
      data = await res.json();
      console.log("appointments response body:", data);
    } catch {
      console.log("cannot parse json response");
    }

    if (!res.ok) {
      // ดึง message จาก data.error ถ้ามี และเป็น string
      let message = `เกิดข้อผิดพลาด (status ${res.status})`;

      if (data && typeof data === "object" && "error" in data) {
        const maybeError = (data as { error?: unknown }).error;
        if (typeof maybeError === "string") {
          message = maybeError;
        }
      }

      throw new Error(message);
    }

    // สำเร็จ
    setStatus("success");
    setForm({
      fullName: "",
      phone: "",
      email: "",
      preferredDate: "",
      timeSlot: "",
      note: "",
    });
  } catch (err) {
    console.error("submit error:", err);
    setStatus("error");

    const message =
      err instanceof Error ? err.message : "ไม่สามารถส่งคำขอได้";
    setErrorMessage(message);
  }
}




  return (
    <main className="min-h-[60vh] bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <Container className="py-8 md:py-10 space-y-2">
          <div className="text-sm font-semibold uppercase tracking-[0.26em] text-orange-500">
            นัดตรวจสายตา
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            แบบฟอร์มนัดตรวจสายตากับนักทัศนมาตร
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            กรอกข้อมูลติดต่อและช่วงเวลาที่สะดวก
            ทางร้านจะติดต่อกลับเพื่อยืนยันนัดอีกครั้งผ่านโทรศัพท์หรือ LINE
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-8 md:py-10 grid gap-8 md:grid-cols-[1.4fr,1fr] items-start">
          {/* ฟอร์มจองนัด */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 text-sm"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  เบอร์ติดต่อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                อีเมล (ถ้ามี)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="ใช้สำหรับส่งรายละเอียดการนัด (ไม่บังคับ)"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  วันที่สะดวกเข้ารับการตรวจ <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.preferredDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, preferredDate: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  ช่วงเวลาที่สะดวก <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.timeSlot}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, timeSlot: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">-- เลือกช่วงเวลา --</option>
                  <option value="เช้า (10:00 - 12:00)">
                    เช้า (10:00 - 12:00)
                  </option>
                  <option value="บ่าย (13:00 - 16:00)">
                    บ่าย (13:00 - 16:00)
                  </option>
                  <option value="เย็น (16:00 - 19:00)">
                    เย็น (16:00 - 19:00)
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                ข้อมูลเพิ่มเติม
              </label>
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
                placeholder="เช่น ใส่แว่นเดิมอยู่, มีอาการปวดตา/ปวดหัว, สนใจเลนส์โปรเกรสซีฟ เป็นต้น"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* สถานะ / ปุ่มส่ง */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                  status === "submitting"
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {status === "submitting"
                  ? "กำลังส่งคำขอ..."
                  : "ส่งคำขอนัดตรวจสายตา"}
              </button>

              {status === "success" && (
                <p className="text-xs text-emerald-600">
                  ส่งคำขอนัดเรียบร้อยแล้ว ทางร้านจะติดต่อกลับเพื่อยืนยันนัดอีกครั้งครับ
                </p>
              )}

              {status === "error" && (
                <p className="text-xs text-red-600">
                  {errorMessage ||
                    "ไม่สามารถส่งคำขอได้ กรุณาลองใหม่อีกครั้ง หรือติดต่อทางโทรศัพท์/LINE"}
                </p>
              )}

              <p className="text-[11px] text-slate-500">
                * การส่งแบบฟอร์มนี้ยังไม่ถือเป็นการยืนยันนัด
                ต้องรอให้ทางร้านติดต่อกลับเพื่อคอนเฟิร์มวันและเวลาอีกครั้ง
              </p>
            </div>
          </form>

          {/* กล่องข้อมูลติดต่อร้าน */}
          <aside className="space-y-4 rounded-2xl border border-orange-100 bg-orange-50/70 p-5 md:p-6 text-sm text-slate-800">
            <h2 className="text-base font-semibold text-orange-700">
              ข้อมูลติดต่อ TEERAMON OPTIC
            </h2>
            <p className="text-xs text-slate-700">
              หากต้องการนัดด่วน หรือสอบถามเรื่องค่าสายตา/เลนส์
              สามารถติดต่อทางช่องทางด้านล่างได้โดยตรง
            </p>
            <div className="space-y-1 text-sm">
              <p>โทร: 0x-xxx-xxxx</p>
              <p>LINE: @teeramonoptic</p>
              <p>Facebook: TEERAMON OPTIC</p>
            </div>
            <p className="text-[11px] text-slate-600">
              * เวลาเปิดทำการ: 10:00 – 20:00 น.
              (กรุณาเผื่อเวลาในการตรวจสายตาประมาณ 30–60 นาที)
            </p>
          </aside>
        </Container>
      </section>
    </main>
  );
}
