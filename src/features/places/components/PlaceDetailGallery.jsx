import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { usePlaceGallery } from "../hooks/usePlaceGallery";

export function PlaceDetailGallery({ images, placeName }) {
  const safeImages = images || [];
  const { currentIndex, showPrevious, showNext, showIndex } = usePlaceGallery(safeImages);

  if (safeImages.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[linear-gradient(180deg,#fbf6ef_0%,#f1e7db_100%)] text-sm text-[#7c6f63]">
        <ImageOff size={26} aria-hidden="true" />
        <div>ยังไม่มีรูปภาพประกอบสำหรับสถานที่นี้</div>
      </div>
    );
  }

  const hasManyImages = safeImages.length > 1;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#f4ebdf] shadow-[0_20px_50px_rgba(74,55,37,0.12)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),transparent_25%,rgba(0,0,0,0.22))]" />
        <img
          src={safeImages[currentIndex].url}
          alt={`${placeName} ${currentIndex + 1}`}
          className="h-[460px] w-full object-cover md:h-[540px]"
        />

        {hasManyImages ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#3f3328] shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="ดูรูปก่อนหน้า"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#3f3328] shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="ดูรูปถัดไป"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-4 left-4 rounded-full bg-[#2f251d]/70 px-4 py-2 text-xs tracking-[0.22em] text-white backdrop-blur">
          {currentIndex + 1} / {safeImages.length}
        </div>
      </div>

      {hasManyImages ? (
        <div className="flex flex-wrap gap-3">
          {safeImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => showIndex(index)}
              className={`overflow-hidden rounded-[1.2rem] border transition ${
                index === currentIndex
                  ? "border-[#8b6a4f] shadow-[0_10px_24px_rgba(74,55,37,0.12)]"
                  : "border-[#ddcfbf] opacity-80 hover:opacity-100"
              }`}
            >
              <img src={image.url} alt={`${placeName} thumbnail ${index + 1}`} className="h-20 w-24 object-cover md:h-24 md:w-32" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
