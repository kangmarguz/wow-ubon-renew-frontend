import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const authPayload = await loginUser(values);
      setAuth(authPayload);
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageIntro eyebrow="เข้าสู่ระบบ" title="ล็อกอิน" description="ฟอร์มนี้พร้อมต่อเข้ากับ backend auth endpoint แล้ว" />
      <SectionCard
        title="เข้าสู่ระบบ"
        description="ยังไม่มีบัญชี? สามารถสลับไปหน้าสมัครสมาชิกได้ทันที"
        contentClassName="space-y-5"
      >
        <div className="inline-flex rounded-full border border-ink/10 bg-mist p-1">
          <Link to="/login" className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white">
            ล็อกอิน
          </Link>
          <Link to="/register" className="rounded-full px-4 py-2 text-sm text-ink/70">
            สมัครสมาชิก
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">อีเมล</span>
            <input className="w-full rounded-2xl border border-ink/10 px-4 py-3" {...register("email")} />
            {errors.email ? <span className="mt-1 block text-sm text-red-600">{errors.email.message}</span> : null}
          </label>

          <PasswordField
            label="รหัสผ่าน"
            error={errors.password?.message}
            inputClassName="w-full rounded-2xl border border-ink/10 px-4 py-3"
            inputProps={register("password")}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "ล็อกอิน"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
