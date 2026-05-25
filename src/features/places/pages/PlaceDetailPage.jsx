import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

export function PlaceDetailPage() {
  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="รายละเอียดสถานที่"
        title="หน้ารายละเอียดสถานที่"
        description="หน้านี้ใช้สำหรับแสดงข้อมูลสถานที่ที่อนุมัติแล้ว พร้อมรูป รีวิว คะแนน และแผนที่"
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="รูปภาพและรายละเอียด">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="min-h-40 rounded-3xl bg-clay/40" />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/70">รายละเอียดสถานที่ ที่อยู่ อำเภอ และข้อมูลประกอบจะถูกแสดงในส่วนนี้</p>
        </SectionCard>

        <SectionCard title="ตำแหน่งบนแผนที่">
          <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-ink/20 bg-mist text-sm text-ink/50">
            พื้นที่แสดงแผนที่พร้อมหมุดเดียว
          </div>
        </SectionCard>
      </section>

      <SectionCard title="รีวิว" description="ดึงรีวิวที่มองเห็นได้จาก API และต่อเข้ากับ flow การเขียนรีวิวได้ตรงนี้">
        <div className="space-y-4">
          <div className="rounded-3xl border border-ink/10 p-4">
            <div className="font-semibold">ผู้รีวิวตัวอย่าง</div>
            <div className="text-sm text-ink/60">คะแนน: 5/5</div>
            <p className="mt-2 text-sm leading-6 text-ink/70">ข้อความรีวิวจาก API จะถูกแสดงในส่วนนี้</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
