import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { registerUser } from "../api/authApi";

const registerSchema = z
  .object({
    name: z.string().min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร"),
    email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
    phoneNumber: z.string().min(9, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string().min(8, "กรุณายืนยันรหัสผ่าน")
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "รหัสผ่านและยืนยันรหัสผ่านต้องตรงกัน"
  });

export function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: ""
    }
  });

  return (
    <div className="mx-auto max-w-xl">
      <PageIntro eyebrow="สมัครสมาชิก" title="สร้างบัญชีผู้ใช้" description="เก็บชื่อ อีเมล รหัสผ่าน และตรวจสอบยืนยันรหัสผ่านก่อนส่งข้อมูลไปที่ backend" />
      <SectionCard
        title="สมัครสมาชิก"
        description="มีบัญชีอยู่แล้ว? กลับไปล็อกอินได้จากเมนูด้านล่าง"
        contentClassName="space-y-5"
      >
        <div className="inline-flex rounded-full border border-ink/10 bg-mist p-1">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm text-ink/70">
            ล็อกอิน
          </Link>
          <Link to="/register" className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white">
            สมัครสมาชิก
          </Link>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async ({ confirmPassword, ...values }) => {
            try {
              setIsSubmitting(true);
              await registerUser(values);
              toast.success("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
              navigate("/login");
            } catch (error) {
              toast.error(error?.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
            } finally {
              setIsSubmitting(false);
            }
          })}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">ชื่อที่แสดง</span>
            <input className="w-full rounded-2xl border border-ink/10 px-4 py-3" {...register("name")} />
            {errors.name ? <span className="mt-1 block text-sm text-red-600">{errors.name.message}</span> : null}
          </label>

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

          <PasswordField
            label="รหัสผ่าน"
            error={errors.password?.message}
            inputClassName="w-full rounded-2xl border border-ink/10 px-4 py-3"
            inputProps={register("password")}
            autoComplete="new-password"
          />

          <PasswordField
            label="ยืนยันรหัสผ่าน"
            error={errors.confirmPassword?.message}
            inputClassName="w-full rounded-2xl border border-ink/10 px-4 py-3"
            inputProps={register("confirmPassword")}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
