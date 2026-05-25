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
        `rounded-full px-4 py-2 text-sm transition ${
          isActive ? "bg-forest text-white" : "text-ink/70 hover:bg-white/60"
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
        className={`flex items-center gap-3 rounded-[1.4rem] border px-4 py-2.5 text-left transition ${
          isOpen
            ? "border-[#c8b29d] bg-white shadow-[0_10px_24px_rgba(74,55,37,0.08)]"
            : "border-transparent bg-white/40 hover:border-[#dfd1c1] hover:bg-white/70"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e7d9] text-sm font-semibold text-[#5a4737]">
          {user.name?.slice(0, 1)?.toUpperCase() || "U"}
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-[#3f3328]">{user.name}</div>
          <div className="text-xs uppercase tracking-[0.16em] text-[#8c7a6a]">{user.role}</div>
        </div>
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+0.75rem)] z-20 w-64 overflow-hidden rounded-[1.4rem] border border-[#e2d5c7] bg-white shadow-[0_18px_40px_rgba(74,55,37,0.12)] transition-all duration-200 ease-out ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
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
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <div className="font-display text-2xl font-semibold text-forest">ว้าวอุบล</div>
            <div className="text-xs tracking-[0.25em] text-ink/50">แพลตฟอร์มรวมร้านอาหาร ที่พัก และที่เที่ยว</div>
          </div>

          <nav className="hidden flex-wrap items-center gap-2 md:flex">
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
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
