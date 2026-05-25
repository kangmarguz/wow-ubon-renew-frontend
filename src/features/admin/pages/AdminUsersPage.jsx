import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

export function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="แอดมิน" title="จัดการผู้ใช้" description="หน้านี้ใช้เปลี่ยนสิทธิ์ผู้ใช้ระหว่าง USER และ ADMIN" />
      <SectionCard title="สิทธิ์ผู้ใช้">
        <div className="rounded-3xl border border-ink/10 p-4">
          <div className="font-semibold text-forest">demo@ubon.dev</div>
          <p className="mt-2 text-sm text-ink/70">ตารางจัดการ role ของผู้ใช้จะอยู่ในส่วนนี้</p>
        </div>
      </SectionCard>
    </div>
  );
}
