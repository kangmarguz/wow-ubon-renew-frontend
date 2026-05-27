import { Ban, Check, ImageOff, RotateCcw, X } from "lucide-react";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { adminPlaceStatusBadgeConfig, adminPlaceStatusLabelConfig } from "../lib/adminPlaces";

export function AdminPlaceListItem({
  place,
  activeTab,
  isBusy,
  onApprove,
  onReject,
  onDeactivate,
  onActivate
}) {
  const isInactive = place.isActive === false;

  return (
    <div className="grid gap-4 rounded-[1.6rem] border border-[#e4d7ca] bg-white/92 p-5 shadow-[0_10px_24px_rgba(74,55,37,0.05)] md:grid-cols-[112px_minmax(0,1fr)_auto]">
      <div className="overflow-hidden rounded-[1.2rem] bg-[#f4ebdf]">
        {place.images?.[0]?.url ? (
          <img src={place.images[0].url} alt={place.name} className="h-28 w-full object-cover" />
        ) : (
          <div className="flex h-28 flex-col items-center justify-center gap-2 text-xs text-[#8a7a6a]">
            <ImageOff size={18} aria-hidden="true" />
            <span>ไม่มีรูป</span>
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs tracking-[0.22em] text-[#a06840]">{getPlaceCategoryLabel(place.category)}</span>
          {!isInactive ? (
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${
                adminPlaceStatusBadgeConfig[place.status] || adminPlaceStatusBadgeConfig.PENDING
              }`}
            >
              {adminPlaceStatusLabelConfig[place.status] || place.status}
            </span>
          ) : null}
          {isInactive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e2d5c7] bg-[#f7f1ea] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#6e6257]">
              <Ban size={13} aria-hidden="true" />
              ปิดการแสดงผลแล้ว
            </span>
          ) : null}
        </div>

        <div className="text-lg font-semibold text-[#3f3328]">{place.name}</div>
        <div className="text-sm text-[#74685e]">
          {place.district}, {place.province}
        </div>
        <div className="line-clamp-2 text-sm leading-7 text-[#6f6257]">{place.description}</div>
        <div className="text-xs text-[#8c7a6a]">
          ผู้ส่ง: {place.createdBy?.name || "-"}
          {place.createdBy?.email ? ` (${place.createdBy.email})` : ""}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:w-56">
        {activeTab === "PENDING" ? (
          <>
            <button
              type="button"
              onClick={onApprove}
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#2e5a43] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#234634] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={16} aria-hidden="true" />
              อนุมัติ
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#d7b1b1] px-4 py-2.5 text-sm font-semibold text-[#8f4e4e] transition hover:bg-[#fff3f3] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} aria-hidden="true" />
              ปฏิเสธ
            </button>
            <button
              type="button"
              onClick={onDeactivate}
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#d6c7b8] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:bg-white hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Ban size={16} aria-hidden="true" />
              ปิดการแสดงผล
            </button>
          </>
        ) : null}

        {activeTab === "APPROVED" ? (
          <button
            type="button"
            onClick={onDeactivate}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#d6c7b8] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:bg-white hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Ban size={16} aria-hidden="true" />
            ปิดการแสดงผล
          </button>
        ) : null}

        {activeTab === "INACTIVE" ? (
          <button
            type="button"
            onClick={onActivate}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#c8d7cd] bg-[#edf7ef] px-4 py-2.5 text-sm font-semibold text-[#2f6b41] transition hover:border-[#97b9a3] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={16} aria-hidden="true" />
            เปิดการแสดงผลอีกครั้ง
          </button>
        ) : null}
      </div>
    </div>
  );
}
