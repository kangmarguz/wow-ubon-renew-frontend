export function StateNotice({ tone = "neutral", children }) {
  const toneClassName =
    tone === "error"
      ? "border-[#f0c6c6] bg-[#fff5f5] text-[#9a4b4b]"
      : "border-dashed border-[#d7c5b4] bg-[#fffaf4] text-[#7c6f63]";

  return <div className={`rounded-[1.5rem] border px-6 py-10 text-sm ${toneClassName}`}>{children}</div>;
}
