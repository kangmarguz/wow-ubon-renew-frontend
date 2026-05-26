import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SearchFieldCard } from "../../../shared/ui/SearchFieldCard";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { StateNotice } from "../../../shared/ui/StateNotice";
import { ProfilePagination } from "../../profile/components/ProfilePagination";
import { useProfilePagination } from "../../profile/hooks/useProfilePagination";
import { AdminActionDialog } from "../components/AdminActionDialog";
import { AdminPlaceListItem } from "../components/AdminPlaceListItem";
import { AdminPlacesTabs } from "../components/AdminPlacesTabs";
import {
  activateAdminPlace,
  approvePendingPlace,
  deactivateAdminPlace,
  fetchAdminPlaces,
  rejectPendingPlace
} from "../api/adminPlacesApi";
import {
  ADMIN_PLACES_PAGE_SIZE,
  getAdminPlacesEmptyMessage,
  getAdminPlaceTabCounts,
  getFilteredAdminPlacesByTab,
  searchAdminPlaces
} from "../lib/adminPlaces";

export function AdminPlacesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [activateTarget, setActivateTarget] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: places = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-places"],
    queryFn: fetchAdminPlaces
  });

  function invalidatePlaceQueries() {
    queryClient.invalidateQueries({ queryKey: ["admin-places"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-places"] });
    queryClient.invalidateQueries({ queryKey: ["places"] });
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["my-places"] });
  }

  const approveMutation = useMutation({
    mutationFn: approvePendingPlace,
    onSuccess() {
      toast.success("อนุมัติสถานที่เรียบร้อยแล้ว");
      invalidatePlaceQueries();
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "อนุมัติสถานที่ไม่สำเร็จ");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ placeId, note }) => rejectPendingPlace(placeId, note),
    onSuccess() {
      toast.success("ปฏิเสธสถานที่เรียบร้อยแล้ว");
      setRejectTarget(null);
      setRejectionReason("");
      invalidatePlaceQueries();
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ปฏิเสธสถานที่ไม่สำเร็จ");
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateAdminPlace,
    onSuccess() {
      toast.success("ปิดการแสดงผลสถานที่เรียบร้อยแล้ว");
      setDeactivateTarget(null);
      invalidatePlaceQueries();
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ปิดการแสดงผลสถานที่ไม่สำเร็จ");
    }
  });

  const activateMutation = useMutation({
    mutationFn: activateAdminPlace,
    onSuccess() {
      toast.success("เปิดการแสดงผลสถานที่แล้ว และย้ายกลับเข้าคิวรอตรวจสอบ");
      setActivateTarget(null);
      invalidatePlaceQueries();
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "เปิดการแสดงผลสถานที่ไม่สำเร็จ");
    }
  });

  const tabCounts = useMemo(() => getAdminPlaceTabCounts(places), [places]);
  const visiblePlaces = useMemo(() => getFilteredAdminPlacesByTab(places, activeTab), [places, activeTab]);
  const filteredPlaces = useMemo(() => searchAdminPlaces(visiblePlaces, searchTerm), [visiblePlaces, searchTerm]);
  const emptyMessage = getAdminPlacesEmptyMessage(visiblePlaces, filteredPlaces);
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedPlaces
  } = useProfilePagination(filteredPlaces, ADMIN_PLACES_PAGE_SIZE, [searchTerm, activeTab]);

  const isBusy =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    deactivateMutation.isPending ||
    activateMutation.isPending;

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="แอดมิน"
        title="จัดการสถานที่"
        description="แยกคิวสถานที่เป็นหมวดชัดเจนระหว่างรอตรวจสอบ เผยแพร่แล้ว และปิดการแสดงผลแล้ว เพื่อให้สลับบริบทการจัดการได้เร็วขึ้น"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="รายการสถานที่ในระบบ"
        description="แต่ละแท็บใช้ search และ pagination ร่วมกัน โดยจะแสดงเฉพาะสถานะที่เกี่ยวข้องกับงานในแท็บนั้น"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <AdminPlacesTabs activeTab={activeTab} tabCounts={tabCounts} onTabChange={setActiveTab} />

        <SearchFieldCard
          label={`ค้นหาในแท็บ${tabCounts ? { PENDING: "รอตรวจสอบ", APPROVED: "เผยแพร่แล้ว", INACTIVE: "ปิดการแสดงผลแล้ว" }[activeTab] : ""}`}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="พิมพ์ชื่อสถานที่ที่ต้องการจัดการ"
        />

        {isLoading ? <StateNotice>กำลังโหลดรายการสถานที่...</StateNotice> : null}
        {isError ? <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงรายการสถานที่ได้"}</StateNotice> : null}
        {!isLoading && !isError && emptyMessage ? <StateNotice>{emptyMessage}</StateNotice> : null}

        {!isLoading && !isError && paginatedPlaces.length > 0 ? (
          <div className="space-y-4">
            {paginatedPlaces.map((place) => (
              <AdminPlaceListItem
                key={place.id}
                place={place}
                activeTab={activeTab}
                isBusy={isBusy}
                onApprove={() => approveMutation.mutate(place.id)}
                onReject={() => setRejectTarget(place)}
                onDeactivate={() => setDeactivateTarget(place)}
                onActivate={() => setActivateTarget(place)}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !isError && filteredPlaces.length > 0 ? (
          <ProfilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        ) : null}
      </SectionCard>

      {rejectTarget ? (
        <AdminActionDialog
          eyebrow="REJECTION NOTE"
          title="ระบุเหตุผลที่ปฏิเสธรายการนี้"
          description="ข้อความนี้จะถูกบันทึกไว้เพื่อให้ผู้ส่งรายการทราบว่าควรแก้ไขข้อมูลส่วนใดก่อนส่งใหม่"
          confirmLabel="ยืนยันการปฏิเสธ"
          confirmPendingLabel="กำลังปฏิเสธ..."
          isPending={rejectMutation.isPending}
          isConfirmDisabled={!rejectionReason.trim()}
          onCancel={() => {
            setRejectTarget(null);
            setRejectionReason("");
          }}
          onConfirm={() =>
            rejectMutation.mutate({
              placeId: rejectTarget.id,
              note: rejectionReason.trim()
            })
          }
        >
          <textarea
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            rows="6"
            className="w-full rounded-[1.4rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9b8d80] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
            placeholder="เช่น ข้อมูลสถานที่ยังไม่ครบ รูปภาพไม่ชัด หรือพิกัดไม่ถูกต้อง"
          />
        </AdminActionDialog>
      ) : null}

      {deactivateTarget ? (
        <AdminActionDialog
          eyebrow="VISIBILITY CONTROL"
          title="ยืนยันการปิดการแสดงผลสถานที่นี้"
          description={`เมื่อยืนยันแล้ว “${deactivateTarget.name}” จะหายจากหน้า public ทันที แต่เจ้าของรายการและแอดมินยังมองเห็นได้ในระบบ`}
          confirmLabel="ยืนยันการปิดการแสดงผล"
          confirmPendingLabel="กำลังปิดการแสดงผล..."
          isPending={deactivateMutation.isPending}
          onCancel={() => setDeactivateTarget(null)}
          onConfirm={() => deactivateMutation.mutate(deactivateTarget.id)}
        />
      ) : null}

      {activateTarget ? (
        <AdminActionDialog
          eyebrow="ACTIVATE PLACE"
          title="ยืนยันการเปิดการแสดงผลสถานที่นี้อีกครั้ง"
          description={`เมื่อยืนยันแล้ว “${activateTarget.name}” จะถูกเปิดใช้งานอีกครั้ง แต่สถานะจะกลับเป็นรอตรวจสอบก่อน เพื่อให้เจ้าของรายการอัปเดตและส่งตรวจใหม่`}
          confirmLabel="ยืนยันการเปิดใช้งาน"
          confirmPendingLabel="กำลังเปิดใช้งาน..."
          isPending={activateMutation.isPending}
          onCancel={() => setActivateTarget(null)}
          onConfirm={() => activateMutation.mutate(activateTarget.id)}
        />
      ) : null}
    </div>
  );
}
