import { Link } from "react-router-dom";
import { Ban, CircleAlert, Clock3, Eye, EyeOff, ImageOff, Pencil, RefreshCw, Star } from "lucide-react";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { formatMyPlaceDate } from "../lib/myPlaces";

function getActionButtonClassName({ tone = "neutral", isPrimary = false, fullWidth = true, className = "" } = {}) {
  const widthClassName = fullWidth ? "w-full" : "";

  if (isPrimary) {
    return `inline-flex min-h-11 ${widthClassName} items-center justify-center gap-2 rounded-full bg-[#8f4e4e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a4040] ${className}`.trim();
  }

  const toneClassName =
    tone === "success"
      ? "border-[#b8d4c1] bg-[#edf7ef] text-[#2f6b41] hover:border-[#8fbea0] hover:text-[#255635]"
      : tone === "warning"
        ? "border-[#eadbb8] bg-[#fff8e8] text-[#8a6432] hover:border-[#d8bf8f] hover:text-[#6c4f28]"
        : tone === "danger"
          ? "border-[#d8b7b7] bg-white/90 text-[#8f4e4e] hover:bg-[#fff7f7]"
          : "border-[#c9b7a5] bg-white/90 text-[#5b4737] hover:border-[#9a816c] hover:text-[#3f3328]";

  return `inline-flex min-h-11 ${widthClassName} items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${toneClassName} ${className}`.trim();
}

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

  return (
    <div className={`rounded-[1.7rem] border p-5 shadow-[0_12px_28px_rgba(74,55,37,0.06)] ${status.panelClassName}`}>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-4">
          {place.coverImage ? (
            <img
              src={place.coverImage}
              alt={place.name}
              className="h-24 w-24 rounded-[1.4rem] border border-white/70 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-[1.4rem] border border-dashed border-[#d7c5b4] bg-white/60 text-xs tracking-[0.12em] text-[#9a836d]">
              <ImageOff size={18} aria-hidden="true" />
              <span>ไม่มีรูป</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs tracking-[0.22em] text-[#a06840]">{getPlaceCategoryLabel(place.category)}</span>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${status.badgeClassName}`}
              >
                {status.label}
              </span>
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
              <Link
                to={`/places/${place.slug}`}
                className={getActionButtonClassName({ tone: "success", fullWidth: false })}
              >
                <Eye size={16} aria-hidden="true" />
                ดูหน้าสาธารณะ
              </Link>
              <button
                type="button"
                onClick={onToggleVisibility}
                disabled={isTogglingVisibility}
                className={`${getActionButtonClassName({ tone: "neutral", fullWidth: false })} disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {isInactive ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
                {isTogglingVisibility ? "กำลังบันทึก..." : isInactive ? "เปิดการแสดงผลอีกครั้ง" : "ปิดการแสดงผล"}
              </button>
              <Link
                to={`/my-places/${place.id}/edit`}
                className={getActionButtonClassName({ tone: "neutral", fullWidth: false })}
              >
                <CircleAlert size={16} aria-hidden="true" />
                ดูรายละเอียดภายใน
              </Link>
            </div>
          ) : null}

          {isPending ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to={`/my-places/${place.id}/edit`} className={getActionButtonClassName({ tone: "neutral" })}>
                <Pencil size={16} aria-hidden="true" />
                แก้ไขข้อมูล
              </Link>
              <Link to={`/my-places/${place.id}/edit`} className={getActionButtonClassName({ tone: "warning" })}>
                <Eye size={16} aria-hidden="true" />
                ข้อมูลภายใน
              </Link>
            </div>
          ) : null}

          {isRejected ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to={`/my-places/${place.id}/edit`} className={getActionButtonClassName({ tone: "danger" })}>
                <Pencil size={16} aria-hidden="true" />
                แก้ไขข้อมูล
              </Link>
              <button
                type="button"
                onClick={onToggleRejectedReason}
                className={getActionButtonClassName({ tone: "danger" })}
              >
                <CircleAlert size={16} aria-hidden="true" />
                {isExpanded ? "ซ่อนเหตุผล" : "ดูเหตุผล"}
              </button>
              <button
                type="button"
                onClick={onResubmit}
                disabled={isSubmitting}
                className={`${getActionButtonClassName({ isPrimary: true, className: "sm:col-span-2" })} disabled:cursor-not-allowed disabled:opacity-70`}
              >
                <RefreshCw size={16} aria-hidden="true" className={isSubmitting ? "animate-spin" : ""} />
                {isSubmitting ? "กำลังส่ง..." : "ส่งกลับเข้าตรวจอีกครั้ง"}
              </button>
              <Link
                to={`/my-places/${place.id}/edit`}
                className={getActionButtonClassName({ tone: "danger", className: "sm:col-span-2" })}
              >
                <Eye size={16} aria-hidden="true" />
                ข้อมูลภายใน
              </Link>
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
