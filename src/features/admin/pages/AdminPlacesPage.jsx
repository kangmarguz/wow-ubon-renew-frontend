import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SearchFieldCard } from "../../../shared/ui/SearchFieldCard";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { StateNotice } from "../../../shared/ui/StateNotice";
import { getPlaceCategoryLabel } from "../../../shared/constants/placeCategories";
import { ProfilePagination } from "../../profile/components/ProfilePagination";
import { AdminActionDialog } from "../components/AdminActionDialog";
import {
  activateAdminPlace,
  approvePendingPlace,
  deactivateAdminPlace,
  fetchAdminPlaces,
  rejectPendingPlace
} from "../api/adminPlacesApi";

const PAGE_SIZE = 10;

const tabs = [
  { key: "PENDING", label: "รอตรวจสอบ" },
  { key: "APPROVED", label: "เผยแพร่แล้ว" },
  { key: "INACTIVE", label: "ปิดการแสดงผลแล้ว" }
];

const statusBadgeConfig = {
  APPROVED: "border-[#cfe4d4] bg-[#edf7ef] text-[#2f6b41]",
  PENDING: "border-[#eadbb8] bg-[#fff6df] text-[#8a6432]",
  REJECTED: "border-[#ebc8c8] bg-[#fff1f1] text-[#9a4b4b]"
};

const statusLabelConfig = {
  APPROVED: "เผยแพร่แล้ว",
  PENDING: "รอตรวจสอบ",
  REJECTED: "ต้องแก้ไข"
};

function getFilteredByTab(places, activeTab) {
  if (activeTab === "PENDING") {
    return places.filter((place) => place.isActive !== false && place.status === "PENDING");
  }

  if (activeTab === "APPROVED") {
    return places.filter((place) => place.isActive !== false && place.status === "APPROVED");
  }

  return places.filter((place) => place.isActive === false);
}

