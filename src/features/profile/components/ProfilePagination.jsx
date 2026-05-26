export function ProfilePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[#eadfce] bg-white/75 px-4 py-3">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full border border-[#d7c5b4] px-4 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="หน้าก่อนหน้า"
      >
        ←
      </button>

      <div className="text-sm text-[#6f6257]">
        หน้า <span className="font-semibold text-[#3f3328]">{currentPage}</span> จาก{" "}
        <span className="font-semibold text-[#3f3328]">{totalPages}</span>
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full border border-[#d7c5b4] px-4 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="หน้าถัดไป"
      >
        →
      </button>
    </div>
  );
}
