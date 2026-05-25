import { Link } from "react-router-dom";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

const storyCards = [
  {
    id: "why-this-site",
    eyebrow: "เรื่องของเว็บไซต์",
    title: "ทำไมอุบลฯ ควรมีพื้นที่รวมข้อมูลที่ใช้งานง่ายกว่านี้",
    description:
      "ใส่ข้อความอธิบายภาพรวมของปัญหาที่พบในปัจจุบัน เช่น ข้อมูลร้านอาหาร ที่พัก และสถานที่ท่องเที่ยวกระจัดกระจาย หายาก หรือไม่อัปเดตสม่ำเสมอ แล้วจึงเล่าว่าเว็บนี้ถูกสร้างขึ้นมาเพื่อแก้ปัญหานั้นอย่างไร",
    accent: "from-forest/85 via-forest/60 to-emerald-200/70"
  },
  {
    id: "local-community",
    eyebrow: "บทบาทของชุมชน",
    title: "เปิดให้คนในพื้นที่ช่วยกันเติมข้อมูลที่มีคุณภาพ",
    description:
      "ใส่ข้อความอธิบายว่าทำไมการมีส่วนร่วมของผู้ใช้สำคัญกับเว็บนี้ เช่น คนในพื้นที่รู้จักร้านเล็ก ๆ จุดท่องเที่ยวที่น่าสนใจ หรือที่พักที่ควรแนะนำได้ดีกว่าข้อมูลเชิงโฆษณาทั่วไป",
    accent: "from-ember/85 via-orange-400/70 to-clay/80"
  },
  {
    id: "trusted-curation",
    eyebrow: "คุณภาพของข้อมูล",
    title: "มีระบบคัดกรองเพื่อให้ข้อมูลน่าเชื่อถือก่อนเผยแพร่",
    description:
      "ใส่ข้อความอธิบายแนวคิดเรื่องการตรวจสอบโดยแอดมิน การให้รีวิว และการคัดกรองข้อมูลก่อนขึ้นหน้าเว็บจริง เพื่อให้คนที่เข้ามาใช้งานมั่นใจได้ว่าข้อมูลบนระบบมีคุณภาพมากกว่าการเปิดให้โพสต์แบบเสรี",
    accent: "from-[#60412b]/85 via-[#8b5e3c]/70 to-[#d9b48f]/80"
  }
];

const categories = [
  {
    title: "ร้านอาหาร",
    description: "รวมร้านเด็ด ร้านท้องถิ่น และร้านแนะนำจากคนในพื้นที่อุบลฯ"
  },
  {
    title: "ที่พัก",
    description: "ค้นหาที่พัก โรงแรม และโฮมสเตย์ที่เหมาะกับการเดินทางในอุบลฯ"
  },
  {
    title: "สถานที่ท่องเที่ยว",
    description: "วัด ธรรมชาติ และจุดเช็กอินที่คนอุบลอยากแนะนำจริง ๆ"
  }
];

export function HomePage() {
  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="จังหวัดอุบลราชธานี"
        title="คู่มือท้องถิ่นสำหรับร้านอาหาร ที่พัก และสถานที่ที่ควรไปสักครั้ง"
        description="หน้าแรกชุดนี้เตรียมไว้สำหรับ flow หลักของระบบ ทั้งการดูข้อมูล รีวิว เพิ่มสถานที่ และงานอนุมัติของแอดมิน"
      />

      <section className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <SectionCard
          title="ขอบเขต MVP"
          description="รอบแรกจะเน้นการดูข้อมูลสาธารณะ การเพิ่มสถานที่โดยสมาชิก รีวิว และการตรวจสอบโดยแอดมิน"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-forest p-5 text-white">
              <div className="text-xs tracking-[0.3em] text-white/60">สาธารณะ</div>
              <div className="mt-3 text-2xl font-semibold">ดูสถานที่ที่อนุมัติแล้ว</div>
            </div>
            <div className="rounded-3xl bg-ember p-5 text-white">
              <div className="text-xs tracking-[0.3em] text-white/60">ชุมชน</div>
              <div className="mt-3 text-2xl font-semibold">เพิ่มสถานที่และเขียนรีวิว</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="เริ่มใช้งาน">
          <div className="space-y-3 text-sm text-ink/70">
            <p>โครงนี้พร้อมสำหรับการเชื่อม API จริง ข้อมูลแผนที่ และระบบอนุมัติของแอดมินในรอบถัดไป</p>
            <Link to="/places" className="inline-flex rounded-full bg-forest px-5 py-3 font-semibold text-white">
              ดูสถานที่ทั้งหมด
            </Link>
          </div>
        </SectionCard>
      </section>

      <section className="space-y-6">
        <div className="max-w-3xl">
          <div className="mb-2 text-xs tracking-[0.32em] text-ember">ABOUT WEBSITE</div>
          <h2 className="font-display text-3xl text-forest md:text-4xl">เหตุผลที่เว็บไซต์นี้ควรถูกสร้างขึ้นมา</h2>
          <p className="mt-3 text-sm leading-7 text-ink/70 md:text-base">
            ส่วนนี้เป็น template สำหรับเล่าแนวคิดของเว็บไซต์ คุณสามารถนำข้อความจริง รูปภาพจริง และเรื่องราวของโปรเจกต์มาแทนได้ภายหลังโดยไม่ต้องเปลี่ยนโครง layout
          </p>
        </div>

        <div className="space-y-6">
          {storyCards.map((card, index) => {
            const isReversed = index % 2 === 1;

            return (
              <article
                key={card.id}
                className="grid overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-card backdrop-blur lg:grid-cols-2"
              >
                <div
                  className={`relative min-h-[280px] ${
                    isReversed ? "lg:order-2" : ""
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_20%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.15),transparent_18%),linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_100%)]" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs tracking-[0.28em] backdrop-blur">
                        TEMPLATE IMAGE
                      </div>
                      <div className="text-6xl font-semibold text-white/20">0{index + 1}</div>
                    </div>
                    <div className="max-w-xs">
                      <div className="text-sm leading-6 text-white/80">พื้นที่สำหรับวางรูปภาพประกอบของ section นี้</div>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center p-6 md:p-8 lg:p-10 ${isReversed ? "lg:order-1" : ""}`}>
                  <div className="max-w-xl">
                    <div className="mb-3 text-xs tracking-[0.3em] text-ember">{card.eyebrow}</div>
                    <h3 className="font-display text-2xl leading-tight text-forest md:text-3xl">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-ink/70 md:text-base">{card.description}</p>
                    <div className="mt-6 inline-flex rounded-full border border-ink/10 bg-mist px-4 py-2 text-xs tracking-[0.18em] text-ink/60">
                      ใส่ข้อมูลจริงภายหลังได้
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <SectionCard key={category.title} title={category.title} description={category.description}>
            <p className="text-sm leading-6 text-ink/70">ส่วนนี้สามารถต่อกับข้อมูลจริงและจำนวนรายการจาก backend ได้ทันที</p>
          </SectionCard>
        ))}
      </section>
    </div>
  );
}
