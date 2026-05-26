import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { fetchMyPlaces, resubmitMyPlace } from "../api/myPlacesApi";
import { MyPlaceCard } from "../components/MyPlaceCard";
import { MyPlacesFilters } from "../components/MyPlacesFilters";
import { ProfilePagination } from "../components/ProfilePagination";
import { useProfilePagination } from "../hooks/useProfilePagination";
import { filterAndSortMyPlaces, getMyPlacesEmptyMessage, myPlacesStatusConfig, MY_PLACES_PAGE_SIZE } from "../lib/myPlaces";

export function MyPlacesPage() {
  const queryClient = useQueryClient();
  const [expandedRejectedId, setExpandedRejectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest");

  const { data: places = [], isLoading, isError, error } = useQuery({
    queryKey: ["my-places"],
    queryFn: fetchMyPlaces
  });

  const resubmitMutation = useMutation({
    mutationFn: resubmitMyPlace,
    onSuccess() {
      toast.success("ส่งสถานที่กลับเข้าตรวจสอบอีกครั้งเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["my-places"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ส่งกลับเข้าตรวจสอบไม่สำเร็จ");
    }
  });

  const filteredPlaces = filterAndSortMyPlaces(places, statusFilter, sortBy);
  const emptyMessage = getMyPlacesEmptyMessage(places, filteredPlaces);
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedPlaces
  } = useProfilePagination(filteredPlaces, MY_PLACES_PAGE_SIZE, [statusFilter, sortBy]);

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="โปรไฟล์"
        title="สถานที่ของฉัน"
        description="ติดตามสถานะสถานที่ที่คุณส่งเข้าระบบทั้งหมดได้จากหน้านี้ โดยเน้นให้เห็นชัดว่ารายการไหนเผยแพร่แล้ว รายการไหนกำลังรอตรวจสอบ รายการไหนต้องแก้ไข และรายการไหนถูกปิดการแสดงผลโดยแอดมิน"
      />

      <SectionCard
        title="สถานะรายการที่ส่ง"
        description="ข้อมูลชุดนี้ดึงจาก backend จริง และแสดงสถานะแต่ละรายการด้วยโทนสีแยกกันให้เห็นได้ทันที"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <MyPlacesFilters
          statusFilter={statusFilter}
          sortBy={sortBy}
          onStatusFilterChange={setStatusFilter}
          onSortByChange={setSortBy}
        />

        {isLoading ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            กำลังโหลดสถานที่ของคุณ...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.5rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-10 text-sm text-[#9a4b4b]">
            {error?.response?.data?.message || "ไม่สามารถดึงรายการสถานที่ของคุณได้"}
          </div>
        ) : null}

        {!isLoading && !isError && emptyMessage ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            {emptyMessage}
          </div>
        ) : null}

        {!isLoading && !isError && paginatedPlaces.length > 0
          ? paginatedPlaces.map((place) => {
              const status = myPlacesStatusConfig[place.status] || myPlacesStatusConfig.PENDING;
              const isExpanded = expandedRejectedId === place.id;
              const isSubmitting = resubmitMutation.isPending && resubmitMutation.variables === place.id;

              return (
                <MyPlaceCard
                  key={place.id}
                  place={place}
                  status={status}
                  isExpanded={isExpanded}
                  isSubmitting={isSubmitting}
                  onToggleRejectedReason={() =>
                    setExpandedRejectedId((current) => (current === place.id ? null : place.id))
                  }
                  onResubmit={() => resubmitMutation.mutate(place.id)}
                />
              );
            })
          : null}

        {!isLoading && !isError && filteredPlaces.length > 0 ? (
          <ProfilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        ) : null}
      </SectionCard>
    </div>
  );
}
