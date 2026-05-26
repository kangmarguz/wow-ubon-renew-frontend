import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { fetchMyPlaces, resubmitMyPlace } from "../api/myPlacesApi";

const statusConfig = {
  APPROVED: {
    label: "เผยแพร่แล้ว",
    badgeClassName: "border-[#cfe4d4] bg-[#edf7ef] text-[#2f6b41]",
    panelClassName: "border-[#dbe9df] bg-[linear-gradient(180deg,rgba(239,248,241,0.92),rgba(255,255,255,1))]",
    titleClassName: "text-[#2f6b41]",
    description: "สถานที่นี้ผ่านการอนุมัติแล้วและกำลังแสดงผลบนเว็บไซต์"
  },
  PENDING: {
    label: "รอตรวจสอบ",
    badgeClassName: "border-[#eadbb8] bg-[#fff6df] text-[#8a6432]",
    panelClassName: "border-[#eee1c3] bg-[linear-gradient(180deg,rgba(255,247,227,0.95),rgba(255,255,255,1))]",
    titleClassName: "text-[#8a6432]",
    description: "สถานที่นี้ถูกส่งเข้าระบบแล้วและกำลังรอแอดมินตรวจสอบ"
  },
  REJECTED: {
    label: "ต้องแก้ไข",
    badgeClassName: "border-[#ebc8c8] bg-[#fff1f1] text-[#9a4b4b]",
    panelClassName: "border-[#f0d4d4] bg-[linear-gradient(180deg,rgba(255,241,241,0.96),rgba(255,255,255,1))]",
    titleClassName: "text-[#9a4b4b]",
    description: "สถานที่นี้ยังไม่ผ่านการอนุมัติ กรุณาตรวจสอบเหตุผลและส่งกลับเข้าตรวจสอบอีกครั้ง"
  }
};

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function MyPlacesPage() {
  const queryClient = useQueryClient();
  const [expandedRejectedId, setExpandedRejectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest");
  const { data: places = [], isLoading, isError, error } = useQuery({
    queryKey: ["my-places"],
    queryFn: fetchMyPlaces
  });

  const resubmitMutation = useMutation({
    mutationFn: resubmitMyPlace,
    onSuccess() {
      toast.success("ส่งสถานที่กลับเข้าตรวจสอบอีกครั้งเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["my-places"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ส่งกลับเข้าตรวจสอบไม่สำเร็จ");
    }
  });

  const filteredPlaces = places
    .filter((place) => (statusFilter === "ALL" ? true : place.status === statusFilter))
    .sort((left, right) => {
      if (sortBy === "oldest") {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      }

      if (sortBy === "name") {
        return left.name.localeCompare(right.name, "th");
      }

      if (sortBy === "rating") {
        return Number(right.averageRating || 0) - Number(left.averageRating || 0);
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="โปรไฟล์"
        title="สถานที่ของฉัน"
        description="ติดตามสถานะสถานที่ที่คุณส่งเข้าระบบทั้งหมดได้จากหน้านี้ โดยเน้นให้เห็นชัดว่ารายการไหนเผยแพร่แล้ว รายการไหนกำลังรอตรวจสอบ และรายการไหนต้องกลับไปแก้ไข"
      />

      <SectionCard
        title="สถานะรายการที่ส่ง"
        description="ข้อมูลชุดนี้ดึงจาก backend จริง และแสดงสถานะแต่ละรายการด้วยโทนสีแยกกันให้เห็นได้ทันที"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <div className="grid gap-4 rounded-[1.5rem] border border-[#eadfce] bg-white/70 p-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">กรองตามสถานะ</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
            >
              <option value="ALL">ทุกสถานะ</option>
              <option value="APPROVED">เผยแพร่แล้ว</option>
              <option value="PENDING">รอตรวจสอบ</option>
              <option value="REJECTED">ต้องแก้ไข</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">เรียงลำดับ</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
            >
              <option value="latest">อัปเดตล่าสุด</option>
              <option value="oldest">สร้างเก่าสุด</option>
              <option value="name">ชื่อ A-Z</option>
              <option value="rating">คะแนนสูงสุด</option>
            </select>
          </label>
        </div>

        {isLoading ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            กำลังโหลดสถานที่ของคุณ...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.5rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-10 text-sm text-[#9a4b4b]">
            {error?.response?.data?.message || "ไม่สามารถดึงรายการสถานที่ของคุณได้"}
          </div>
        ) : null}

        {!isLoading && !isError && places.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            คุณยังไม่มีสถานที่ที่ส่งเข้าระบบตอนนี้
          </div>
        ) : null}

        {!isLoading && !isError && places.length > 0 && filteredPlaces.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            ไม่พบรายการที่ตรงกับตัวกรองที่เลือก
          </div>
        ) : null}

        {!isLoading && !isError && filteredPlaces.length > 0
          ? filteredPlaces.map((place) => {
              const status = statusConfig[place.status] || statusConfig.PENDING;
              const isRejected = place.status === "REJECTED";
              const isPending = place.status === "PENDING";
              const isApproved = place.status === "APPROVED";
              const isExpanded = expandedRejectedId === place.id;
              const isSubmitting = resubmitMutation.isPending && resubmitMutation.variables === place.id;

              return (
                <div
                  key={place.id}
                  className={`rounded-[1.7rem] border p-5 shadow-[0_12px_28px_rgba(74,55,37,0.06)] ${status.panelClassName}`}
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex gap-4">
                      {place.coverImage ? (
                        <img
                          src={place.coverImage}
                          alt={place.name}
                          className="h-24 w-24 rounded-[1.4rem] border border-white/70 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-[1.4rem] border border-dashed border-[#d7c5b4] bg-white/60 text-xs tracking-[0.18em] text-[#9a836d]">
                          NO IMAGE
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs tracking-[0.22em] text-[#a06840]">
                            {getPlaceCategoryLabel(place.category)}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${status.badgeClassName}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div>
                          <div className="text-xl font-semibold text-[#3f3328]">{place.name}</div>
                          <div className="mt-1 text-sm text-[#74685e]">
                            {place.district} · คะแนน {Number(place.averageRating || 0).toFixed(1)} · {place.reviewCount || 0} รีวิว
                          </div>
                        </div>

                        <div className={`text-sm font-medium ${status.titleClassName}`}>{status.description}</div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8c7a6a]">
                          <span>สร้างเมื่อ {formatDate(place.createdAt)}</span>
                          <span>อัปเดตล่าสุด {formatDate(place.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {isApproved ? (
                        <>
                          <Link
                            to={`/places/${place.slug}`}
                            className="rounded-full border border-[#c9b7a5] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#5b4737] transition hover:border-[#9a816c] hover:text-[#3f3328]"
                          >
                            ดูสถานที่
                          </Link>
                          <Link
                            to={`/my-places/${place.id}/edit`}
                            className="rounded-full border border-[#b8d4c1] bg-[#edf7ef] px-4 py-2.5 text-sm font-semibold text-[#2f6b41] transition hover:border-[#8fbea0] hover:text-[#255635]"
                          >
                            แก้ไขและส่งตรวจใหม่
                          </Link>
                        </>
                      ) : null}

                      {isPending ? (
                        <>
                          <button
                            type="button"
                            disabled
                            className="cursor-not-allowed rounded-full border border-[#eadbb8] bg-[#fff8e8] px-4 py-2.5 text-sm font-semibold text-[#8a6432] opacity-90"
                          >
                            รอตรวจสอบ
                          </button>
                          <Link
                            to={`/my-places/${place.id}/edit`}
                            className="rounded-full border border-[#c9b7a5] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#5b4737] transition hover:border-[#9a816c] hover:text-[#3f3328]"
                          >
                            แก้ไขข้อมูล
                          </Link>
                        </>
                      ) : null}

                      {isRejected ? (
                        <>
                          <Link
                            to={`/my-places/${place.id}/edit`}
                            className="rounded-full border border-[#d8b7b7] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#8f4e4e] transition hover:bg-[#fff7f7]"
                          >
                            แก้ไขข้อมูล
                          </Link>
                          <button
                            type="button"
                            onClick={() => setExpandedRejectedId((current) => (current === place.id ? null : place.id))}
                            className="rounded-full border border-[#d8b7b7] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#8f4e4e] transition hover:bg-[#fff7f7]"
                          >
                            {isExpanded ? "ซ่อนเหตุผล" : "ดูเหตุผล"}
                          </button>
                          <button
                            type="button"
                            onClick={() => resubmitMutation.mutate(place.id)}
                            disabled={isSubmitting}
                            className="rounded-full bg-[#8f4e4e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a4040] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isSubmitting ? "กำลังส่ง..." : "ส่งกลับเข้าตรวจสอบอีกครั้ง"}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {isRejected && isExpanded ? (
                    <div className="mt-5 rounded-[1.4rem] border border-[#ebc8c8] bg-[#fff8f8] p-4">
                      <div className="text-xs tracking-[0.22em] text-[#9a4b4b]">เหตุผลที่ถูกปฏิเสธ</div>
                      <div className="mt-2 text-sm leading-7 text-[#6f6257]">
                        {place.rejectionReason || "ยังไม่มีข้อความเหตุผลจากระบบ"}
                      </div>
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
