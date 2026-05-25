import { NavLink, Outlet } from "react-router-dom";
import { adminLinks, publicLinks, userLinks } from "../constants/navigation";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
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
            {user &&
              userLinks.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            {user?.role === "ADMIN" &&
              adminLinks.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="text-right">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs uppercase text-ink/50">{user.role}</div>
                </div>
                <button
                  type="button"
                  onClick={clearAuth}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:bg-white/70"
                >
                  ออกจากระบบ
                </button>
              </>
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
