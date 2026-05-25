import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

export function AdminReviewsPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="แอดมิน" title="จัดการรีวิว" description="หน้านี้ใช้ตรวจสอบ ซ่อน หรือลบรีวิวที่ไม่เหมาะสม" />
      <SectionCard title="ตรวจสอบรีวิว">
        <div className="rounded-3xl border border-ink/10 p-4">
          <div className="font-semibold text-forest">รีวิวตัวอย่าง</div>
          <p className="mt-2 text-sm text-ink/70">เพิ่มปุ่มซ่อนและลบหลังจากเชื่อม admin review endpoints ได้ที่หน้านี้</p>
        </div>
      </SectionCard>
    </div>
  );
}
