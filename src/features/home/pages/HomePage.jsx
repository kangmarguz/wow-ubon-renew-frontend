import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import posterRiver from "../../../assets/home/ubon-poster-river.svg";
import posterTemple from "../../../assets/home/ubon-poster-temple.svg";
import posterMarket from "../../../assets/home/ubon-poster-market.svg";
import posterNature from "../../../assets/home/ubon-poster-nature.svg";
import posterCafe from "../../../assets/home/ubon-poster-cafe.svg";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

const problemPoints = [
  {
    title: "ข้อมูลกระจัดกระจาย",
    description: "ร้านอาหาร ที่พัก และสถานที่ท่องเที่ยวมักอยู่คนละแหล่ง ทำให้การมองภาพรวมของอุบลเริ่มต้นได้ยากกว่าที่ควร"
  },
  {
    title: "หาแหล่งที่เชื่อถือได้ไม่ง่าย",
    description: "หลายครั้งข้อมูลที่เจอไม่อัปเดต หรือเล่าจากมุมโฆษณามากเกินไป จนตัดสินใจจริงได้ยากก่อนเดินทาง"
  },
  {
    title: "ของดีท้องถิ่นถูกมองข้าม",
    description: "สถานที่เล็ก ๆ หรือร้านที่คนในพื้นที่อยากแนะนำจริง มักไม่ถูกเล่าอย่างเป็นระบบเท่าที่ควร"
  }
];

const purposeBlocks = [
  {
    eyebrow: "รวมไว้ในที่เดียว",
    title: "สร้างพื้นที่กลางสำหรับข้อมูลของอุบลราชธานี",
    description:
      "เว็บนี้ถูกออกแบบให้เป็นจุดรวมข้อมูลร้านอาหาร ที่พัก และสถานที่ท่องเที่ยวของจังหวัดอุบลราชธานี เพื่อให้คนที่กำลังค้นหาเริ่มต้นได้ง่ายขึ้นจากหน้าเดียว"
  },
  {
    eyebrow: "มาจากคนในพื้นที่",
    title: "เปิดให้ชุมชนช่วยกันเติมข้อมูลที่มีคุณภาพ",
    description:
      "นอกจากการดูข้อมูล ผู้ใช้ยังช่วยเพิ่มสถานที่และแบ่งปันประสบการณ์ผ่านรีวิวได้ เพื่อให้เนื้อหาสะท้อนมุมมองจริงจากคนที่รู้จักพื้นที่"
  },
  {
    eyebrow: "คัดกรองก่อนเผยแพร่",
    title: "มีระบบตรวจสอบเพื่อรักษาคุณภาพของข้อมูล",
    description:
      "สถานที่ใหม่จะเข้าสู่ขั้นตอนตรวจสอบก่อนเผยแพร่จริง เพื่อให้ข้อมูลบนเว็บน่าเชื่อถือ อ่านง่าย และนำไปใช้งานต่อได้จริง"
  }
];

const categories = [
  {
    title: "ร้านอาหาร",
    description: "รวมร้านเด่น ร้านท้องถิ่น และมุมกินที่คนในพื้นที่อยากแนะนำให้ค้นหาได้ง่ายขึ้น"
  },
  {
    title: "ที่พัก",
    description: "ช่วยให้มองหาที่พักในอุบลได้จากข้อมูลที่อ่านต่อเนื่องและเปรียบเทียบได้ง่ายกว่าเดิม"
  },
  {
    title: "สถานที่ท่องเที่ยว",
    description: "รวบรวมจุดที่น่าไป วัด ธรรมชาติ และสถานที่ที่ควรถูกค้นเจอมากกว่าที่ผ่านมา"
  }
];

