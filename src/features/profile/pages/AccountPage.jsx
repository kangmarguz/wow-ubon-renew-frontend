import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { updatePassword, updateProfile } from "../../auth/api/authApi";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { LoadingInline } from "../../../shared/ui/LoadingInline";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { SectionCard } from "../../../shared/ui/SectionCard";

const profileSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร"),
  phoneNumber: z.string().min(9, "กรุณากรอกเบอร์โทรให้ถูกต้อง")
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "กรุณากรอกรหัสผ่านปัจจุบัน"),
    newPassword: z.string().min(8, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmNewPassword: z.string().min(8, "กรุณายืนยันรหัสผ่านใหม่")
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ต้องตรงกัน"
  });

export function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || ""
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="บัญชีของฉัน"
        title="จัดการชื่อและรหัสผ่าน"
        description="ผู้ใช้ทุกประเภทสามารถแก้ไขชื่อที่แสดง และเปลี่ยนรหัสผ่านได้จากหน้านี้ โดยต้องยืนยันรหัสผ่านปัจจุบันก่อนทุกครั้ง"
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="ข้อมูลบัญชี"
          description="สรุปข้อมูลที่ใช้แสดงในระบบตอนนี้"
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
          titleClassName="text-[1.6rem] text-[#3f3328]"
          descriptionClassName="text-[14px] leading-7 text-[#74685e]"
          contentClassName="space-y-4"
        >
          <div className="rounded-[1.5rem] border border-[#e2d5c7] bg-white/80 p-5">
            <div className="text-xs tracking-[0.22em] text-[#9a836d]">DISPLAY NAME</div>
            <div className="mt-2 text-xl font-semibold text-[#3f3328]">{user?.name}</div>
          </div>
          <div className="rounded-[1.5rem] border border-[#e2d5c7] bg-white/80 p-5">
            <div className="text-xs tracking-[0.22em] text-[#9a836d]">EMAIL</div>
            <div className="mt-2 text-sm text-[#6f6257]">{user?.email}</div>
          </div>
          <div className="rounded-[1.5rem] border border-[#e2d5c7] bg-white/80 p-5">
            <div className="text-xs tracking-[0.22em] text-[#9a836d]">PHONE</div>
            <div className="mt-2 text-sm text-[#6f6257]">{user?.phoneNumber || "-"}</div>
          </div>
          <div className="rounded-[1.5rem] border border-[#e2d5c7] bg-white/80 p-5">
            <div className="text-xs tracking-[0.22em] text-[#9a836d]">ROLE</div>
            <div className="mt-2 text-sm font-semibold text-[#5b4737]">{user?.role}</div>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="แก้ไขชื่อที่แสดง"
            description="อัปเดตชื่อที่ใช้ในระบบและในรายการรีวิวหรือเมนูผู้ใช้"
            className="border-[#eadfce] bg-white/80"
            titleClassName="text-[1.6rem] text-[#3f3328]"
            descriptionClassName="text-[14px] leading-7 text-[#74685e]"
            contentClassName="space-y-4"
          >
            <form
              className="space-y-4"
              onSubmit={handleSubmitProfile(async (values) => {
                try {
                  setIsUpdatingProfile(true);
                  const nextUser = await updateProfile(values);
                  setUser(nextUser);
                  toast.success("อัปเดตชื่อเรียบร้อยแล้ว");
                } catch (error) {
                  toast.error(error?.response?.data?.message || "อัปเดตชื่อไม่สำเร็จ");
                } finally {
                  setIsUpdatingProfile(false);
                }
              })}
            >
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ชื่อที่แสดง</span>
                <input
                  className="w-full rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
                  {...registerProfile("name")}
                />
                {profileErrors.name ? <span className="mt-1 block text-sm text-red-600">{profileErrors.name.message}</span> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">เบอร์โทร</span>
                <input
                  className="w-full rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
                  {...registerProfile("phoneNumber")}
                />
                {profileErrors.phoneNumber ? (
                  <span className="mt-1 block text-sm text-red-600">{profileErrors.phoneNumber.message}</span>
                ) : null}
              </label>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="rounded-full bg-[#8b6a4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74553e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingProfile ? <LoadingInline label="กำลังบันทึก..." size={16} /> : "บันทึกชื่อใหม่"}
              </button>
            </form>
          </SectionCard>

          <SectionCard
            title="เปลี่ยนรหัสผ่าน"
            description="กรอกรหัสผ่านปัจจุบันก่อนทุกครั้ง แล้วตั้งรหัสผ่านใหม่ที่ต้องการใช้"
            className="border-[#eadfce] bg-white/80"
            titleClassName="text-[1.6rem] text-[#3f3328]"
            descriptionClassName="text-[14px] leading-7 text-[#74685e]"
            contentClassName="space-y-4"
          >
            <form
              className="space-y-4"
              onSubmit={handleSubmitPassword(async ({ confirmNewPassword, ...values }) => {
                try {
                  setIsUpdatingPassword(true);
                  const nextUser = await updatePassword(values);
                  setUser(nextUser);
                  resetPasswordForm();
                  toast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
                } catch (error) {
                  toast.error(error?.response?.data?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
                } finally {
                  setIsUpdatingPassword(false);
                }
              })}
            >
              <PasswordField
                label="รหัสผ่านปัจจุบัน"
                error={passwordErrors.currentPassword?.message}
                inputClassName="w-full rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
                inputProps={registerPassword("currentPassword")}
                autoComplete="current-password"
              />

              <PasswordField
                label="รหัสผ่านใหม่"
                error={passwordErrors.newPassword?.message}
                inputClassName="w-full rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
                inputProps={registerPassword("newPassword")}
                autoComplete="new-password"
              />

              <PasswordField
                label="ยืนยันรหัสผ่านใหม่"
                error={passwordErrors.confirmNewPassword?.message}
                inputClassName="w-full rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
                inputProps={registerPassword("confirmNewPassword")}
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="rounded-full bg-[#3f3328] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f251d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingPassword ? <LoadingInline label="กำลังเปลี่ยนรหัสผ่าน..." size={16} /> : "บันทึกรหัสผ่านใหม่"}
              </button>
            </form>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
