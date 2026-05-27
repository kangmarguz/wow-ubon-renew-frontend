import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { adminLinks, userLinks } from "../../constants/navigation";
import { MenuSection } from "./MenuSection";

export function UserMenu({ user, onLogout, isPasswordResetLocked = false }) {
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
        <ChevronDown
          size={16}
          className={`text-[#8c7a6a] transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
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

        {isPasswordResetLocked ? (
          <div className="border-b border-[#f1e5d7] px-4 py-4 text-sm leading-6 text-[#6f6257]">
            ตอนนี้ระบบเปิดให้ใช้งานเฉพาะการเปลี่ยนรหัสผ่านใหม่เท่านั้น
          </div>
        ) : (
          <>
            <MenuSection title="USER MENU" links={userLinks} />
            {user.role === "ADMIN" ? <MenuSection title="ADMIN MENU" links={adminLinks} /> : null}
          </>
        )}

        <div className="p-2">
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex w-full items-center gap-2 rounded-[1rem] px-3 py-2.5 text-left text-sm text-[#8f4e4e] transition hover:bg-[#fff3f3]"
          >
            <LogOut size={16} aria-hidden="true" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
