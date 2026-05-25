import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

const placeholderPlaces = [
  { name: "สามพันโบก", category: "ATTRACTION", district: "โพธิ์ไทร" },
  { name: "ริมโขงเฮาส์", category: "ACCOMMODATION", district: "โขงเจียม" },
  { name: "ครัวอุบลโลคัล", category: "RESTAURANT", district: "เมืองอุบลราชธานี" }
];

export function PlacesPage() {
  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="รายการสถานที่"
        title="สถานที่ที่ผ่านการอนุมัติ"
        description="หน้านี้พร้อมต่อกับ React Query เพื่อดึงรายการจริงและ marker จาก backend"
      />

      <SectionCard title="ตัวกรอง" description="เชื่อมตัวกรองเหล่านี้เข้ากับ query params และ route state ได้เลย">
        <div className="grid gap-4 md:grid-cols-4">
          <input className="rounded-2xl border border-ink/10 px-4 py-3" placeholder="ค้นหาสถานที่" />
          <select className="rounded-2xl border border-ink/10 px-4 py-3">
            <option>ทุกประเภท</option>
          </select>
          <select className="rounded-2xl border border-ink/10 px-4 py-3">
            <option>ทุกอำเภอ</option>
          </select>
          <select className="rounded-2xl border border-ink/10 px-4 py-3">
            <option>คะแนนสูงสุด</option>
          </select>
        </div>
      </SectionCard>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="รายการสถานที่">
          <div className="grid gap-4">
            {placeholderPlaces.map((place) => (
              <div key={place.name} className="rounded-3xl border border-ink/10 p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-ember">{place.category}</div>
                <h3 className="mt-2 text-2xl font-semibold text-forest">{place.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{place.district}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="แผนที่" description="วาง React Leaflet ตรงนี้เพื่อดูสถานที่จากตำแหน่งบนแผนที่">
          <div className="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-ink/20 bg-mist text-sm text-ink/50">
            พื้นที่แสดงแผนที่ Leaflet
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
