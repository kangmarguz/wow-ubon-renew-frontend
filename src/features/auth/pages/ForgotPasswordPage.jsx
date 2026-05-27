import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createPasswordResetRequest } from "../api/authApi";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";

const forgotPasswordSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
  phoneNumber: z.string().min(9, "กรุณากรอกเบอร์โทรให้ถูกต้อง")
});

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      phoneNumber: ""
    }
  });

  return (
    <div className="mx-auto max-w-xl">
      <PageIntro
        eyebrow="ลืมรหัสผ่าน"
        title="ส่งคำขอให้แอดมินรีเซ็ตรหัสผ่าน"
        description="กรอกอีเมลและเบอร์โทรให้ตรงกับข้อมูลบัญชี จากนั้นระบบจะส่งคำขอไปให้แอดมินตรวจสอบ"
      />
      <SectionCard
        title="ขอรีเซ็ตรหัสผ่าน"
        description="เมื่อแอดมินอนุมัติ ระบบจะตั้งรหัสผ่านชั่วคราวให้ แล้วบังคับเปลี่ยนรหัสผ่านใหม่ทันทีหลังเข้าสู่ระบบ"
        contentClassName="space-y-5"
      >
        <div className="inline-flex rounded-full border border-ink/10 bg-mist p-1">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm text-ink/70">
            กลับไปล็อกอิน
          </Link>
          <span className="rounded-full bg-[#8b6a4f] px-4 py-2 text-sm font-semibold text-white">ลืมรหัสผ่าน</span>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              setIsSubmitting(true);
              await createPasswordResetRequest(values);
              reset();
              toast.success("ส่งคำขอรีเซ็ตรหัสผ่านเรียบร้อยแล้ว");
            } catch (error) {
              toast.error(error?.response?.data?.message || "ส่งคำขอรีเซ็ตรหัสผ่านไม่สำเร็จ");
            } finally {
              setIsSubmitting(false);
            }
          })}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">อีเมล</span>
            <input className="w-full rounded-2xl border border-ink/10 px-4 py-3" {...register("email")} />
            {errors.email ? <span className="mt-1 block text-sm text-red-600">{errors.email.message}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">เบอร์โทร</span>
            <input className="w-full rounded-2xl border border-ink/10 px-4 py-3" {...register("phoneNumber")} />
            {errors.phoneNumber ? <span className="mt-1 block text-sm text-red-600">{errors.phoneNumber.message}</span> : null}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#8b6a4f] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังส่งคำขอ..." : "ส่งคำขอรีเซ็ตรหัสผ่าน"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
