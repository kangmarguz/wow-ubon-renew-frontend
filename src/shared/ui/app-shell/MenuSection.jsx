import { NavLink } from "react-router-dom";

function getMenuItemClassName(isActive) {
  return `block rounded-[1rem] px-3 py-2.5 text-sm transition ${
    isActive ? "bg-[#f5eadf] font-semibold text-[#3f3328]" : "text-[#6f6257] hover:bg-[#fbf5ee]"
  }`;
}

export function MenuSection({ title, links, onLinkClick }) {
  return (
    <div className="border-b border-[#f1e5d7] p-2">
      <div className="px-2 py-2 text-xs tracking-[0.22em] text-[#9a836d]">{title}</div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onLinkClick}
          className={({ isActive }) => getMenuItemClassName(isActive)}
        >
          <div className="flex items-center justify-between gap-3">
            <span>{link.label}</span>
            {typeof link.badgeCount === "number" && link.badgeCount > 0 ? (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#8f4e4e] px-2 py-0.5 text-[11px] font-semibold text-white">
                {link.badgeCount > 99 ? "99+" : link.badgeCount}
              </span>
            ) : null}
          </div>
        </NavLink>
      ))}
    </div>
  );
}
