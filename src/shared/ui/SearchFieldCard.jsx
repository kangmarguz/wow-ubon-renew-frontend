import { Search } from "lucide-react";

export function SearchFieldCard({ label, placeholder, value, onChange }) {
  return (
    <label className="block rounded-[1.5rem] border border-[#eadfce] bg-white/75 p-4">
      <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">{label}</span>

      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a59384]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] py-3 pl-11 pr-4 text-sm text-[#43362c] outline-none transition placeholder:text-[#a59384] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
        />
      </div>
    </label>
  );
}
