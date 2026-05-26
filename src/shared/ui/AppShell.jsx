import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { adminLinks, publicLinks, userLinks } from "../constants/navigation";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

function NavItem({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `rounded-full px-4 py-2.5 text-sm font-medium transition ${
          isActive
            ? "bg-[#3f3328] text-white shadow-[0_10px_18px_rgba(63,51,40,0.14)]"
            : "text-[#6f6257] hover:bg-white/80 hover:text-[#33281f]"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-3 rounded-[1.6rem] border px-3.5 py-2.5 text-left transition ${
          isOpen
            ? "border-[#ccb59f] bg-white shadow-[0_14px_28px_rgba(74,55,37,0.12)]"
            : "border-white/50 bg-white/58 hover:border-[#ddcebf] hover:bg-white/76"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f5e9dc,#ead9c8)] text-sm font-semibold text-[#5a4737]">
          {user.name?.slice(0, 1)?.toUpperCase() || "U"}
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-[#3f3328]">{user.name}</div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#8c7a6a]">{user.role}</div>
        </div>
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+0.85rem)] z-50 w-64 overflow-hidden rounded-[1.5rem] border border-[#e2d5c7] bg-white shadow-[0_22px_48px_rgba(74,55,37,0.14)] transition-all duration-200 ease-out ${
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="border-b border-[#f1e5d7] px-4 py-4">
          <div className="text-sm font-semibold text-[#3f3328]">{user.name}</div>
          <div className="mt-1 text-xs text-[#8c7a6a]">{user.email}</div>
        </div>

        <div className="border-b border-[#f1e5d7] p-2">
          <div className="px-2 py-2 text-xs tracking-[0.22em] text-[#9a836d]">USER MENU</div>
          {userLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded-[1rem] px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-[#f5eadf] font-semibold text-[#3f3328]" : "text-[#6f6257] hover:bg-[#fbf5ee]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {user.role === "ADMIN" ? (
          <div className="border-b border-[#f1e5d7] p-2">
            <div className="px-2 py-2 text-xs tracking-[0.22em] text-[#9a836d]">ADMIN MENU</div>
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded-[1rem] px-3 py-2.5 text-sm transition ${
                    isActive ? "bg-[#f5eadf] font-semibold text-[#3f3328]" : "text-[#6f6257] hover:bg-[#fbf5ee]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        ) : null}

        <div className="p-2">
          <button
            type="button"
            onClick={onLogout}
            className="block w-full rounded-[1rem] px-3 py-2.5 text-left text-sm text-[#8f4e4e] transition hover:bg-[#fff3f3]"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f1e9_0%,#fbf8f3_26%,#f6efe6_100%)]">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-visible rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,253,249,0.88),rgba(250,244,236,0.78))] px-4 py-4 shadow-[0_16px_38px_rgba(74,55,37,0.08)] backdrop-blur md:px-6">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(219,188,157,0.18),transparent_22%),radial-gradient(circle_at_86%_12%,rgba(110,143,121,0.1),transparent_16%)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="min-w-0">
                <NavLink to="/" className="group inline-flex flex-col">
                  <div className="font-display text-[1.5rem] leading-none text-[#31261d] transition group-hover:text-[#46372a]">
                    ว้าวอุบล
                  </div>
                  <div className="mt-1 hidden text-[11px] tracking-[0.24em] text-[#8a7a6a] md:block">
                    แพลตฟอร์มรวมข้อมูลร้านอาหาร ที่พัก และที่เที่ยว
                  </div>
                </NavLink>
              </div>

              <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/52 p-1.5 shadow-[0_10px_24px_rgba(74,55,37,0.05)] md:flex">
                {publicLinks.map((link) => (
                  <NavItem key={link.to} {...link} />
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {user ? (
                  <UserMenu user={user} onLogout={clearAuth} />
                ) : (
                  <div className="flex items-center gap-2">
                    <NavItem to="/login" label="เข้าสู่ระบบ" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
