import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { StateNotice } from "../../../shared/ui/StateNotice";
import { fetchAdminUsers, updateAdminUserRole } from "../api/adminUsersApi";

function getRoleBadgeClassName(role) {
  if (role === "ADMIN") {
    return "border-[#d9c3aa] bg-[#f8efe3] text-[#7b5a3f]";
  }

  return "border-[#ddd4c9] bg-[#fbf8f3] text-[#6c5f53]";
}

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateAdminUserRole(userId, role),
    onSuccess() {
      toast.success("อัปเดตสิทธิ์ผู้ใช้เรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError(mutationError) {
      toast.error(mutationError?.response?.data?.message || "อัปเดตสิทธิ์ผู้ใช้ไม่สำเร็จ");
    }
  });

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="แอดมิน"
        title="จัดการผู้ใช้"
        description="ตรวจสอบรายชื่อสมาชิกและปรับสิทธิ์ระหว่าง USER กับ ADMIN ได้จากหน้าที่ออกแบบให้เบา อ่านง่าย และโฟกัสกับการจัดการจริง"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="สิทธิ์ผู้ใช้"
        description="เรียงข้อมูลแบบรายการเพื่อให้สแกนชื่อ อีเมล และ role ได้เร็วขึ้น โดยลดองค์ประกอบที่ไม่จำเป็นออก"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        {isLoading ? (
          <StateNotice>กำลังโหลดผู้ใช้...</StateNotice>
        ) : null}

        {isError ? (
          <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงรายการผู้ใช้ได้"}</StateNotice>
        ) : null}

        {!isLoading && !isError && users.length === 0 ? (
          <StateNotice>ยังไม่มีผู้ใช้ในระบบ</StateNotice>
        ) : null}

        {!isLoading && !isError && users.length > 0 ? (
          <div className="overflow-hidden rounded-[1.7rem] border border-[#e5d8cb] bg-white/92 shadow-[0_10px_24px_rgba(74,55,37,0.05)]">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between ${
                  index !== users.length - 1 ? "border-b border-[#efe4d8]" : ""
                }`}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-base font-semibold text-[#3f3328]">{user.name}</div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${getRoleBadgeClassName(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="text-sm text-[#74685e]">{user.email}</div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold tracking-[0.16em] text-[#8f7d6d]">ROLE</label>
                  <select
                    value={user.role}
                    onChange={(event) =>
                      updateRoleMutation.mutate({
                        userId: user.id,
                        role: event.target.value
                      })
                    }
                    disabled={updateRoleMutation.isPending}
                    className="rounded-[1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-2.5 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
