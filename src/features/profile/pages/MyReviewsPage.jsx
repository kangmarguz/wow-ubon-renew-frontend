import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

export function MyReviewsPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="โปรไฟล์" title="รีวิวของฉัน" description="หน้านี้พร้อมต่อกับรายการรีวิวของผู้ใช้และ flow การแก้ไขรีวิว" />
      <SectionCard title="ประวัติการรีวิว">
        <div className="rounded-3xl border border-ink/10 p-4">
          <div className="font-semibold text-forest">สถานที่ตัวอย่าง</div>
          <div className="text-sm text-ink/60">คะแนน: 4/5</div>
          <p className="mt-2 text-sm text-ink/70">รีวิวจาก backend จะแสดงในส่วนนี้</p>
        </div>
      </SectionCard>
    </div>
  );
}
