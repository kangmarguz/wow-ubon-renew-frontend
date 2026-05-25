import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { ubonDistricts } from "../../../shared/constants/ubonDistricts";

const placeSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["RESTAURANT", "ACCOMMODATION", "ATTRACTION"]),
  district: z.string().min(2),
  address: z.string().min(5),
  description: z.string().min(20)
});

export function SubmitPlacePage() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: "",
      category: "RESTAURANT",
      district: "เมืองอุบลราชธานี",
      address: "",
      description: ""
    }
  });

  const fieldClassName =
    "w-full rounded-[1.4rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-[#9b8d80] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]";

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="เพิ่มสถานที่"
        title="ส่งสถานที่ใหม่เข้าสู่ระบบ"
        description="กรอกข้อมูลสถานที่ให้ครบเพื่อส่งเข้าตรวจสอบก่อนเผยแพร่บนเว็บไซต์ คุณสามารถเริ่มจากรายละเอียดหลัก รูปภาพ และตำแหน่งบนแผนที่ได้จากหน้านี้"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.7rem] leading-tight md:text-[3.6rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <SectionCard
          title="ข้อมูลสถานที่"
          description="กรอกข้อมูลสำคัญให้ครบก่อนส่งตรวจสอบ รายการของคุณจะถูกแอดมินตรวจสอบก่อนเผยแพร่จริง"
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))] p-0 shadow-[0_28px_80px_rgba(74,55,37,0.08)]"
          headerClassName="border-b border-[#eadfce] px-6 py-6 md:px-8"
          titleClassName="text-[1.9rem] text-[#3f3328]"
          descriptionClassName="max-w-2xl text-[15px] leading-7 text-[#74685e]"
          contentClassName="px-6 py-6 md:px-8 md:py-8"
        >
          <form className="space-y-8" onSubmit={handleSubmit(console.log)}>
            <div className="grid gap-5 md:grid-cols-[1.4fr_0.8fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ชื่อสถานที่</span>
                <input className={fieldClassName} placeholder="เช่น บ้านสวนริมมูล" {...register("name")} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ประเภท</span>
                <select className={fieldClassName} {...register("category")}>
                  <option value="RESTAURANT">ร้านอาหาร</option>
                  <option value="ACCOMMODATION">ที่พัก</option>
                  <option value="ATTRACTION">สถานที่ท่องเที่ยว</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">อำเภอ</span>
                <select className={fieldClassName} {...register("district")}>
                  {ubonDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ที่อยู่</span>
                <input className={fieldClassName} placeholder="บ้านเลขที่ ถนน ตำบล" {...register("address")} />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">รายละเอียด</span>
              <textarea
                rows="7"
                className={`${fieldClassName} resize-none py-4 leading-7`}
                placeholder="เล่าจุดเด่น บรรยากาศ หรือข้อมูลสำคัญของสถานที่นี้"
                {...register("description")}
              />
            </label>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-[#5b4a3b]">รูปภาพประกอบ</div>
                <p className="mt-1 text-sm leading-6 text-[#8a7a6a]">รองรับหลายรูป เพื่อให้ผู้ใช้เห็นบรรยากาศของสถานที่ได้ชัดขึ้น</p>
              </div>

              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f1e8_100%)] px-6 text-center transition hover:border-[#b39478] hover:bg-[#fffaf4]">
                <div className="rounded-full border border-[#dcc8b6] bg-white px-4 py-2 text-xs tracking-[0.2em] text-[#866c57]">
                  UPLOAD AREA
                </div>
                <div className="mt-5 text-lg font-semibold text-[#4d3d30]">ลากไฟล์มาวางหรือคลิกเพื่อเลือกรูป</div>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#8b7b6d]">เหมาะกับภาพหน้าปก บรรยากาศโดยรวม และภาพที่ช่วยให้คนตัดสินใจได้ง่ายขึ้น</p>
                <input type="file" multiple className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#eadfce] pt-6 md:flex-row md:items-center md:justify-between">
              <div className="text-sm leading-6 text-[#7b6f64]">
                เมื่อส่งแล้ว รายการจะเข้าสู่สถานะ <span className="font-semibold text-[#4c3b2d]">รอตรวจสอบ</span> ก่อนเผยแพร่บนเว็บไซต์
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#3f3328] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2f251d]"
              >
                ส่งเข้าสู่ระบบเพื่อตรวจสอบ
              </button>
            </div>
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="ตำแหน่งบนแผนที่"
            description="คลิกเพื่อปักหมุดตำแหน่งจริงของสถานที่ แล้วเก็บค่าพิกัดไว้ส่งพร้อมฟอร์ม"
            className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,239,229,0.95))] shadow-[0_24px_70px_rgba(74,55,37,0.06)]"
            titleClassName="text-[1.6rem] text-[#3f3328]"
            descriptionClassName="text-[14px] leading-7 text-[#74685e]"
          >
            <div className="space-y-4">
              <div className="flex min-h-[420px] items-center justify-center rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_30%),linear-gradient(180deg,#fbf6ef_0%,#f1e7db_100%)] text-center text-sm text-[#7b6f64]">
                <div className="max-w-[220px]">
                  <div className="text-base font-semibold text-[#4d3d30]">พื้นที่สำหรับแผนที่</div>
                  <p className="mt-2 leading-6">หลังเชื่อม React Leaflet แล้ว ส่วนนี้จะใช้สำหรับคลิกปักหมุดและดูตำแหน่งที่เลือก</p>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4">
                <div className="text-xs tracking-[0.22em] text-[#9a836d]">LOCATION STATUS</div>
                <div className="mt-2 text-sm leading-6 text-[#6f6257]">ยังไม่ได้เลือกพิกัด คุณสามารถตั้งค่าให้แสดง latitude และ longitude ที่เลือกในกล่องนี้ได้ภายหลัง</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="คำแนะนำก่อนส่ง"
            className="border-[#eadfce] bg-white/75"
            titleClassName="text-[1.35rem] text-[#3f3328]"
            contentClassName="space-y-3 text-sm leading-7 text-[#726659]"
          >
            <p>ใช้ชื่อสถานที่ที่คนทั่วไปค้นหาเจอจริง เพื่อให้ระบบสร้าง slug และหน้ารายละเอียดได้ชัดเจน</p>
            <p>รูปภาพชุดแรกควรเป็นภาพที่สื่อบรรยากาศโดยรวม เพราะมีโอกาสถูกใช้เป็นภาพหลักของรายการ</p>
            <p>หากข้อมูลที่อยู่ยังไม่ครบ ควรอย่างน้อยระบุอำเภอและตำแหน่งหมุดให้แม่นยำ</p>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
