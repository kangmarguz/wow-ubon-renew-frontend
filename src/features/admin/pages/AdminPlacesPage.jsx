import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

export function AdminPlacesPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="แอดมิน" title="จัดการสถานที่" description="หน้านี้ใช้ต่อกับ endpoint สำหรับอนุมัติ ปฏิเสธ และตรวจสอบรายการสถานที่" />
      <SectionCard title="คิวรายการรออนุมัติ">
        <div className="overflow-hidden rounded-3xl border border-ink/10">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-forest text-white">
              <tr>
                <th className="px-4 py-3">สถานที่</th>
                <th className="px-4 py-3">ประเภท</th>
                <th className="px-4 py-3">ผู้ส่ง</th>
                <th className="px-4 py-3">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-4 py-3">สถานที่ตัวอย่าง</td>
                <td className="px-4 py-3">ATTRACTION</td>
                <td className="px-4 py-3">demo@ubon.dev</td>
                <td className="px-4 py-3">อนุมัติ / ปฏิเสธ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
