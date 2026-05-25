import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

const items = [
  { name: "Khong Chiam Stay", status: "PENDING" },
  { name: "Hidden River Cafe", status: "REJECTED" }
];

export function MyPlacesPage() {
  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="โปรไฟล์"
        title="สถานที่ของฉัน"
        description="หน้านี้ใช้แสดงสถานที่ที่ผู้ใช้ส่งเข้ามาและสถานะการตรวจสอบ"
      />
      <SectionCard title="สถานะรายการที่ส่ง">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-3xl border border-ink/10 p-4">
              <div>
                <div className="font-semibold text-forest">{item.name}</div>
                <div className="text-sm text-ink/60">สถานะ: {item.status}</div>
              </div>
              <button type="button" className="rounded-full border border-ink/15 px-4 py-2 text-sm">
                แก้ไข
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
