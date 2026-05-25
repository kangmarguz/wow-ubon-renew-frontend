import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { deleteAdminReview, fetchAdminReviews, hideAdminReview } from "../api/adminReviewsApi";

export function AdminReviewsPage() {
  const queryClient = useQueryClient();
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

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="แอดมิน"
        title="จัดการรีวิว"
        description="ตรวจสอบรีวิวทั้งหมดบนระบบ ซ่อนรีวิวที่ไม่เหมาะสม หรือลบรายการที่ไม่ควรแสดงต่อผู้ใช้งาน"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="รายการรีวิว"
        description="ดึงข้อมูลจาก backend จริงพร้อมผู้รีวิวและสถานที่ที่เกี่ยวข้อง"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
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

        {!isLoading && !isError && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="rounded-[1.6rem] border border-[#e2d5c7] bg-white p-5 shadow-[0_10px_30px_rgba(74,55,37,0.06)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="text-xs tracking-[0.22em] text-[#a06840]">{getPlaceCategoryLabel(review.place.category)}</div>
                  <div className="text-lg font-semibold text-[#3f3328]">{review.place.name}</div>
                  <div className="text-sm text-[#74685e]">
                    ผู้รีวิว: {review.user.name} ({review.user.email})
                  </div>
                  <div className="text-sm text-[#74685e]">คะแนน: {review.rating}/5</div>
                  <div className="text-sm leading-7 text-[#6f6257]">{review.content}</div>
                  <div className="text-xs text-[#8c7a6a]">สถานะ: {review.status}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => hideMutation.mutate(review.id)}
                    disabled={hideMutation.isPending || deleteMutation.isPending || review.status === "HIDDEN"}
                    className="rounded-full border border-[#d6c7b8] px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    ซ่อน
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(review.id)}
                    disabled={hideMutation.isPending || deleteMutation.isPending}
                    className="rounded-full border border-[#d7b1b1] px-4 py-2.5 text-sm font-semibold text-[#8f4e4e] transition hover:bg-[#fff3f3] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : null}
      </SectionCard>
    </div>
  );
}
