// components/layout/Footer.tsx
import Container from "./Container";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-slate-200 bg-slate-50">
      <Container className="flex flex-col gap-6 py-6 text-sm text-slate-600 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-base font-semibold text-slate-900">
            TEERAMON OPTIC
          </div>
          <p className="mt-2 max-w-sm text-slate-600">
            ร้านแว่นตาและศูนย์เลนส์โปรเกรสซีฟ โดยนักทัศนมาตร
            ตรวจวัดสายตาอย่างละเอียด และแนะนำเลนส์ให้เหมาะกับการใช้งานของคุณ
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-medium text-slate-900">ติดต่อ</div>
          <p>โทร: 0x-xxx-xxxx</p>
          <p>LINE: @teeramonoptic</p>
          <p>Facebook: TEERAMON OPTIC</p>
        </div>

        <div className="space-y-2">
          <div className="font-medium text-slate-900">เวลาเปิดทำการ</div>
          <p>ทุกวัน 10:00 - 20:00 น.</p>
          <p className="text-xs text-slate-500">
            * สามารถนัดหมายล่วงหน้าเพื่อตรวจสายตาได้
          </p>
        </div>
      </Container>

      <div className="border-t border-border bg-white/80">
        <Container className="flex items-center justify-between py-3 text-xs text-slate-400">
          <span>© {currentYear} TEERAMON OPTIC. All rights reserved.</span>
          <span>Minimal Orange & White Theme.</span>
        </Container>
      </div>
    </footer>
  );
}
