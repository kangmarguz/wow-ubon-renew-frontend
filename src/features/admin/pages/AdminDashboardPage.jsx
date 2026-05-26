import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { fetchAdminDashboard } from "../api/adminDashboardApi";

const metricCards = [
  {
    key: "pendingPlaces",
    title: "สถานที่รออนุมัติ",
    description: "รายการที่ยังรอแอดมินตรวจสอบก่อนเผยแพร่",
    accentClassName: "text-[#8a6432]"
  },
  {
    key: "approvedPlaces",
    title: "สถานที่เผยแพร่แล้ว",
    description: "สถานที่ที่ผ่านอนุมัติและแสดงบนหน้า public",
    accentClassName: "text-[#2f6b41]"
  },
  {
    key: "visibleReviews",
    title: "รีวิวที่แสดงผล",
    description: "รีวิวที่ยังมองเห็นได้ในหน้าสถานที่",
    accentClassName: "text-[#3f3328]"
  },
  {
    key: "hiddenReviews",
    title: "รีวิวที่ถูกซ่อน",
    description: "รีวิวที่ถูก moderation ออกจากหน้า public",
    accentClassName: "text-[#9a4b4b]"
  },
  {
    key: "totalUsers",
    title: "สมาชิกทั้งหมด",
    description: "จำนวนผู้ใช้ที่มีบัญชีในระบบตอนนี้",
    accentClassName: "text-[#5f4b3d]"
  },
  {
    key: "adminUsers",
    title: "ผู้ดูแลระบบ",
    description: "บัญชีที่มีสิทธิ์จัดการระบบระดับแอดมิน",
    accentClassName: "text-[#7b5a3f]"
  }
];

