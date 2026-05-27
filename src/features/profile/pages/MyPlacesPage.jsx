import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { StateNotice } from "../../../shared/ui/StateNotice";
import { AdminActionDialog } from "../../admin/components/AdminActionDialog";
import { fetchMyPlaces, resubmitMyPlace, updateMyPlaceVisibility } from "../api/myPlacesApi";
import { MyPlaceCard } from "../components/MyPlaceCard";
import { MyPlacesFilters } from "../components/MyPlacesFilters";
import { ProfilePagination } from "../components/ProfilePagination";
import { useProfilePagination } from "../hooks/useProfilePagination";
import {
  filterAndSortMyPlaces,
  getMyPlacesEmptyMessage,
  getMyPlacesSummary,
  myPlacesStatusConfig,
  MY_PLACES_PAGE_SIZE
} from "../lib/myPlaces";

export function MyPlacesPage() {
  const queryClient = useQueryClient();
  const [expandedRejectedId, setExpandedRejectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest");
  const [visibilityTarget, setVisibilityTarget] = useState(null);

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

  const visibilityMutation = useMutation({
    mutationFn: ({ placeId, isActive }) => updateMyPlaceVisibility(placeId, isActive),
    onSuccess(_data, variables) {
      toast.success(variables.isActive ? "เปิดการแสดงผลของสถานที่อีกครั้งแล้ว" : "ปิดการแสดงผลของสถานที่แล้ว");
      setVisibilityTarget(null);
      queryClient.invalidateQueries({ queryKey: ["my-places"] });
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "อัปเดตการแสดงผลของสถานที่ไม่สำเร็จ");
    }
  });

  function handleToggleVisibility(place) {
    setVisibilityTarget(place);
  }

  function handleConfirmVisibility() {
    if (!visibilityTarget) {
      return;
    }

    visibilityMutation.mutate({
      placeId: visibilityTarget.id,
      isActive: !visibilityTarget.isActive
    });
  }

  const filteredPlaces = filterAndSortMyPlaces(places, {
    searchTerm,
    statusFilter,
    visibilityFilter,
    sortBy
  });

  const hasActiveFilters =
    searchTerm.trim().length > 0 || statusFilter !== "ALL" || visibilityFilter !== "ALL" || sortBy !== "latest";
  const emptyMessage = getMyPlacesEmptyMessage(places, filteredPlaces, hasActiveFilters);
  const summary = getMyPlacesSummary(places);
  const isActivatingVisibility = visibilityTarget ? !visibilityTarget.isActive : false;
  const visibilityDialogTitle = isActivatingVisibility
    ? "ยืนยันการเปิดการแสดงผล"
    : "ยืนยันการปิดการแสดงผล";
  const visibilityDialogDescription = isActivatingVisibility
    ? "เมื่อเปิดการแสดงผลอีกครั้ง สถานที่นี้จะกลับไปแสดงบนหน้าสาธารณะทันที"
    : "เมื่อปิดการแสดงผล สถานที่นี้จะไม่แสดงบนหน้าสาธารณะจนกว่าคุณจะเปิดอีกครั้ง";
  const visibilityDialogConfirmLabel = isActivatingVisibility
    ? "เปิดการแสดงผลอีกครั้ง"
    : "ปิดการแสดงผล";
  const visibilityDialogPendingLabel = isActivatingVisibility
    ? "กำลังเปิดการแสดงผล..."
    : "กำลังปิดการแสดงผล...";

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedPlaces
  } = useProfilePagination(filteredPlaces, MY_PLACES_PAGE_SIZE, [searchTerm, statusFilter, visibilityFilter, sortBy]);

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="โปรไฟล์"
        title="สถานที่ของฉัน"
        description="ติดตามสถานะสถานที่ที่คุณส่งเข้าระบบทั้งหมดได้จากหน้านี้ พร้อมจัดการรายการที่ผ่านอนุมัติแล้วด้วยการเปิดหรือปิดการแสดงผลบนหน้า public ตามต้องการ"
      />

      <SectionCard
        title="ภาพรวมรายการของฉัน"
        description="สรุปสถานะของสถานที่ทั้งหมดที่คุณส่งเข้าระบบ เพื่อให้รู้ทันทีว่ารายการไหนรอตรวจ รายการไหนต้องแก้ไข และรายการไหนกำลังเผยแพร่อยู่"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "ทั้งหมด", value: summary.total },
            { label: "รอตรวจ", value: summary.pending },
            { label: "ไม่ผ่าน", value: summary.rejected },
            { label: "เผยแพร่อยู่", value: summary.visible },
            { label: "ซ่อนไว้", value: summary.hidden }
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.5rem] border border-[#e5d8cb] bg-white/88 px-5 py-4 shadow-[0_10px_24px_rgba(74,55,37,0.04)]"
            >
              <div className="text-xs tracking-[0.18em] text-[#9a836d]">{item.label}</div>
              <div className="mt-2 text-[1.9rem] font-semibold text-[#3f3328]">{item.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="จัดการรายการ"
        description="กรอง ค้นหา และจัดการ action ของแต่ละสถานที่ได้จากจุดเดียว โดย action จะเปลี่ยนตามสถานะของรายการนั้นโดยอัตโนมัติ"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <MyPlacesFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          visibilityFilter={visibilityFilter}
          sortBy={sortBy}
          onSearchTermChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onVisibilityFilterChange={setVisibilityFilter}
          onSortByChange={setSortBy}
        />

        {isLoading ? <StateNotice>กำลังโหลดสถานที่ของคุณ...</StateNotice> : null}

        {isError ? <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงรายการสถานที่ของคุณได้"}</StateNotice> : null}

        {!isLoading && !isError && emptyMessage ? (
          <StateNotice>
            <div className="space-y-4">
              <div>{emptyMessage}</div>
              {places.length === 0 ? (
                <Link
                  to="/submit-place"
                  className="inline-flex rounded-full bg-[#8b6a4f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#74553e]"
                >
                  เพิ่มสถานที่แรกของฉัน
                </Link>
              ) : null}
            </div>
          </StateNotice>
        ) : null}

        {!isLoading && !isError && paginatedPlaces.length > 0
          ? paginatedPlaces.map((place) => {
              const status = myPlacesStatusConfig[place.status] || myPlacesStatusConfig.PENDING;
              const isExpanded = expandedRejectedId === place.id;
              const isSubmitting = resubmitMutation.isPending && resubmitMutation.variables === place.id;
              const isTogglingVisibility =
                visibilityMutation.isPending && visibilityMutation.variables?.placeId === place.id;

              return (
                <MyPlaceCard
                  key={place.id}
                  place={place}
                  status={status}
                  isExpanded={isExpanded}
                  isSubmitting={isSubmitting}
                  isTogglingVisibility={isTogglingVisibility}
                  onToggleRejectedReason={() =>
                    setExpandedRejectedId((current) => (current === place.id ? null : place.id))
                  }
                  onResubmit={() => resubmitMutation.mutate(place.id)}
                  onToggleVisibility={() => handleToggleVisibility(place)}
                />
              );
            })
          : null}

        {!isLoading && !isError && filteredPlaces.length > 0 ? (
          <ProfilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        ) : null}
      </SectionCard>

      {visibilityTarget ? (
        <AdminActionDialog
          eyebrow="จัดการการแสดงผล"
          title={visibilityDialogTitle}
          description={visibilityDialogDescription}
          cancelLabel="ยังไม่ดำเนินการ"
          confirmLabel={visibilityDialogConfirmLabel}
          confirmPendingLabel={visibilityDialogPendingLabel}
          confirmTone={isActivatingVisibility ? "success" : "danger"}
          isPending={visibilityMutation.isPending}
          onCancel={() => setVisibilityTarget(null)}
          onConfirm={handleConfirmVisibility}
        >
          <div className="rounded-[1.25rem] border border-[#eadfce] bg-[#faf5ee] px-4 py-3 text-sm leading-7 text-[#6f5e4f]">
            <div className="font-semibold text-[#4c3b2d]">{visibilityTarget.name}</div>
            <div className="mt-1">
              {isActivatingVisibility
                ? "รายการนี้จะกลับไปให้คนทั่วไปเข้าดูได้อีกครั้ง"
                : "รายการนี้จะถูกซ่อนออกจากหน้าสาธารณะทันที"}
            </div>
          </div>
        </AdminActionDialog>
      ) : null}
    </div>
  );
}
