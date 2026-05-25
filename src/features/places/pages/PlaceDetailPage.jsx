import { useQuery } from "@tanstack/react-query";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { fetchPlaceDetail } from "../api/publicPlacesApi";

const placeMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function PlaceDetailPage() {
  const { slug } = useParams();
  const { data: place, isLoading, isError, error } = useQuery({
    queryKey: ["place-detail", slug],
    queryFn: () => fetchPlaceDetail(slug),
    enabled: Boolean(slug)
  });

  if (isLoading) {
    return (
      <div className="rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-12 text-sm text-[#7c6f63]">
        กำลังโหลดรายละเอียดสถานที่...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[1.8rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-12 text-sm text-[#9a4b4b]">
        {error?.response?.data?.message || "ไม่สามารถดึงรายละเอียดสถานที่ได้"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={getPlaceCategoryLabel(place.category)}
        title={place.name}
        description={`${place.address} ${place.district} ${place.province}`.trim()}
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.7rem] leading-tight md:text-[3.6rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="รูปภาพและรายละเอียด"
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
          titleClassName="text-[1.75rem] text-[#3f3328]"
          contentClassName="space-y-5"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {place.images?.length > 0 ? (
              place.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-[1.5rem] bg-[#f4ebdf]">
                  <img src={image.url} alt={place.name} className="h-48 w-full object-cover" />
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
                ยังไม่มีรูปภาพประกอบ
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4">
              <div className="text-xs tracking-[0.22em] text-[#9a836d]">คะแนนเฉลี่ย</div>
              <div className="mt-2 text-2xl font-semibold text-[#3f3328]">
                {Number(place.averageRating || 0).toFixed(1)}
              </div>
              <div className="mt-1 text-sm text-[#74685e]">{place.reviewCount || 0} รีวิว</div>
            </div>

            <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4">
              <div className="text-xs tracking-[0.22em] text-[#9a836d]">พื้นที่</div>
              <div className="mt-2 text-base font-semibold text-[#3f3328]">{place.district}</div>
              <div className="mt-1 text-sm text-[#74685e]">{place.province}</div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-5">
            <div className="text-sm leading-8 text-[#6f6257]">{place.description}</div>
          </div>
        </SectionCard>

        <SectionCard
          title="ตำแหน่งบนแผนที่"
          description="แสดงพิกัดจริงของสถานที่นี้จากข้อมูลที่ถูกบันทึกไว้"
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,239,229,0.95))]"
          titleClassName="text-[1.6rem] text-[#3f3328]"
          descriptionClassName="text-[14px] leading-7 text-[#74685e]"
          contentClassName="space-y-4"
        >
          <div className="overflow-hidden rounded-[1.8rem] border border-[#d7c5b4]">
            <MapContainer
              center={[place.latitude, place.longitude]}
              zoom={13}
              scrollWheelZoom
              className="h-[360px] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[place.latitude, place.longitude]} icon={placeMarkerIcon} />
            </MapContainer>
          </div>

          <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4 text-sm leading-7 text-[#6f6257]">
            <div>Latitude: {Number(place.latitude).toFixed(6)}</div>
            <div>Longitude: {Number(place.longitude).toFixed(6)}</div>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        title="รีวิว"
        description="รีวิวจากผู้ใช้งานที่มองเห็นได้บนระบบ"
        className="border-[#eadfce] bg-white/80"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        {place.reviews?.length > 0 ? (
          place.reviews.map((review) => (
            <div key={review.id} className="rounded-[1.5rem] border border-[#e2d5c7] bg-[#fffdf9] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="font-semibold text-[#3f3328]">{review.user.name}</div>
                <div className="text-sm text-[#74685e]">คะแนน: {review.rating}/5</div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6f6257]">{review.content}</p>
            </div>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            ยังไม่มีรีวิวสำหรับสถานที่นี้
          </div>
        )}
      </SectionCard>
    </div>
  );
}
