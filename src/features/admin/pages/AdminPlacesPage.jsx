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
  approvePendingPlace,
  deactivateAdminPlace,
  fetchAdminPlaces,
  rejectPendingPlace
} from "../api/adminPlacesApi";

const PAGE_SIZE = 10;

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

export function AdminPlacesPage() {
  const queryClient = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState(null);
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

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return places;
    }

    return places.filter((place) => place.name.toLowerCase().includes(normalizedSearch));
  }, [places, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / PAGE_SIZE));
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
        description="ตรวจสอบ อนุมัติ ปฏิเสธ และปิดการแสดงผลสถานที่จากหน้าเดียว พร้อมค้นหาตามชื่อและแบ่งหน้า 10 รายการต่อครั้ง"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="รายการสถานที่ในระบบ"
        description="หน้านี้รวมทั้งรายการที่รอตรวจสอบ รายการที่เผยแพร่แล้ว และรายการที่ถูกปิดการแสดงผล เพื่อให้จัดการต่อเนื่องได้จากที่เดียว"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <SearchFieldCard
          label="ค้นหาจากชื่อสถานที่"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="พิมพ์ชื่อสถานที่ที่ต้องการจัดการ"
        />

        {isLoading ? <StateNotice>กำลังโหลดรายการสถานที่...</StateNotice> : null}

        {isError ? (
          <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงรายการสถานที่ได้"}</StateNotice>
        ) : null}

        {!isLoading && !isError && places.length === 0 ? <StateNotice>ตอนนี้ยังไม่มีรายการสถานที่ในระบบ</StateNotice> : null}

        {!isLoading && !isError && places.length > 0 && filteredPlaces.length === 0 ? (
          <StateNotice>ไม่พบสถานที่ที่ตรงกับชื่อที่ค้นหา</StateNotice>
        ) : null}

        {!isLoading && !isError && paginatedPlaces.length > 0 ? (
          <div className="space-y-4">
            {paginatedPlaces.map((place) => {
              const isPending = place.status === "PENDING";
              const isInactive = place.isActive === false;
              const isBusy =
                approveMutation.isPending ||
                rejectMutation.isPending ||
                deactivateMutation.isPending;

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
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${
                          statusBadgeConfig[place.status] || statusBadgeConfig.PENDING
                        }`}
                      >
                        {statusLabelConfig[place.status] || place.status}
                      </span>
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
                    {isPending && !isInactive ? (
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
                      </>
                    ) : null}

                    {isInactive ? (
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-full border border-[#e2d5c7] bg-[#f7f1ea] px-4 py-2.5 text-sm font-semibold text-[#6e6257]"
                      >
                        ปิดการแสดงผลแล้ว
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeactivateTarget(place)}
                        disabled={isBusy}
                        className="rounded-full border border-[#d6c7b8] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:bg-white hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        ปิดการแสดงผล
                      </button>
                    )}
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
    </div>
  );
}
