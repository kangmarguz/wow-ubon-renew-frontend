import { SectionCard } from "../../../shared/ui/SectionCard";

export function PlaceDetailInfoSection({ place }) {
  return (
    <SectionCard
      title="รายละเอียดสถานที่"
      className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
      titleClassName="text-[1.75rem] text-[#3f3328]"
      contentClassName="space-y-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4">
          <div className="text-xs tracking-[0.22em] text-[#9a836d]">คะแนนเฉลี่ย</div>
          <div className="mt-2 text-2xl font-semibold text-[#3f3328]">{Number(place.averageRating || 0).toFixed(1)}</div>
          <div className="mt-1 text-sm text-[#74685e]">{place.reviewCount || 0} รีวิว</div>
        </div>

        <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4">
          <div className="text-xs tracking-[0.22em] text-[#9a836d]">พื้นที่</div>
          <div className="mt-2 text-base font-semibold text-[#3f3328]">{place.district}</div>
          <div className="mt-1 text-sm text-[#74685e]">{place.province}</div>
        </div>
      </div>

      {place.phoneNumber ? (
        <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-5">
          <div className="text-xs tracking-[0.22em] text-[#9a836d]">เบอร์โทรศัพท์</div>
          <div className="mt-2 text-base font-semibold text-[#3f3328]">{place.phoneNumber}</div>
        </div>
      ) : null}

      <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-5">
        <div className="text-sm leading-8 text-[#6f6257]">{place.description}</div>
      </div>
    </SectionCard>
  );
}
