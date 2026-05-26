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
import { approvePendingPlace, fetchPendingPlaces, rejectPendingPlace } from "../api/adminPlacesApi";

const PAGE_SIZE = 10;

export function AdminPlacesPage() {
  const queryClient = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: pendingPlaces = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-pending-places"],
    queryFn: fetchPendingPlaces
  });

  const approveMutation = useMutation({
    mutationFn: approvePendingPlace,
    onSuccess() {
      toast.success("อนุมัติสถานที่เรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-places"] });
      queryClient.invalidateQueries({ queryKey: ["places"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "อนุมัติสถานที่ไม่สำเร็จ");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ placeId, rejectionReason: note }) => rejectPendingPlace(placeId, note),
    onSuccess() {
      toast.success("ปฏิเสธสถานที่เรียบร้อยแล้ว");
      setRejectTarget(null);
      setRejectionReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-places"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ปฏิเสธสถานที่ไม่สำเร็จ");
    }
  });

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return pendingPlaces;
    }

    return pendingPlaces.filter((place) => place.name.toLowerCase().includes(normalizedSearch));
  }, [pendingPlaces, searchTerm]);

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
        description="ตรวจสอบรายการที่รออนุมัติจากผู้ใช้ ค้นหาตามชื่อสถานที่ได้ และไล่ตรวจทีละ 10 รายการเพื่อให้จัดการคิวได้ง่ายขึ้น"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="คิวรายการรออนุมัติ"
        description="แสดงเฉพาะรายการสถานะ PENDING พร้อมการค้นหาและแบ่งหน้า เพื่อให้ไล่ตรวจรายการได้เร็วขึ้นเมื่อคิวเริ่มเยอะ"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        <SearchFieldCard
          label="ค้นหาจากชื่อสถานที่"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="พิมพ์ชื่อสถานที่ที่ต้องการตรวจสอบ"
        />

        {isLoading ? <StateNotice>กำลังโหลดรายการรออนุมัติ...</StateNotice> : null}

        {isError ? (
          <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงรายการรออนุมัติได้"}</StateNotice>
        ) : null}

        {!isLoading && !isError && pendingPlaces.length === 0 ? <StateNotice>ตอนนี้ไม่มีรายการรออนุมัติ</StateNotice> : null}

        {!isLoading && !isError && pendingPlaces.length > 0 && filteredPlaces.length === 0 ? (
          <StateNotice>ไม่พบสถานที่ที่ตรงกับชื่อที่ค้นหา</StateNotice>
        ) : null}

        {!isLoading && !isError && paginatedPlaces.length > 0 ? (
          <div className="space-y-4">
            {paginatedPlaces.map((place) => (
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
                    <span className="rounded-full border border-[#eadbb8] bg-[#fff6df] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#8a6432]">
                      PENDING
                    </span>
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

                <div className="flex flex-col gap-3 md:w-36">
                  <button
                    type="button"
                    onClick={() => approveMutation.mutate(place.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="rounded-full bg-[#2e5a43] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#234634] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    อนุมัติ
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectTarget(place.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="rounded-full border border-[#d7b1b1] px-4 py-2.5 text-sm font-semibold text-[#8f4e4e] transition hover:bg-[#fff3f3] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </div>
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
              placeId: rejectTarget,
              rejectionReason: rejectionReason.trim()
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
    </div>
  );
}
