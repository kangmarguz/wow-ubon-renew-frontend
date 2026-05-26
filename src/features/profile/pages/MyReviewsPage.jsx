import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { ReviewEditor } from "../../places/components/ReviewEditor";
import { fetchMyReviews } from "../api/myReviewsApi";
import { ProfilePagination } from "../components/ProfilePagination";

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function MyReviewsPage() {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: reviews = [], isLoading, isError, error } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: fetchMyReviews
  });

  const filteredReviews = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return reviews;
    }

    return reviews.filter((review) => review.place.name.toLowerCase().includes(normalizedSearch));
  }, [reviews, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="โปรไฟล์"
        title="รีวิวของฉัน"
        description="รวมรีวิวทั้งหมดที่คุณเคยเขียนไว้ในที่เดียว ค้นหาจากชื่อสถานที่ได้ และกลับมาแก้ข้อความหรือคะแนนเดิมของคุณได้ตลอด"
      />

      <SectionCard
        title="รายการรีวิวที่เคยบันทึก"
        description="ค้นหาสถานที่จากชื่อได้ทันที และเลื่อนดูรีวิวทีละ 10 รายการเพื่อให้อ่านง่ายขึ้นเมื่อรายการเริ่มเยอะ"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <label className="block rounded-[1.5rem] border border-[#eadfce] bg-white/75 p-4">
          <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ค้นหาจากชื่อสถานที่</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="พิมพ์ชื่อสถานที่ที่คุณเคยรีวิว"
            className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition placeholder:text-[#a59384] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
          />
        </label>

        {isLoading ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            กำลังโหลดรีวิวของคุณ...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.5rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-10 text-sm text-[#9a4b4b]">
            {error?.response?.data?.message || "ไม่สามารถดึงรายการรีวิวของคุณได้"}
          </div>
        ) : null}

        {!isLoading && !isError && reviews.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            คุณยังไม่มีรีวิวที่บันทึกไว้ตอนนี้
          </div>
        ) : null}

        {!isLoading && !isError && reviews.length > 0 && filteredReviews.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            ไม่พบสถานที่ที่ตรงกับชื่อที่ค้นหา
          </div>
        ) : null}

        {!isLoading && !isError && paginatedReviews.length > 0
          ? paginatedReviews.map((review) => {
              const isEditing = editingReviewId === review.id;

              return (
                <div
                  key={review.id}
                  className="rounded-[1.7rem] border border-[#e7d9ca] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(251,246,239,0.96))] p-5 shadow-[0_12px_28px_rgba(74,55,37,0.06)]"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[#e3d4c4] bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#a06840]">
                          REVIEW
                        </span>
                        <span className="text-xs tracking-[0.2em] text-[#8f7d6d]">บันทึกเมื่อ {formatDate(review.createdAt)}</span>
                      </div>

                      <div>
                        <div className="text-xl font-semibold text-[#3f3328]">{review.place.name}</div>
                        <div className="mt-1 text-sm text-[#74685e]">
                          คะแนน {review.rating}/5
                          {review.updatedAt && review.updatedAt !== review.createdAt ? ` · แก้ไขล่าสุด ${formatDate(review.updatedAt)}` : ""}
                        </div>
                      </div>

                      <p className="max-w-3xl text-sm leading-7 text-[#5f5349]">{review.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/places/${review.place.slug}`}
                        className="rounded-full border border-[#c9b7a5] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#5b4737] transition hover:border-[#9a816c] hover:text-[#3f3328]"
                      >
                        ดูสถานที่
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingReviewId((current) => (current === review.id ? null : review.id))}
                        className="rounded-full bg-[#8b6a4f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#74553e]"
                      >
                        {isEditing ? "ปิดการแก้ไข" : "แก้ไขรีวิว"}
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-5 border-t border-[#eadfce] pt-5">
                      <ReviewEditor
                        place={review.place}
                        existingReview={review}
                        queryKeysToInvalidate={[["my-reviews"], ["place-detail", review.place.slug], ["places"]]}
                        title={`แก้ไขรีวิวของคุณสำหรับ ${review.place.name}`}
                        description="อัปเดตคะแนนหรือข้อความรีวิวเดิมของคุณได้ทันที ระบบจะสะท้อนผลกลับไปยังหน้าสถานที่หลังบันทึกสำเร็จ"
                        submitLabelUpdate="บันทึกการแก้ไขรีวิว"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })
          : null}

        {!isLoading && !isError && filteredReviews.length > 0 ? (
          <ProfilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        ) : null}
      </SectionCard>
    </div>
  );
}
