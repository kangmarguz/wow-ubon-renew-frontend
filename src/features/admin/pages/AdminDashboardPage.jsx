import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

export function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="แอดมิน" title="แดชบอร์ดจัดการระบบ" description="ใช้หน้านี้เป็นภาพรวมของรายการรออนุมัติ รีวิว และผู้ใช้ทั้งหมด" />
      <section className="grid gap-6 md:grid-cols-3">
        <SectionCard title="สถานที่รออนุมัติ">
          <div className="text-4xl font-semibold text-forest">12</div>
        </SectionCard>
        <SectionCard title="รีวิวที่แสดงผล">
          <div className="text-4xl font-semibold text-forest">84</div>
        </SectionCard>
        <SectionCard title="สมาชิกทั้งหมด">
          <div className="text-4xl font-semibold text-forest">143</div>
        </SectionCard>
      </section>
    </div>
  );
}
