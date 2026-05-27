import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { StateNotice } from "../../../shared/ui/StateNotice";
import {
  approveAdminPasswordResetRequest,
  fetchAdminPasswordResetRequests,
  rejectAdminPasswordResetRequest
} from "../api/adminPasswordResetRequestsApi";

function getStatusBadgeClassName(status) {
  if (status === "APPROVED") {
    return "border-[#cfe2cf] bg-[#eff8ef] text-[#416141]";
  }

  if (status === "REJECTED") {
    return "border-[#ecd0d0] bg-[#fff3f3] text-[#934c4c]";
  }

  return "border-[#e7d9c8] bg-[#fbf4ea] text-[#8b6a4f]";
}

export function AdminPasswordResetsPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: requests = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-password-reset-requests"],
    queryFn: fetchAdminPasswordResetRequests
  });

  const approveMutation = useMutation({
    mutationFn: approveAdminPasswordResetRequest,
    onSuccess() {
      toast.success("อนุมัติคำขอรีเซ็ตรหัสผ่านเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["admin-password-reset-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "อนุมัติคำขอไม่สำเร็จ");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestId, nextRejectReason }) => rejectAdminPasswordResetRequest(requestId, nextRejectReason),
    onSuccess() {
      toast.success("ปฏิเสธคำขอรีเซ็ตรหัสผ่านเรียบร้อยแล้ว");
      setRejectingRequestId(null);
      setRejectReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-password-reset-requests"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "ปฏิเสธคำขอไม่สำเร็จ");
    }
  });

  const filteredRequests = useMemo(() => {
    if (selectedStatus === "ALL") {
      return requests;
    }

    return requests.filter((request) => request.status === selectedStatus);
  }, [requests, selectedStatus]);

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="แอดมิน"
        title="คำขอรีเซ็ตรหัสผ่าน"
        description="ตรวจคำขอจากผู้ใช้ก่อนรีเซ็ตรหัสผ่านเป็นค่าเริ่มต้นของระบบ และเก็บสถานะการอนุมัติไว้ให้ตรวจย้อนหลังได้"
        className="max-w-4xl"
      />

      <SectionCard
        title="คิวคำขอ"
        description="แสดงรายการคำขอทั้งหมด โดยกันคำขอที่ค้างอยู่ซ้ำซ้อนและให้แอดมินตัดสินใจจากข้อมูลอีเมลกับเบอร์โทรที่ผู้ใช้ส่งเข้ามา"
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.16em] text-[#8f7d6d]">FILTER STATUS</span>
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="rounded-[1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-2.5 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
          >
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        {isLoading ? <StateNotice>กำลังโหลดคำขอรีเซ็ตรหัสผ่าน...</StateNotice> : null}
        {isError ? <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงคำขอได้"}</StateNotice> : null}
        {!isLoading && !isError && filteredRequests.length === 0 ? <StateNotice>ยังไม่มีคำขอในสถานะนี้</StateNotice> : null}

        {!isLoading && !isError && filteredRequests.length > 0 ? (
          <div className="overflow-hidden rounded-[1.7rem] border border-[#e5d8cb] bg-white/92 shadow-[0_10px_24px_rgba(74,55,37,0.05)]">
            {filteredRequests.map((request, index) => {
              const isPending = request.status === "PENDING";
              const isRejectingCurrent = rejectingRequestId === request.id;

              return (
                <div
                  key={request.id}
                  className={`space-y-4 px-5 py-4 ${index !== filteredRequests.length - 1 ? "border-b border-[#efe4d8]" : ""}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-base font-semibold text-[#3f3328]">{request.user?.name || "ผู้ใช้ไม่ทราบชื่อ"}</div>
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${getStatusBadgeClassName(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className="text-sm text-[#74685e]">อีเมล: {request.emailSnapshot}</div>
                      <div className="text-sm text-[#74685e]">เบอร์โทร: {request.phoneNumberSnapshot}</div>
                      <div className="text-xs text-[#8f7d6d]">
                        ส่งคำขอเมื่อ {new Date(request.requestedAt).toLocaleString("th-TH")}
                      </div>
                      {request.admin ? (
                        <div className="text-xs text-[#8f7d6d]">
                          ดำเนินการโดย {request.admin.name} เมื่อ{" "}
                          {request.resolvedAt ? new Date(request.resolvedAt).toLocaleString("th-TH") : "-"}
                        </div>
                      ) : null}
                      {request.rejectReason ? (
                        <div className="rounded-[1rem] border border-[#ecd8c4] bg-[#fffaf4] px-3 py-2 text-sm text-[#6f6257]">
                          เหตุผลที่ปฏิเสธ: {request.rejectReason}
                        </div>
                      ) : null}
                    </div>

                    {isPending ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => approveMutation.mutate(request.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          className="rounded-full bg-[#3f3328] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          อนุมัติและรีเซ็ตรหัสผ่าน
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingRequestId((current) => (current === request.id ? null : request.id));
                            setRejectReason("");
                          }}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          className="rounded-full border border-[#d8cbbd] px-4 py-2.5 text-sm font-semibold text-[#6f5644] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {isPending && isRejectingCurrent ? (
                    <div className="space-y-3 rounded-[1.2rem] border border-[#ecd8c4] bg-[#fffaf4] p-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">เหตุผลที่ปฏิเสธ (ไม่บังคับ)</span>
                        <textarea
                          value={rejectReason}
                          onChange={(event) => setRejectReason(event.target.value)}
                          rows={3}
                          className="w-full rounded-[1rem] border border-[#d8cbbd] bg-white px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
                        />
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => rejectMutation.mutate({ requestId: request.id, nextRejectReason: rejectReason })}
                          disabled={rejectMutation.isPending}
                          className="rounded-full bg-[#8f4e4e] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          ยืนยันการปฏิเสธ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingRequestId(null);
                            setRejectReason("");
                          }}
                          className="rounded-full border border-[#d8cbbd] px-4 py-2.5 text-sm font-semibold text-[#6f5644]"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
