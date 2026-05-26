export function ReviewStars({ value, onChange, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isActive = value >= starValue;

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange?.(starValue)}
            disabled={disabled}
            aria-label={`ให้ ${starValue} ดาว`}
            className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl transition ${
              isActive
                ? "border-[#8b6a4f] bg-[#8b6a4f] text-white shadow-[0_12px_24px_rgba(74,55,37,0.15)]"
                : "border-[#d8c8b9] bg-white text-[#b89a7c] hover:border-[#b08c6f] hover:text-[#8b6a4f]"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
