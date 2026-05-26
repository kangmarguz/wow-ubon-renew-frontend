import { Suspense, lazy } from "react";
import { SectionCard } from "../../../shared/ui/SectionCard";

const PlaceLocationPickerMap = lazy(() =>
  import("./PlaceLocationPickerMap").then((module) => ({ default: module.PlaceLocationPickerMap }))
);

function MapLoadingFallback() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center bg-[linear-gradient(180deg,#fbf6ef_0%,#f1e7db_100%)] text-sm text-[#7c6f63]">
      กำลังโหลดแผนที่...
    </div>
  );
}

export function SubmitPlaceMapSection({
  mapKey,
  markerPosition,
  onPickLocation,
  latitude,
  longitude,
  onResetLocation
}) {
  return (
    <SectionCard
      title="ตำแหน่งบนแผนที่"
      description="คลิกเพื่อปักหมุดตำแหน่งจริงของสถานที่ แล้วเก็บค่าพิกัดไว้ส่งพร้อมฟอร์ม"
      className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,239,229,0.95))] shadow-[0_24px_70px_rgba(74,55,37,0.06)]"
      titleClassName="text-[1.6rem] text-[#3f3328]"
      descriptionClassName="text-[14px] leading-7 text-[#74685e]"
      contentClassName="space-y-4"
    >
      <div className="overflow-hidden rounded-[1.8rem] border border-[#d7c5b4]">
        <Suspense fallback={<MapLoadingFallback />}>
          <PlaceLocationPickerMap mapKey={mapKey} markerPosition={markerPosition} onPick={onPickLocation} />
        </Suspense>
      </div>

      <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4">
        <div className="text-xs tracking-[0.22em] text-[#9a836d]">LOCATION STATUS</div>
        <div className="mt-2 space-y-1 text-sm leading-6 text-[#6f6257]">
          <div>Latitude: {Number(latitude).toFixed(6)}</div>
          <div>Longitude: {Number(longitude).toFixed(6)}</div>
        </div>
        <button
          type="button"
          onClick={onResetLocation}
          className="mt-4 inline-flex rounded-full border border-[#d6c7b8] px-4 py-2 text-xs font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
        >
          รีเซ็ตตำแหน่ง
        </button>
      </div>
    </SectionCard>
  );
}