const posterSlides = [
  {
    title: "เช้าริมมูล",
    subtitle: "สายน้ำ ลมอ่อน และจังหวะเมืองที่ค่อย ๆ ตื่น",
    image: posterRiver,
    accent: "from-[#f0dfcb] to-[#d8c0a1]"
  },
  {
    title: "วัดและแสงเย็น",
    subtitle: "เส้นสายสงบของศิลปะท้องถิ่นในอากาศอบอุ่น",
    image: posterTemple,
    accent: "from-[#efdfcf] to-[#d4b18c]"
  },
  {
    title: "ตลาดเช้า",
    subtitle: "บรรยากาศคน อาหาร และเรื่องเล่าที่เกิดขึ้นทุกวัน",
    image: posterMarket,
    accent: "from-[#f2e3d5] to-[#d8b490]"
  },
  {
    title: "ธรรมชาติขอบเมือง",
    subtitle: "พื้นที่สีเขียวที่ทำให้การเดินทางช้าลงอย่างพอดี",
    image: posterNature,
    accent: "from-[#e6ddd0] to-[#bfa784]"
  },
  {
    title: "มุมพักของวัน",
    subtitle: "คาเฟ่และพื้นที่เล็ก ๆ ที่เติมอารมณ์ให้เมืองน่าอยู่ขึ้น",
    image: posterCafe,
    accent: "from-[#f0e1d5] to-[#cfb08a]"
  }
];

function HeroPosterCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posterSlides.length);
    }, 4800);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeSlide = posterSlides[activeIndex];
  const previousSlide = posterSlides[(activeIndex + posterSlides.length - 1) % posterSlides.length];

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="absolute -left-4 top-8 h-28 w-28 rounded-full bg-[#debea0]/22 blur-3xl" />
      <div className="absolute -right-2 top-20 h-32 w-32 rounded-full bg-[#9eb3a6]/18 blur-3xl" />
      <div className="absolute bottom-8 left-12 h-24 w-24 rounded-full bg-[#e9d2bf]/28 blur-3xl" />

      <div className="relative rounded-[2.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,239,230,0.78))] p-4 shadow-[0_28px_60px_rgba(74,55,37,0.14)] backdrop-blur">
        <div className="absolute inset-0 rounded-[2.4rem] bg-[radial-gradient(circle_at_top_left,rgba(219,188,157,0.18),transparent_20%),radial-gradient(circle_at_86%_18%,rgba(110,143,121,0.12),transparent_18%)]" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between rounded-[1.4rem] border border-white/70 bg-white/76 px-4 py-3">
            <div>
              <div className="text-[11px] tracking-[0.26em] text-[#9f7049]">UBON ATMOSPHERE</div>
              <div className="mt-1 text-sm font-semibold text-[#36291f]">mock poster สำหรับบรรยากาศจังหวัด</div>
            </div>
            <div className="rounded-full bg-[#f6e8d8] px-3 py-1 text-[11px] font-semibold text-[#6d5643]">
              {String(activeIndex + 1).padStart(2, "0")} / {String(posterSlides.length).padStart(2, "0")}
            </div>
          </div>

          <div className="relative min-h-[580px]">
            <div className="absolute inset-y-10 left-2 w-[76%] rounded-[2rem] border border-white/50 bg-white/34 shadow-[0_18px_40px_rgba(74,55,37,0.08)] backdrop-blur">
              <img
                src={previousSlide.image}
                alt={previousSlide.title}
                className="h-full w-full rounded-[2rem] object-cover opacity-48"
              />
            </div>

            <div className="relative ml-auto w-[88%] overflow-hidden rounded-[2.2rem] border border-white/80 bg-white shadow-[0_22px_48px_rgba(74,55,37,0.16)]">
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${activeSlide.accent} opacity-78`} />
              <img src={activeSlide.image} alt={activeSlide.title} className="h-[560px] w-full object-cover" />

              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(42,31,23,0.08)_20%,rgba(35,28,22,0.88))] px-5 pb-5 pt-20 text-white">
                <div className="text-[11px] tracking-[0.26em] text-white/70">POSTER SERIES</div>
                <div className="mt-2 font-display text-[2rem] leading-tight">{activeSlide.title}</div>
                <p className="mt-2 max-w-xs text-sm leading-7 text-white/84">{activeSlide.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {posterSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`ดูภาพ ${slide.title}`}
                  className={`h-2.5 rounded-full transition ${
                    index === activeIndex ? "w-9 bg-[#3f3328]" : "w-2.5 bg-[#d9c7b4] hover:bg-[#bfa48b]"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current - 1 + posterSlides.length) % posterSlides.length)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dccab7] bg-white/82 text-lg text-[#5a4738] transition hover:border-[#bda185] hover:bg-white"
                aria-label="ภาพก่อนหน้า"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current + 1) % posterSlides.length)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#3f3328] text-lg text-white shadow-[0_12px_20px_rgba(63,51,40,0.16)] transition hover:bg-[#2f251d]"
                aria-label="ภาพถัดไป"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(247,239,229,0.96))] px-6 py-8 shadow-[0_28px_78px_rgba(74,55,37,0.08)] md:px-10 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,181,148,0.22),transparent_24%),radial-gradient(circle_at_86%_14%,rgba(104,140,119,0.12),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.28),transparent_46%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_440px] xl:items-center">
          <div className="space-y-8">
            <PageIntro
              eyebrow="จังหวัดอุบลราชธานี"
              title="เว็บนี้ถูกสร้างขึ้นเพื่อรวบรวมร้านอาหาร ที่พัก และสถานที่ท่องเที่ยวของอุบลไว้ในที่เดียว"
              description="เราอยากให้การรู้จักอุบลราชธานีเริ่มต้นได้ง่ายขึ้น ผ่านพื้นที่กลางที่รวมข้อมูลไว้อย่างเป็นระบบ เปิดให้ชุมชนช่วยเติมเนื้อหา และคัดกรองก่อนเผยแพร่เพื่อให้ข้อมูลน่าเชื่อถือมากขึ้น"
              className="mb-0 max-w-4xl"
              eyebrowClassName="tracking-[0.32em]"
              titleClassName="max-w-5xl text-[2.6rem] leading-[1.08] text-[#2f241b] md:text-[4.3rem]"
              descriptionClassName="max-w-3xl text-[15px] leading-8 text-[#6e6257] md:text-[16px]"
            />

            <div className="flex flex-wrap gap-3">
              <Link
                to="/places"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#3d3228] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(61,50,40,0.14)] transition hover:bg-[#2f251d]"
              >
                ดูสถานที่ทั้งหมด
              </Link>
              <Link
                to="/submit-place"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#d4c2b0] bg-white/78 px-6 py-3 text-sm font-semibold text-[#5e4a3a] backdrop-blur transition hover:border-[#b79678] hover:bg-white"
              >
                ช่วยเพิ่มข้อมูลสถานที่
              </Link>
            </div>
          </div>

          <HeroPosterCarousel />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {problemPoints.map((point) => (
          <div
            key={point.title}
            className="rounded-[1.9rem] border border-[#ebdece] bg-white/78 p-5 shadow-[0_14px_28px_rgba(74,55,37,0.05)]"
          >
            <div className="text-xs tracking-[0.24em] text-[#a16f47]">ปัญหาที่เจอบ่อย</div>
            <div className="mt-3 text-xl font-semibold text-[#34281f]">{point.title}</div>
            <p className="mt-3 text-sm leading-7 text-[#6f6257]">{point.description}</p>
          </div>
        ))}
      </section>

      <SectionCard
        title="เว็บนี้มีไว้เพื่ออะไร"
        description="แทนที่จะเป็นแค่หน้าแนะนำสถานที่ หน้าแรกของเว็บนี้ถูกออกแบบให้เริ่มจากเหตุผลของการมีอยู่ของระบบก่อน แล้วค่อยพาไปสู่การใช้งานจริง"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[2rem] text-[#33281f]"
        descriptionClassName="max-w-3xl text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-5"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {purposeBlocks.map((block, index) => (
            <article
              key={block.title}
              className={`rounded-[1.9rem] border p-5 ${index === 1 ? "border-[#e0d1c0] bg-[#f8f0e6]" : "border-[#e7dbcf] bg-white/80"}`}
            >
              <div className="text-xs tracking-[0.24em] text-[#9c6e49]">{block.eyebrow}</div>
              <h3 className="mt-3 text-[1.35rem] font-semibold leading-8 text-[#352920]">{block.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6e6257]">{block.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="สิ่งที่คุณจะเจอในเว็บนี้"
          description="ข้อมูลหลักของเว็บถูกจัดไว้รอบ 3 หมวด เพื่อให้การสำรวจอุบลเริ่มจากสิ่งที่คุณกำลังหาอยู่จริง"
          className="border-[#eadfce] bg-white/80"
          titleClassName="text-[1.8rem] text-[#33281f]"
          descriptionClassName="text-[14px] leading-7 text-[#74685e]"
          contentClassName="space-y-4"
        >
          {categories.map((category) => (
            <div key={category.title} className="rounded-[1.5rem] border border-[#e6d9cb] bg-[#fffdf9] p-4">
              <div className="text-lg font-semibold text-[#382c22]">{category.title}</div>
              <p className="mt-2 text-sm leading-7 text-[#6f6257]">{category.description}</p>
            </div>
          ))}
        </SectionCard>

        <section className="rounded-[2rem] border border-[#e8dccf] bg-[linear-gradient(180deg,rgba(255,252,248,0.98),rgba(246,238,227,0.96))] p-6 shadow-[0_22px_48px_rgba(74,55,37,0.06)]">
          <div className="text-xs tracking-[0.28em] text-[#a06d46]">HOW IT MOVES</div>
          <h2 className="mt-3 font-display text-[2rem] leading-tight text-[#32271e] md:text-[2.5rem]">
            จากการค้นหาข้อมูลที่กระจัดกระจาย ไปสู่พื้นที่กลางที่คนอุบลช่วยกันทำให้ดีขึ้นได้
          </h2>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.6rem] border border-white/70 bg-white/78 p-4">
              <div className="text-xs tracking-[0.22em] text-[#9c6e49]">01</div>
              <div className="mt-2 text-lg font-semibold text-[#382c22]">เริ่มจากการค้นหาให้ง่าย</div>
              <p className="mt-2 text-sm leading-7 text-[#6f6257]">
                ผู้ใช้สามารถเริ่มสำรวจร้านอาหาร ที่พัก และสถานที่ท่องเที่ยวที่ผ่านการอนุมัติแล้วได้จากระบบเดียว
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/70 bg-white/74 p-4">
              <div className="text-xs tracking-[0.22em] text-[#9c6e49]">02</div>
              <div className="mt-2 text-lg font-semibold text-[#382c22]">เปิดให้ชุมชนมีส่วนร่วม</div>
              <p className="mt-2 text-sm leading-7 text-[#6f6257]">
                คนในพื้นที่สามารถเพิ่มสถานที่และเขียนรีวิว เพื่อช่วยให้เว็บสะท้อนประสบการณ์จริงมากกว่าข้อมูลโฆษณาทั่วไป
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-[#dcccc0] bg-[#3f3328] p-4 text-white">
              <div className="text-xs tracking-[0.22em] text-white/60">03</div>
              <div className="mt-2 text-lg font-semibold">คัดกรองก่อนขึ้นหน้าเว็บจริง</div>
              <p className="mt-2 text-sm leading-7 text-white/78">
                ทุกสถานที่ใหม่ต้องผ่านการตรวจสอบก่อนเผยแพร่ เพื่อรักษามาตรฐานของข้อมูลให้สม่ำเสมอและเชื่อถือได้
              </p>
            </div>
          </div>
        </section>
      </section>

      <section className="rounded-[2.1rem] border border-[#e5d8cb] bg-white/82 px-6 py-7 shadow-[0_18px_42px_rgba(74,55,37,0.05)] md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs tracking-[0.28em] text-[#a06d46]">NEXT STEP</div>
            <h2 className="mt-3 font-display text-[2rem] leading-tight text-[#33281f] md:text-[2.5rem]">
              เมื่อเข้าใจจุดประสงค์ของเว็บแล้ว คุณสามารถเริ่มสำรวจอุบลผ่านข้อมูลที่ถูกรวบรวมไว้ได้ทันที
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6257] md:text-base">
              หน้านี้ตั้งใจเริ่มจากคำถามว่า “เว็บนี้ทำมาทำไม” ก่อน แล้วค่อยพาไปสู่การใช้งานจริงในขั้นถัดไป
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/places"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#3d3228] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f251d]"
            >
              ดูสถานที่ทั้งหมด
            </Link>
            <Link
              to="/submit-place"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#d3c1ae] bg-[#fffaf4] px-5 py-3 text-sm font-semibold text-[#5c4939] transition hover:border-[#b69477] hover:bg-white"
            >
              เพิ่มสถานที่ใหม่
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
