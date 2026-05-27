import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { publicLinks } from "../constants/navigation";
import { MobileNavDrawer } from "./app-shell/MobileNavDrawer";
import { NavItem } from "./app-shell/NavItem";
import { UserMenu } from "./app-shell/UserMenu";

export function AppShell() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isPasswordResetLocked = Boolean(user?.mustChangePassword);

  function handleLogout() {
    clearAuth();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f1e9_0%,#fbf8f3_26%,#f6efe6_100%)]">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-visible rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,253,249,0.88),rgba(250,244,236,0.78))] px-4 py-4 shadow-[0_16px_38px_rgba(74,55,37,0.08)] backdrop-blur md:px-6">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(219,188,157,0.18),transparent_22%),radial-gradient(circle_at_86%_12%,rgba(110,143,121,0.1),transparent_16%)]" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="min-w-0">
                {isPasswordResetLocked ? (
                  <div className="inline-flex flex-col">
                    <div className="font-display text-[1.5rem] leading-none text-[#31261d]">ว้าวอุบล</div>
                    <div className="mt-1 hidden text-[11px] tracking-[0.24em] text-[#8a7a6a] md:block">
                      เปลี่ยนรหัสผ่านก่อนใช้งานส่วนอื่นของระบบ
                    </div>
                  </div>
                ) : (
                  <NavLink to="/" className="group inline-flex flex-col">
                    <div className="font-display text-[1.5rem] leading-none text-[#31261d] transition group-hover:text-[#46372a]">
                      ว้าวอุบล
                    </div>
                    <div className="mt-1 hidden text-[11px] tracking-[0.24em] text-[#8a7a6a] md:block">
                      แพลตฟอร์มรวมข้อมูลร้านอาหาร ที่พัก และที่เที่ยว
                    </div>
                  </NavLink>
                )}
              </div>

              {!isPasswordResetLocked ? (
                <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/52 p-1.5 shadow-[0_10px_24px_rgba(74,55,37,0.05)] md:flex">
                  {publicLinks.map((link) => (
                    <NavItem key={link.to} {...link} />
                  ))}
                </nav>
              ) : (
                <div className="hidden rounded-full border border-[#e8d9c9] bg-[#fff8f1] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#8b6a4f] md:block">
                  PASSWORD RESET REQUIRED
                </div>
              )}

              <div className="flex items-center gap-3">
                <MobileNavDrawer user={user} onLogout={handleLogout} isPasswordResetLocked={isPasswordResetLocked} />

                <div className="hidden items-center gap-2 md:flex">
                  {user ? (
                    <UserMenu user={user} onLogout={handleLogout} isPasswordResetLocked={isPasswordResetLocked} />
                  ) : (
                    <NavItem to="/login" label="เข้าสู่ระบบ" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {isPasswordResetLocked ? (
          <div className="mb-6 rounded-[1.6rem] border border-[#e6d7c7] bg-[#fff8f1] px-5 py-4 text-sm leading-7 text-[#6f6257] shadow-[0_10px_24px_rgba(74,55,37,0.04)]">
            ระบบกำลังจำกัดการใช้งานไว้ที่หน้าเปลี่ยนรหัสผ่านใหม่เท่านั้น กรุณาตั้งรหัสผ่านใหม่ให้เรียบร้อยก่อน แล้วจึงกลับไปใช้งานส่วนอื่นของระบบ
          </div>
        ) : null}
        <Outlet />
      </main>
    </div>
  );
}
