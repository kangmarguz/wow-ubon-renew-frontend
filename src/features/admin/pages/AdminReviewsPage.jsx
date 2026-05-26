import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { ProfilePagination } from "../../profile/components/ProfilePagination";
import { deleteAdminReview, fetchAdminReviews, hideAdminReview } from "../api/adminReviewsApi";

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function getStatusLabel(status) {
  return status === "HIDDEN" ? "ซ่อนแล้ว" : "แสดงผลอยู่";
}

export function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: reviews = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: fetchAdminReviews
  });

  const hideMutation = useMutation({
    mutationFn: hideAdminReview,
    onSuccess() {
      toast.success("ซ่อนรีวิวเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ซ่อนรีวิวไม่สำเร็จ");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminReview,
    onSuccess() {
      toast.success("ลบรีวิวเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ลบรีวิวไม่สำเร็จ");
    }
  });

  const filteredReviews = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return reviews;
    }

    return reviews.filter((review) => {
      const placeName = review.place.name.toLowerCase();
      const reviewerName = review.user.name.toLowerCase();
      return placeName.includes(normalizedSearch) || reviewerName.includes(normalizedSearch);
    });
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
        eyebrow="แอดมิน"
        title="จัดการรีวิว"
        description="ค้นหารีวิวตามชื่อสถานที่หรือชื่อผู้รีวิวได้ทันที และไล่ตรวจรายการเป็นชุดละ 10 รายการเพื่อให้ moderation ทำงานได้เร็วขึ้น"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="รายการรีวิว"
        description="โฟกัสเฉพาะข้อมูลที่จำเป็นต่อการตรวจสอบ ลดความแน่นของการ์ดลง และคง action สำคัญไว้ทางขวา"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <label className="block rounded-[1.5rem] border border-[#eadfce] bg-white/75 p-4">
          <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ค้นหาจากชื่อสถานที่หรือชื่อผู้รีวิว</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="พิมพ์ชื่อสถานที่หรือชื่อผู้รีวิว"
            className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition placeholder:text-[#a59384] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
          />
        </label>

        {isLoading ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            กำลังโหลดรายการรีวิว...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.5rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-10 text-sm text-[#9a4b4b]">
            {error?.response?.data?.message || "ไม่สามารถดึงรายการรีวิวได้"}
          </div>
        ) : null}

        {!isLoading && !isError && reviews.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            ยังไม่มีรีวิวในระบบ
          </div>
        ) : null}

        {!isLoading && !isError && reviews.length > 0 && filteredReviews.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            ไม่พบรีวิวที่ตรงกับคำค้นหา
          </div>
        ) : null}

        {!isLoading && !isError && paginatedReviews.length > 0
          ? paginatedReviews.map((review) => {
              const isHidden = review.status === "HIDDEN";
              const isMutating =
                hideMutation.isPending || deleteMutation.isPending;

              return (
                <div
                  key={review.id}
                  className="rounded-[1.6rem] border border-[#e4d7ca] bg-white/92 p-5 shadow-[0_10px_24px_rgba(74,55,37,0.05)]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#eadfce] bg-[#faf4ec] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#9a6a45]">
                          {getPlaceCategoryLabel(review.place.category)}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${
                            isHidden
                              ? "border-[#e7caca] bg-[#fff4f4] text-[#9a4b4b]"
                              : "border-[#d7e4d6] bg-[#eff7ef] text-[#356547]"
                          }`}
                        >
                          {getStatusLabel(review.status)}
                        </span>
                      </div>

                      <div>
                        <div className="text-lg font-semibold text-[#3f3328]">{review.place.name}</div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#74685e]">
                          <span>โดย {review.user.name}</span>
                          <span>{review.user.email}</span>
                          <span>คะแนน {review.rating}/5</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>

                      <p className="max-w-3xl text-sm leading-7 text-[#605349]">{review.content}</p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => hideMutation.mutate(review.id)}
                        disabled={isMutating || isHidden}
                        className="rounded-full border border-[#d6c7b8] px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isHidden ? "ซ่อนแล้ว" : "ซ่อนรีวิว"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(review.id)}
                        disabled={isMutating}
                        className="rounded-full border border-[#d7b1b1] px-4 py-2.5 text-sm font-semibold text-[#8f4e4e] transition hover:bg-[#fff3f3] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        ลบรีวิว
                      </button>
                    </div>
                  </div>
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
