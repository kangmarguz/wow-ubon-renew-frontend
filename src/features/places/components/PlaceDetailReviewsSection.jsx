import { SectionCard } from "../../../shared/ui/SectionCard";
import { ReviewEditor } from "./ReviewEditor";

export function PlaceDetailReviewsSection({ place, user, existingReview }) {
  return (
    <SectionCard
      title="รีวิว"
      description="รีวิวจากผู้ใช้งานที่มองเห็นได้บนระบบ"
      className="border-[#eadfce] bg-white/80"
      titleClassName="text-[1.7rem] text-[#3f3328]"
      descriptionClassName="text-[14px] leading-7 text-[#74685e]"
      contentClassName="space-y-4"
    >
      <ReviewEditor place={place} existingReview={existingReview} queryKeysToInvalidate={[["place-detail", place.slug], ["places"], ["my-reviews"]]} />

      {place.reviews?.length > 0 ? (
        place.reviews.map((review) => (
          <div key={review.id} className="rounded-[1.5rem] border border-[#e2d5c7] bg-[#fffdf9] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold text-[#3f3328]">
                {review.user.name}
                {review.user.id === user?.id ? (
                  <span className="ml-2 rounded-full bg-[#efe2d4] px-2.5 py-1 text-xs font-medium text-[#7b6048]">
                    รีวิวของคุณ
                  </span>
                ) : null}
              </div>
              <div className="text-sm text-[#74685e]">คะแนน: {review.rating}/5</div>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6f6257]">{review.content}</p>
          </div>
        ))
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
          ยังไม่มีรีวิวสำหรับสถานที่นี้
        </div>
      )}
    </SectionCard>
  );
}
