import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PageIntro } from "../../../shared/ui/PageIntro";
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