export function AdminPlacesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [activateTarget, setActivateTarget] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: places = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-places"],
    queryFn: fetchAdminPlaces
  });

  const invalidatePlaceQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-places"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-places"] });
    queryClient.invalidateQueries({ queryKey: ["places"] });
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["my-places"] });
  };

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

  const tabCounts = useMemo(
    () => ({
      PENDING: places.filter((place) => place.isActive !== false && place.status === "PENDING").length,
      APPROVED: places.filter((place) => place.isActive !== false && place.status === "APPROVED").length,
      INACTIVE: places.filter((place) => place.isActive === false).length
    }),
    [places]
  );

  const visiblePlaces = useMemo(() => getFilteredByTab(places, activeTab), [places, activeTab]);

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return visiblePlaces;
    }

    return visiblePlaces.filter((place) => place.name.toLowerCase().includes(normalizedSearch));
  }, [visiblePlaces, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / PAGE_SIZE));
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const isActiveTab = activeTab === tab.key;
            const count = tabCounts[tab.key] || 0;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  isActiveTab
                    ? "border-[#3f3328] bg-[#3f3328] text-white shadow-[0_10px_18px_rgba(63,51,40,0.14)]"
                    : "border-[#dacbbc] bg-white/82 text-[#5f5145] hover:border-[#b79c82] hover:bg-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActiveTab ? "bg-white/18 text-white" : "bg-[#f3e7da] text-[#816a57]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <SearchFieldCard
          label={`ค้นหาในแท็บ${tabs.find((tab) => tab.key === activeTab)?.label || ""}`}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="พิมพ์ชื่อสถานที่ที่ต้องการจัดการ"
        />

        {isLoading ? <StateNotice>กำลังโหลดรายการสถานที่...</StateNotice> : null}

        {isError ? (
          <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงรายการสถานที่ได้"}</StateNotice>
        ) : null}

        {!isLoading && !isError && visiblePlaces.length === 0 ? (
          <StateNotice>ไม่มีรายการในแท็บนี้ตอนนี้</StateNotice>
        ) : null}

        {!isLoading && !isError && visiblePlaces.length > 0 && filteredPlaces.length === 0 ? (
          <StateNotice>ไม่พบสถานที่ที่ตรงกับชื่อที่ค้นหา</StateNotice>
        ) : null}

        {!isLoading && !isError && paginatedPlaces.length > 0 ? (
          <div className="space-y-4">
            {paginatedPlaces.map((place) => {
              const isInactive = place.isActive === false;
              const isPending = place.status === "PENDING";
              const isBusy =
                approveMutation.isPending ||
                rejectMutation.isPending ||
                deactivateMutation.isPending ||
                activateMutation.isPending;

              return (
                <div
                  key={place.id}
                  className="grid gap-4 rounded-[1.6rem] border border-[#e4d7ca] bg-white/92 p-5 shadow-[0_10px_24px_rgba(74,55,37,0.05)] md:grid-cols-[112px_minmax(0,1fr)_auto]"
                >
                  <div className="overflow-hidden rounded-[1.2rem] bg-[#f4ebdf]">
                    {place.images?.[0]?.url ? (
                      <img src={place.images[0].url} alt={place.name} className="h-28 w-full object-cover" />
                    ) : (
                      <div className="flex h-28 items-center justify-center text-xs text-[#8a7a6a]">ไม่มีรูป</div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs tracking-[0.22em] text-[#a06840]">{getPlaceCategoryLabel(place.category)}</span>
                      {!isInactive ? (
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${
                            statusBadgeConfig[place.status] || statusBadgeConfig.PENDING
                          }`}
                        >
                          {statusLabelConfig[place.status] || place.status}
                        </span>
                      ) : null}
                      {isInactive ? (
                        <span className="rounded-full border border-[#e2d5c7] bg-[#f7f1ea] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#6e6257]">
                          ปิดการแสดงผลแล้ว
                        </span>
                      ) : null}
                    </div>

                    <div className="text-lg font-semibold text-[#3f3328]">{place.name}</div>
                    <div className="text-sm text-[#74685e]">
                      {place.district}, {place.province}
                    </div>
                    <div className="text-sm leading-7 text-[#6f6257] line-clamp-2">{place.description}</div>
                    <div className="text-xs text-[#8c7a6a]">
                      ผู้ส่ง: {place.createdBy?.name || "-"}
                      {place.createdBy?.email ? ` (${place.createdBy.email})` : ""}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:w-44">
                    {activeTab === "PENDING" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => approveMutation.mutate(place.id)}
                          disabled={isBusy}
                          className="rounded-full bg-[#2e5a43] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#234634] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          อนุมัติ
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectTarget(place)}
                          disabled={isBusy}
                          className="rounded-full border border-[#d7b1b1] px-4 py-2.5 text-sm font-semibold text-[#8f4e4e] transition hover:bg-[#fff3f3] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          ปฏิเสธ
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeactivateTarget(place)}
                          disabled={isBusy}
                          className="rounded-full border border-[#d6c7b8] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:bg-white hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          ปิดการแสดงผล
                        </button>
                      </>
                    ) : null}

                    {activeTab === "APPROVED" ? (
                      <button
                        type="button"
                        onClick={() => setDeactivateTarget(place)}
                        disabled={isBusy}
                        className="rounded-full border border-[#d6c7b8] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:bg-white hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        ปิดการแสดงผล
                      </button>
                    ) : null}

                    {activeTab === "INACTIVE" ? (
                      <button
                        type="button"
                        onClick={() => setActivateTarget(place)}
                        disabled={isBusy}
                        className="rounded-full border border-[#c8d7cd] bg-[#edf7ef] px-4 py-2.5 text-sm font-semibold text-[#2f6b41] transition hover:border-[#97b9a3] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        เปิดการแสดงผลอีกครั้ง
                      </button>
                    ) : null}

                    {!isPending && activeTab === "PENDING" ? null : null}
                  </div>
                </div>
              );
            })}
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
