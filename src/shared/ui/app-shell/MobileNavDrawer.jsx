import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogIn, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { fetchAdminDashboard } from "../../../features/admin/api/adminDashboardApi";
import { adminLinks, publicLinks, userLinks } from "../../constants/navigation";
import { MenuSection } from "./MenuSection";

function DrawerNavLink({ to, label, end = false, onClick, icon: Icon = LogIn }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-[1.1rem] border px-4 py-3 text-sm transition ${
          isActive
            ? "border-[#d9c3ae] bg-[#f7ecdf] font-semibold text-[#3f3328]"
            : "border-[#efe4d7] bg-white/88 text-[#6f6257] hover:border-[#e0cfbf] hover:bg-[#fcf6ef]"
        }`
      }
    >
      <span>{label}</span>
      <Icon size={16} className="text-[#a17d5e]" aria-hidden="true" />
    </NavLink>
  );
}

export function MobileNavDrawer({ user, onLogout, isPasswordResetLocked = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role === "ADMIN";

  const { data: adminDashboardSummary } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
    enabled: isAdmin && !isPasswordResetLocked
  });

  const adminLinksWithBadges = adminLinks.map((link) =>
    link.to === "/admin/password-resets"
      ? {
          ...link,
          badgeCount: adminDashboardSummary?.pendingPasswordResetRequests || 0
        }
      : link
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const drawerOverlay = (
    <div
      className={`fixed inset-0 z-[120] transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className={`absolute inset-0 bg-[#2f2218]/42 backdrop-blur-[2px] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="ปิดเมนูนำทาง"
      />

      <aside
        id="mobile-nav-drawer"
        className={`absolute right-0 top-0 flex h-full w-[84vw] max-w-[22rem] flex-col overflow-hidden rounded-l-[2rem] border-l border-white/60 bg-[linear-gradient(180deg,#fffaf4_0%,#fbf4eb_55%,#f6eee3_100%)] shadow-[-24px_0_48px_rgba(47,34,24,0.18)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative overflow-hidden border-b border-[#ecdfd1] px-5 pb-5 pt-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(221,191,158,0.28),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(121,150,124,0.14),transparent_20%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-[1.4rem] text-[#31261d]">ว้าวอุบล</div>
              <div className="mt-1 text-[11px] tracking-[0.22em] text-[#917c69]">MOBILE NAVIGATION</div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/70 bg-white/80 text-[#5d4a3a] shadow-[0_10px_24px_rgba(74,55,37,0.08)] transition hover:bg-white"
              aria-label="ปิดเมนู"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {user ? (
            <div className="relative mt-5 rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,242,233,0.92))] p-4 shadow-[0_16px_30px_rgba(74,55,37,0.08)]">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f3e6d9,#e8d4c3)] text-sm font-semibold text-[#5a4737]">
                  {user.name?.slice(0, 1)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[#3f3328]">{user.name}</div>
                  <div className="mt-1 truncate text-xs text-[#8c7a6a]">{user.email}</div>
                  <div className="mt-2 inline-flex rounded-full bg-[#f7ede2] px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#8b6a4f]">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative mt-5 rounded-[1.6rem] border border-[#e8d9c9] bg-[#fff8f1] p-4 shadow-[0_12px_24px_rgba(74,55,37,0.05)]">
              <div className="text-sm font-semibold text-[#3f3328]">เข้าสู่ระบบเพื่อจัดการสถานที่และรีวิวของคุณ</div>
              <div className="mt-2 text-sm leading-6 text-[#6f6257]">
                ล็อกอินแล้วจะเข้าถึงการเพิ่มสถานที่ เมนูบัญชี และเครื่องมือแอดมินได้จากเมนูนี้ทันที
              </div>
              <div className="mt-4">
                <DrawerNavLink to="/login" label="เข้าสู่ระบบ" onClick={() => setIsOpen(false)} />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {isPasswordResetLocked ? (
            <div className="rounded-[1.6rem] border border-[#e7d8c8] bg-[#fff8f1] p-4 text-sm leading-7 text-[#6f6257] shadow-[0_10px_22px_rgba(74,55,37,0.05)]">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f3e4d6] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#8b6a4f]">
                <ShieldCheck size={14} aria-hidden="true" />
                PASSWORD RESET REQUIRED
              </div>
              <p className="mt-3">กรุณาเปลี่ยนรหัสผ่านใหม่ให้เรียบร้อยก่อน ระบบจึงจะเปิดให้ใช้งานเมนูส่วนอื่นของบัญชีได้อีกครั้ง</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.7rem] border border-[#eadfd2] bg-white/70 shadow-[0_16px_30px_rgba(74,55,37,0.06)]">
              <MenuSection title="เมนูทั่วไป" links={publicLinks} onLinkClick={() => setIsOpen(false)} />
              {user ? <MenuSection title="เมนูผู้ใช้" links={userLinks} onLinkClick={() => setIsOpen(false)} /> : null}
              {isAdmin ? (
                <MenuSection title="เมนูแอดมิน" links={adminLinksWithBadges} onLinkClick={() => setIsOpen(false)} />
              ) : null}
            </div>
          )}
        </div>

        {user ? (
          <div className="border-t border-[#ecdfd1] p-3">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="inline-flex w-full items-center justify-between rounded-[1.2rem] border border-[#f0d7d7] bg-[#fff5f5] px-4 py-3 text-left text-sm font-medium text-[#8f4e4e] transition hover:bg-[#ffefef]"
            >
              <span>ออกจากระบบ</span>
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-[1.3rem] border border-white/60 bg-white/70 text-[#4c3b2d] shadow-[0_12px_24px_rgba(74,55,37,0.08)] transition hover:border-[#ddcebf] hover:bg-white"
        aria-label="เปิดเมนูนำทาง"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {isMounted ? createPortal(drawerOverlay, document.body) : null}
    </div>
  );
}
