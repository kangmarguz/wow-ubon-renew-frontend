import { Link } from "react-router-dom";
import { Ban, CircleAlert, Clock3, Eye, EyeOff, Pencil, RefreshCw, Star } from "lucide-react";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { LoadingInline } from "../../../shared/ui/LoadingInline";
import { PlaceActionButton } from "../../../shared/ui/PlaceActionButton";
import { PlaceStatusBadge } from "../../../shared/ui/PlaceStatusBadge";
import { PlaceThumbnail } from "../../../shared/ui/PlaceThumbnail";
import { formatMyPlaceDate } from "../lib/myPlaces";

export function MyPlaceCard({
  place,
  status,
  isExpanded,
  isSubmitting,
  isTogglingVisibility,
  onToggleRejectedReason,
  onResubmit,
  onToggleVisibility
}) {
  const isRejected = place.status === "REJECTED";
  const isPending = place.status === "PENDING";
  const isApproved = place.status === "APPROVED";
  const isInactive = place.isActive === false;
  const isAdminHidden = isInactive && place.hiddenByAdmin;

  return (
    <div className={`rounded-[1.7rem] border p-5 shadow-[0_12px_28px_rgba(74,55,37,0.06)] ${status.panelClassName}`}>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-4">
          <PlaceThumbnail
            imageUrl={place.coverImage}
            alt={place.name}
            imageClassName="h-24 w-24 rounded-[1.4rem] border border-white/70 object-cover shadow-sm"
            fallbackClassName="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-[1.4rem] border border-dashed border-[#d7c5b4] bg-white/60 text-xs tracking-[0.12em] text-[#9a836d]"
          />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs tracking-[0.22em] text-[#a06840]">{getPlaceCategoryLabel(place.category)}</span>
              <PlaceStatusBadge status={place.status} />
              {isInactive ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e2d5c7] bg-[#f7f1ea] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#6e6257]">
                  <Ban size={14} aria-hidden="true" />
                  ซ่อนจากหน้า public
                </span>
              ) : null}
            </div>

            <div>
              <div className="text-xl font-semibold text-[#3f3328]">{place.name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#74685e]">
                <span>{place.district}</span>
                <span className="inline-flex items-center gap-1">
                  <Star size={14} className="text-[#a06840]" aria-hidden="true" />
                  คะแนน {Number(place.averageRating || 0).toFixed(1)}
                </span>
                <span>{place.reviewCount || 0} รีวิว</span>
              </div>
            </div>

            <div className={`text-sm font-medium ${isInactive ? "text-[#7a5e46]" : status.titleClassName}`}>
              {isInactive
                ? "รายการนี้ยังผ่านการอนุมัติอยู่ แต่คุณปิดการแสดงผลไว้ จึงไม่แสดงบนหน้า public ตอนนี้"
                : status.description}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8c7a6a]">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={13} aria-hidden="true" />
                สร้างเมื่อ {formatMyPlaceDate(place.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw size={13} aria-hidden="true" />
                อัปเดตล่าสุด {formatMyPlaceDate(place.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full xl:ml-auto xl:max-w-[25rem]">
          {isApproved ? (
            <div className="ml-auto grid w-fit gap-3">
              {!isInactive ? (
                <PlaceActionButton as={Link} to={`/places/${place.slug}`} tone="success" fullWidth={false}>
                  <Eye size={16} aria-hidden="true" />
                  ดูหน้าสาธารณะ
                </PlaceActionButton>
              ) : null}
              <PlaceActionButton
                onClick={onToggleVisibility}
                disabled={isTogglingVisibility || isAdminHidden}
                tone="neutral"
                fullWidth={false}
                className="disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isTogglingVisibility ? (
                  <LoadingInline label="กำลังบันทึก..." size={16} />
                ) : (
                  <>
                    {isInactive ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
                    {isAdminHidden
                      ? "แอดมินปิดการแสดงผล"
                      : isInactive
                        ? "เปิดการแสดงผลอีกครั้ง"
                        : "ปิดการแสดงผล"}
                  </>
                )}
              </PlaceActionButton>
              {isAdminHidden ? (
                <div className="rounded-[1.2rem] border border-[#eadbb8] bg-[#fff7e7] px-4 py-3 text-sm leading-6 text-[#8a6432]">
                  แอดมินปิดการแสดงผลของรายการนี้อยู่ คุณยังไม่สามารถเปิดกลับได้เอง
                </div>
              ) : null}
              <PlaceActionButton as={Link} to={`/my-places/${place.id}/edit`} tone="neutral" fullWidth={false}>
                <CircleAlert size={16} aria-hidden="true" />
                ดูรายละเอียดภายใน
              </PlaceActionButton>
            </div>
          ) : null}

          {isPending ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <PlaceActionButton as={Link} to={`/my-places/${place.id}/edit`} tone="neutral">
                <Pencil size={16} aria-hidden="true" />
                แก้ไขข้อมูล
              </PlaceActionButton>
              <PlaceActionButton as={Link} to={`/my-places/${place.id}/edit`} tone="warning">
                <Eye size={16} aria-hidden="true" />
                ข้อมูลภายใน
              </PlaceActionButton>
            </div>
          ) : null}

          {isRejected ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <PlaceActionButton as={Link} to={`/my-places/${place.id}/edit`} tone="danger">
                <Pencil size={16} aria-hidden="true" />
                แก้ไขข้อมูล
              </PlaceActionButton>
              <PlaceActionButton onClick={onToggleRejectedReason} tone="danger">
                <CircleAlert size={16} aria-hidden="true" />
                {isExpanded ? "ซ่อนเหตุผล" : "ดูเหตุผล"}
              </PlaceActionButton>
              <PlaceActionButton
                onClick={onResubmit}
                disabled={isSubmitting}
                isPrimary
                className="sm:col-span-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <LoadingInline label="กำลังส่ง..." size={16} />
                ) : (
                  <>
                    <RefreshCw size={16} aria-hidden="true" />
                    ส่งกลับเข้าตรวจอีกครั้ง
                  </>
                )}
              </PlaceActionButton>
              <PlaceActionButton as={Link} to={`/my-places/${place.id}/edit`} tone="danger" className="sm:col-span-2">
                <Eye size={16} aria-hidden="true" />
                ข้อมูลภายใน
              </PlaceActionButton>
            </div>
          ) : null}
        </div>
      </div>

      {isRejected && isExpanded ? (
        <div className="mt-5 rounded-[1.4rem] border border-[#ebc8c8] bg-[#fff8f8] p-4">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.22em] text-[#9a4b4b]">
            <CircleAlert size={14} aria-hidden="true" />
            เหตุผลที่ถูกปฏิเสธ
          </div>
          <div className="mt-2 text-sm leading-7 text-[#6f6257]">
            {place.rejectionReason || "ยังไม่มีข้อความเหตุผลจากระบบ"}
          </div>
        </div>
      ) : null}
    </div>
  );
}
