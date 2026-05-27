import { Ban, Check, RotateCcw, X } from "lucide-react";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { PlaceActionButton } from "../../../shared/ui/PlaceActionButton";
import { PlaceStatusBadge } from "../../../shared/ui/PlaceStatusBadge";
import { PlaceThumbnail } from "../../../shared/ui/PlaceThumbnail";

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
        <PlaceThumbnail
          imageUrl={place.images?.[0]?.url}
          alt={place.name}
          imageClassName="h-28 w-full object-cover"
          fallbackClassName="flex h-28 flex-col items-center justify-center gap-2 text-xs text-[#8a7a6a]"
        />
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs tracking-[0.22em] text-[#a06840]">{getPlaceCategoryLabel(place.category)}</span>
          {!isInactive ? <PlaceStatusBadge status={place.status} className="text-[11px] tracking-[0.16em]" /> : null}
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
            <PlaceActionButton
              onClick={onApprove}
              disabled={isBusy}
              className="whitespace-nowrap bg-[#2e5a43] hover:bg-[#234634] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={16} aria-hidden="true" />
              อนุมัติ
            </PlaceActionButton>
            <PlaceActionButton
              onClick={onReject}
              disabled={isBusy}
              tone="danger"
              className="whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} aria-hidden="true" />
              ปฏิเสธ
            </PlaceActionButton>
            <PlaceActionButton
              onClick={onDeactivate}
              disabled={isBusy}
              tone="neutral"
              className="whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Ban size={16} aria-hidden="true" />
              ปิดการแสดงผล
            </PlaceActionButton>
          </>
        ) : null}

        {activeTab === "APPROVED" ? (
          <PlaceActionButton
            onClick={onDeactivate}
            disabled={isBusy}
            tone="neutral"
            className="whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Ban size={16} aria-hidden="true" />
            ปิดการแสดงผล
          </PlaceActionButton>
        ) : null}

        {activeTab === "INACTIVE" ? (
          <PlaceActionButton
            onClick={onActivate}
            disabled={isBusy}
            tone="success"
            className="whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={16} aria-hidden="true" />
            เปิดการแสดงผลอีกครั้ง
          </PlaceActionButton>
        ) : null}
      </div>
    </div>
  );
}
