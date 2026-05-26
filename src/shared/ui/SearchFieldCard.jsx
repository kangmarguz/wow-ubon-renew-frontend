export function SearchFieldCard({ label, placeholder, value, onChange }) {
  return (
    <label className="block rounded-[1.5rem] border border-[#eadfce] bg-white/75 p-4">
      <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">{label}</span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition placeholder:text-[#a59384] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
      />
    </label>
  );
}
