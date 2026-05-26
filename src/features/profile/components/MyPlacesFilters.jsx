export function MyPlacesFilters({ statusFilter, sortBy, onStatusFilterChange, onSortByChange }) {
  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-[#eadfce] bg-white/70 p-4 md:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">กรองตามสถานะ</span>
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
        >
          <option value="ALL">ทุกสถานะ</option>
          <option value="APPROVED">เผยแพร่แล้ว</option>
          <option value="PENDING">รอตรวจสอบ</option>
          <option value="REJECTED">ต้องแก้ไข</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">เรียงลำดับ</span>
        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
          className="w-full rounded-[1.1rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3 text-sm text-[#43362c] outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
        >
          <option value="latest">อัปเดตล่าสุด</option>
          <option value="oldest">สร้างเก่าสุด</option>
          <option value="name">ชื่อ A-Z</option>
          <option value="rating">คะแนนสูงสุด</option>
        </select>
      </label>
    </div>
  );
}
