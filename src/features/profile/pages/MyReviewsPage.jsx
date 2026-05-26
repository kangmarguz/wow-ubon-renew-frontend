import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ReviewEditor } from "../../places/components/ReviewEditor";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { fetchMyReviews } from "../api/myReviewsApi";

export function MyReviewsPage() {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const { data: reviews = [], isLoading, isError, error } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: fetchMyReviews
  });

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="โปรไฟล์"
        title="รีวิวของฉัน"
        description="รวมรีวิวที่คุณเคยเขียนไว้ทั้งหมด พร้อมกลับมาแก้ไขข้อความและคะแนนเดิมได้จากหน้านี้"
      />

      <SectionCard
        title="ประวัติการรีวิว"
        description="ดึงข้อมูลรีวิวของคุณจาก backend จริง และเชื่อมการแก้ไขกับระบบรีวิวหน้า place โดยตรง"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        {isLoading ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            กำลังโหลดรายการรีวิวของคุณ...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.5rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-10 text-sm text-[#9a4b4b]">
            {error?.response?.data?.message || "ไม่สามารถดึงรายการรีวิวของคุณได้"}
          </div>
        ) : null}

        {!isLoading && !isError && reviews.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            คุณยังไม่มีรีวิวในระบบตอนนี้
          </div>
        ) : null}

        {!isLoading && !isError && reviews.length > 0
          ? reviews.map((review) => {
              const isEditing = editingReviewId === review.id;

              return (
                <div
                  key={review.id}
                  className="rounded-[1.6rem] border border-[#e2d5c7] bg-white p-5 shadow-[0_10px_30px_rgba(74,55,37,0.06)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="text-xs tracking-[0.22em] text-[#a06840]">รีวิวของฉัน</div>
                      <div className="text-lg font-semibold text-[#3f3328]">{review.place.name}</div>
                      <div className="text-sm text-[#74685e]">คะแนน: {review.rating}/5</div>
                      <p className="text-sm leading-7 text-[#6f6257]">{review.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/places/${review.place.slug}`}
                        className="rounded-full border border-[#d6c7b8] px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
                      >
                        ดูสถานที่
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingReviewId((current) => (current === review.id ? null : review.id))}
                        className="rounded-full bg-[#8b6a4f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#74553e]"
                      >
                        {isEditing ? "ปิดแบบฟอร์ม" : "แก้ไขรีวิว"}
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-5">
                      <ReviewEditor
                        place={review.place}
                        existingReview={review}
                        queryKeysToInvalidate={[["my-reviews"], ["place-detail", review.place.slug], ["places"]]}
                        title={`แก้ไขรีวิวสำหรับ ${review.place.name}`}
                        description="ปรับคะแนนหรือแก้ข้อความรีวิวเดิมของคุณได้ทันทีจากหน้านี้"
                        className="border-[#eadfce] bg-[#fffaf4]"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })
          : null}
      </SectionCard>
    </div>
  );
}
