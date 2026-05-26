import { NavLink } from "react-router-dom";

function getNavItemClassName(isActive) {
  return `rounded-full px-4 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-[#3f3328] text-white shadow-[0_10px_18px_rgba(63,51,40,0.14)]"
      : "text-[#6f6257] hover:bg-white/80 hover:text-[#33281f]"
  }`;
}

export function NavItem({ to, label, end = false }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => getNavItemClassName(isActive)}>
      {label}
    </NavLink>
  );
}
