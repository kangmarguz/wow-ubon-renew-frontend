import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { StateNotice } from "../../../shared/ui/StateNotice";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { fetchPlaceDetail } from "../api/publicPlacesApi";
import { PlaceDetailGallery } from "../components/PlaceDetailGallery";
import { PlaceDetailInfoSection } from "../components/PlaceDetailInfoSection";
import { PlaceDetailMapSection } from "../components/PlaceDetailMapSection";
import { PlaceDetailReviewsSection } from "../components/PlaceDetailReviewsSection";

export function PlaceDetailPage() {
  const { slug } = useParams();
  const user = useAuthStore((state) => state.user);
  const { data: place, isLoading, isError, error } = useQuery({
    queryKey: ["place-detail", slug],
    queryFn: () => fetchPlaceDetail(slug),
    enabled: Boolean(slug)
  });

  if (isLoading) {
    return <StateNotice tone="loading">กำลังโหลดรายละเอียดสถานที่...</StateNotice>;
  }

  if (isError) {
    const isNotFound = error?.response?.status === 404;

    return (
      <StateNotice tone={isNotFound ? "neutral" : "error"}>
        <div className="space-y-4">
          <div>
            {isNotFound
              ? "ไม่พบสถานที่นี้ หรือรายการนี้ถูกปิดการแสดงผลจากหน้าสาธารณะแล้ว"
              : error?.response?.data?.message || "ไม่สามารถดึงรายละเอียดสถานที่ได้"}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/places"
              className="inline-flex rounded-full border border-[#d7c5b4] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#5b4737] transition hover:border-[#bda893] hover:text-[#3f3328]"
            >
              กลับไปหน้าสถานที่
            </Link>
            <Link
              to="/"
              className="inline-flex rounded-full bg-[#8b6a4f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#74553e]"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </StateNotice>
    );
  }

  const existingReview = place.reviews?.find((review) => review.user.id === user?.id) || null;

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

      <PlaceDetailGallery images={place.images} placeName={place.name} />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <PlaceDetailInfoSection place={place} />
        <PlaceDetailMapSection place={place} />
      </section>

      <PlaceDetailReviewsSection place={place} user={user} existingReview={existingReview} />
    </div>
  );
}
