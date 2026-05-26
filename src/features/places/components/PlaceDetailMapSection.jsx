import { Suspense, lazy } from "react";
import { SectionCard } from "../../../shared/ui/SectionCard";

const PlaceStaticMap = lazy(() => import("./PlaceStaticMap").then((module) => ({ default: module.PlaceStaticMap })));

function MapLoadingFallback({ heightClassName }) {
  return (
    <div
      className={`flex items-center justify-center bg-[linear-gradient(180deg,#fbf6ef_0%,#f1e7db_100%)] text-sm text-[#7c6f63] ${heightClassName}`}
    >
      กำลังโหลดแผนที่...
    </div>
  );
}

export function PlaceDetailMapSection({ place }) {
  return (
    <SectionCard
      title="ตำแหน่งบนแผนที่"
      description="แสดงพิกัดจริงของสถานที่นี้จากข้อมูลที่ถูกบันทึกไว้"
      className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,239,229,0.95))]"
      titleClassName="text-[1.6rem] text-[#3f3328]"
      descriptionClassName="text-[14px] leading-7 text-[#74685e]"
      contentClassName="space-y-4"
    >
      <div className="overflow-hidden rounded-[1.8rem] border border-[#d7c5b4]">
        <Suspense fallback={<MapLoadingFallback heightClassName="h-[360px] w-full" />}>
          <PlaceStaticMap latitude={place.latitude} longitude={place.longitude} />
        </Suspense>
      </div>

      <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4 text-sm leading-7 text-[#6f6257]">
        <div>Latitude: {Number(place.latitude).toFixed(6)}</div>
        <div>Longitude: {Number(place.longitude).toFixed(6)}</div>
      </div>
    </SectionCard>
  );
}
