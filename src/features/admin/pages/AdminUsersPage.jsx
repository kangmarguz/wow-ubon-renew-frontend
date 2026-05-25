import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { fetchAdminUsers, updateAdminUserRole } from "../api/adminUsersApi";

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
        description="ดูรายการสมาชิกในระบบและเปลี่ยนสิทธิ์ระหว่าง USER และ ADMIN ได้จากหน้านี้"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.4rem] leading-tight md:text-[3rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="สิทธิ์ผู้ใช้"
        description="ข้อมูลผู้ใช้ดึงจาก backend จริง"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.7rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-4"
      >
        {isLoading ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            กำลังโหลดผู้ใช้...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-[1.5rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-10 text-sm text-[#9a4b4b]">
            {error?.response?.data?.message || "ไม่สามารถดึงรายการผู้ใช้ได้"}
          </div>
        ) : null}

        {!isLoading && !isError && users.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-10 text-sm text-[#7c6f63]">
            ยังไม่มีผู้ใช้ในระบบ
          </div>
        ) : null}

        {!isLoading && !isError && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 rounded-[1.6rem] border border-[#e2d5c7] bg-white p-5 shadow-[0_10px_30px_rgba(74,55,37,0.06)] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-lg font-semibold text-[#3f3328]">{user.name}</div>
                <div className="mt-1 text-sm text-[#74685e]">{user.email}</div>
                <div className="mt-1 text-xs tracking-[0.18em] text-[#9a836d]">ROLE: {user.role}</div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={user.role}
                  onChange={(event) =>
                    updateRoleMutation.mutate({
                      userId: user.id,
                      role: event.target.value
                    })
                  }
                  disabled={updateRoleMutation.isPending}
                  className="rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          ))
        ) : null}
      </SectionCard>
    </div>
  );
}