export function AdminDashboardPage() {
  const { data: summary, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard
  });

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="แอดมิน"
        title="แดชบอร์ดจัดการระบบ"
        description="ภาพรวมสถานะของสถานที่ รีวิว และสมาชิกในระบบจากฐานข้อมูลจริง เพื่อให้เห็นงานที่ค้างตรวจและปริมาณข้อมูลปัจจุบันได้ทันที"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="ภาพรวมจากฐานข้อมูล"
        description="ตัวเลขทุกใบอัปเดตจาก backend โดยตรง และออกแบบให้สแกนสถานะสำคัญของระบบได้ในครั้งเดียว"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metricCards.map((card) => (
              <div
                key={card.key}
                className="rounded-[1.6rem] border border-[#e7dbcf] bg-white/85 p-5 shadow-[0_10px_24px_rgba(74,55,37,0.05)]"
              >
                <div className="h-4 w-28 rounded-full bg-[#efe5da]" />
                <div className="mt-5 h-10 w-20 rounded-[1rem] bg-[#f5ede3]" />
                <div className="mt-4 h-3 w-full rounded-full bg-[#f1e8de]" />
                <div className="mt-2 h-3 w-4/5 rounded-full bg-[#f1e8de]" />
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.5rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-10 text-sm text-[#9a4b4b]">
            {error?.response?.data?.message || "ไม่สามารถดึงข้อมูลสรุปของแดชบอร์ดได้"}
          </div>
        ) : null}

        {!isLoading && !isError && summary ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metricCards.map((card) => (
              <div
                key={card.key}
                className="rounded-[1.6rem] border border-[#e7dbcf] bg-white/92 p-5 shadow-[0_10px_24px_rgba(74,55,37,0.05)]"
              >
                <div className="text-xs font-semibold tracking-[0.18em] text-[#9a6a45]">{card.title}</div>
                <div className={`mt-4 text-[2.6rem] font-semibold leading-none ${card.accentClassName}`}>
                  {summary[card.key]}
                </div>
                <div className="mt-3 text-sm leading-7 text-[#6d6156]">{card.description}</div>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="สถานที่รอตรวจล่าสุด"
          description="ดูรายการ PENDING ล่าสุดเพื่อเข้าไปอนุมัติหรือปฏิเสธต่อได้ทันที"
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
          titleClassName="text-[1.4rem] text-[#3f3328]"
          descriptionClassName="text-[14px] leading-7 text-[#74685e]"
          contentClassName="space-y-3"
        >
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-[1.4rem] border border-[#eadfce] bg-white/85 p-4">
                  <div className="h-3 w-24 rounded-full bg-[#efe5da]" />
                  <div className="mt-3 h-4 w-3/4 rounded-full bg-[#f1e8de]" />
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-[#f1e8de]" />
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && !isError && summary?.recentPendingPlaces?.length ? (
            <div className="space-y-3">
              {summary.recentPendingPlaces.map((place) => (
                <div
                  key={place.id}
                  className="rounded-[1.4rem] border border-[#e7dbcf] bg-white/92 p-4 shadow-[0_8px_18px_rgba(74,55,37,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs tracking-[0.18em] text-[#a06840]">{getPlaceCategoryLabel(place.category)}</div>
                      <div className="mt-2 text-base font-semibold text-[#3f3328]">{place.name}</div>
                      <div className="mt-1 text-sm text-[#74685e]">
                        {place.district} · โดย {place.createdBy?.name || "-"}
                      </div>
                    </div>
                    <span className="rounded-full border border-[#eadbb8] bg-[#fff6df] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#8a6432]">
                      PENDING
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && !isError && !summary?.recentPendingPlaces?.length ? (
            <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-5 py-8 text-sm text-[#7c6f63]">
              ตอนนี้ไม่มีสถานที่รอตรวจใหม่
            </div>
          ) : null}

          <Link
            to="/admin/places"
            className="inline-flex rounded-full border border-[#c9b7a5] bg-white/85 px-4 py-2 text-sm font-semibold text-[#5b4737] transition hover:border-[#9a816c] hover:text-[#3f3328]"
          >
            ไปหน้าจัดการสถานที่
          </Link>
        </SectionCard>

        <SectionCard
          title="รีวิวล่าสุดในระบบ"
          description="สแกนข้อความรีวิวใหม่ล่าสุดเพื่อเข้า moderation ต่อได้ทันที"
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
          titleClassName="text-[1.4rem] text-[#3f3328]"
          descriptionClassName="text-[14px] leading-7 text-[#74685e]"
          contentClassName="space-y-3"
        >
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-[1.4rem] border border-[#eadfce] bg-white/85 p-4">
                  <div className="h-3 w-24 rounded-full bg-[#efe5da]" />
                  <div className="mt-3 h-4 w-3/4 rounded-full bg-[#f1e8de]" />
                  <div className="mt-2 h-3 w-full rounded-full bg-[#f1e8de]" />
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && !isError && summary?.recentReviews?.length ? (
            <div className="space-y-3">
              {summary.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-[1.4rem] border border-[#e7dbcf] bg-white/92 p-4 shadow-[0_8px_18px_rgba(74,55,37,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-[#3f3328]">{review.place.name}</div>
                      <div className="mt-1 text-sm text-[#74685e]">
                        โดย {review.user?.name || "-"} · คะแนน {review.rating}/5
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${
                        review.status === "HIDDEN"
                          ? "border-[#e7caca] bg-[#fff4f4] text-[#9a4b4b]"
                          : "border-[#d7e4d6] bg-[#eff7ef] text-[#356547]"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#605349]">{review.content}</p>
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && !isError && !summary?.recentReviews?.length ? (
            <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-5 py-8 text-sm text-[#7c6f63]">
              ตอนนี้ยังไม่มีรีวิวในระบบ
            </div>
          ) : null}

          <Link
            to="/admin/reviews"
            className="inline-flex rounded-full border border-[#c9b7a5] bg-white/85 px-4 py-2 text-sm font-semibold text-[#5b4737] transition hover:border-[#9a816c] hover:text-[#3f3328]"
          >
            ไปหน้าจัดการรีวิว
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}
