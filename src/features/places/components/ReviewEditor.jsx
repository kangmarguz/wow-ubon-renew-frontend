import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, LockKeyhole, MessageSquare, PencilLine, Save, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { createPlaceReview, updatePlaceReview } from "../api/publicPlacesApi";
import { ReviewStars } from "./ReviewStars";

const initialReviewForm = {
  rating: 5,
  content: ""
};

export function ReviewEditor({
  place,
  existingReview = null,
  queryKeysToInvalidate = [],
  className = "",
  title,
  description,
  submitLabelCreate = "ส่งรีวิว",
  submitLabelUpdate = "บันทึกการแก้ไข"
}) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [formState, setFormState] = useState(initialReviewForm);

  useEffect(() => {
    if (existingReview) {
      setFormState({
        rating: existingReview.rating,
        content: existingReview.content
      });
      return;
    }

    setFormState(initialReviewForm);
  }, [existingReview]);

  const saveReviewMutation = useMutation({
    mutationFn: (payload) =>
      existingReview ? updatePlaceReview(existingReview.id, payload) : createPlaceReview(place.id, payload),
    onSuccess() {
      toast.success(existingReview ? "แก้ไขรีวิวเรียบร้อยแล้ว" : "ส่งรีวิวเรียบร้อยแล้ว");
      queryKeysToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "บันทึกรีวิวไม่สำเร็จ");
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const content = formState.content.trim();

    if (content.length < 5) {
      toast.error("กรุณาเขียนรีวิวอย่างน้อย 5 ตัวอักษร");
      return;
    }

    saveReviewMutation.mutate({
      rating: formState.rating,
      content
    });
  };

  const isOwner = place.createdBy?.id === user?.id;
  const resolvedTitle = title || (existingReview ? "แก้ไขรีวิวของคุณ" : "เขียนรีวิวสำหรับสถานที่นี้");
  const resolvedDescription =
    description ||
    (existingReview
      ? "คุณเคยรีวิวสถานที่นี้แล้ว สามารถแก้ไขคะแนนและข้อความเดิมได้"
      : "รีวิวได้ 1 ครั้งต่อ 1 สถานที่ และสามารถกลับมาแก้ไขรีวิวเดิมของคุณได้ภายหลัง");

  if (!user) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] p-5 text-sm leading-7 text-[#6f6257]">
        <div className="inline-flex items-center gap-2 font-semibold text-[#3f3328]">
          <LockKeyhole size={16} aria-hidden="true" />
          เข้าสู่ระบบก่อนจึงจะเขียนรีวิวได้
        </div>
        <div className="mt-2">หากต้องการแชร์ประสบการณ์ของคุณกับสถานที่นี้ กรุณาเข้าสู่ระบบก่อน</div>
        <Link
          to="/login"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c9b7a5] px-4 py-2 text-sm font-semibold text-[#5b4737] transition hover:border-[#9a816c] hover:text-[#3f3328]"
        >
          ไปหน้าเข้าสู่ระบบ
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="rounded-[1.5rem] border border-[#eadfce] bg-[#fffaf4] p-5 text-sm leading-7 text-[#6f6257]">
        <div className="inline-flex items-center gap-2 font-semibold text-[#3f3328]">
          <MessageSquare size={16} aria-hidden="true" />
          คุณเป็นผู้สร้างสถานที่นี้
        </div>
        <div className="mt-2">จึงไม่สามารถให้คะแนนหรือเขียนรีวิวสำหรับรายการของตัวเองได้</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 rounded-[1.6rem] border border-[#e2d5c7] bg-[#fffdf9] p-5 ${className}`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-lg font-semibold text-[#3f3328]">
            {existingReview ? <PencilLine size={18} aria-hidden="true" /> : <MessageSquare size={18} aria-hidden="true" />}
            {resolvedTitle}
          </div>
          <div className="mt-1 text-sm text-[#74685e]">{resolvedDescription}</div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-sm text-[#8c7a6a]">
          <Star size={14} className="text-[#a06840]" aria-hidden="true" />
          คะแนนปัจจุบัน: {formState.rating}/5
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-[#5b4737]">ให้คะแนน</div>
        <ReviewStars value={formState.rating} onChange={(rating) => setFormState((current) => ({ ...current, rating }))} />
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-[#5b4737]">รายละเอียดรีวิว</span>
        <textarea
          value={formState.content}
          onChange={(event) => setFormState((current) => ({ ...current, content: event.target.value }))}
          rows={5}
          placeholder="บอกเล่าบรรยากาศ จุดเด่น หรือประสบการณ์ที่น่าสนใจของสถานที่นี้"
          className="w-full rounded-[1.2rem] border border-[#d9cabd] bg-white px-4 py-3 text-sm leading-7 text-[#43362c] outline-none transition placeholder:text-[#a59384] focus:border-[#a88466] focus:ring-4 focus:ring-[#e9dccf]"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs leading-6 text-[#8c7a6a]">รีวิวของคุณจะถูกแสดงในหน้าสถานที่นี้ทันทีเมื่อบันทึกสำเร็จ</div>
        <button
          type="submit"
          disabled={saveReviewMutation.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[#8b6a4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74553e] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={16} aria-hidden="true" className={saveReviewMutation.isPending ? "animate-pulse" : ""} />
          {saveReviewMutation.isPending ? "กำลังบันทึก..." : existingReview ? submitLabelUpdate : submitLabelCreate}
        </button>
      </div>
    </form>
  );
}
