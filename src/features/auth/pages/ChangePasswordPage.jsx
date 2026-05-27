import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { completePasswordReset } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { SectionCard } from "../../../shared/ui/SectionCard";

const forcedResetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmNewPassword: z.string().min(8, "กรุณายืนยันรหัสผ่านใหม่")
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ต้องตรงกัน"
  });

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const mustChangePassword = useAuthStore((state) => state.user?.mustChangePassword);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forcedResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  return (
    <div className="mx-auto max-w-xl">
      <PageIntro
        eyebrow="เปลี่ยนรหัสผ่าน"
        title="ตั้งรหัสผ่านใหม่ก่อนใช้งานต่อ"
        description={
          mustChangePassword
            ? "บัญชีนี้ถูกรีเซ็ตรหัสผ่านโดยแอดมิน กรุณาเปลี่ยนรหัสผ่านใหม่ทันทีเพื่อเข้าใช้งานระบบต่อ"
            : "สามารถเปลี่ยนรหัสผ่านจากหน้านี้ได้ทุกเมื่อ"
        }
      />
      <SectionCard
        title="เปลี่ยนรหัสผ่าน"
        description="ตั้งรหัสผ่านใหม่ได้ทันทีโดยไม่ต้องกรอกรหัสชั่วคราวเดิม"
        contentClassName="space-y-4"
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async ({ confirmNewPassword, newPassword }) => {
            try {
              setIsSubmitting(true);
              const user = await completePasswordReset({ newPassword });
              setUser(user);
              toast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
              navigate("/account", { replace: true });
            } catch (error) {
              toast.error(error?.response?.data?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
            } finally {
              setIsSubmitting(false);
            }
          })}
        >
          <PasswordField
            label="รหัสผ่านใหม่"
            error={errors.newPassword?.message}
            inputClassName="w-full rounded-2xl border border-ink/10 px-4 py-3"
            inputProps={register("newPassword")}
            autoComplete="new-password"
          />

          <PasswordField
            label="ยืนยันรหัสผ่านใหม่"
            error={errors.confirmNewPassword?.message}
            inputClassName="w-full rounded-2xl border border-ink/10 px-4 py-3"
            inputProps={register("confirmNewPassword")}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#3f3328] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังบันทึกรหัสผ่าน..." : "บันทึกรหัสผ่านใหม่"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
