export function PlaceActionButton({
  as: Component = "button",
  tone = "neutral",
  isPrimary = false,
  fullWidth = true,
  className = "",
  ...props
}) {
  const widthClassName = fullWidth ? "w-full" : "";

  if (isPrimary) {
    return (
      <Component
        className={`inline-flex min-h-11 ${widthClassName} items-center justify-center gap-2 rounded-full bg-[#8f4e4e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a4040] ${className}`.trim()}
        {...props}
      />
    );
  }

  const toneClassName =
    tone === "success"
      ? "border-[#b8d4c1] bg-[#edf7ef] text-[#2f6b41] hover:border-[#8fbea0] hover:text-[#255635]"
      : tone === "warning"
        ? "border-[#eadbb8] bg-[#fff8e8] text-[#8a6432] hover:border-[#d8bf8f] hover:text-[#6c4f28]"
        : tone === "danger"
          ? "border-[#d8b7b7] bg-white/90 text-[#8f4e4e] hover:bg-[#fff7f7]"
          : "border-[#c9b7a5] bg-white/90 text-[#5b4737] hover:border-[#9a816c] hover:text-[#3f3328]";

  return (
    <Component
      className={`inline-flex min-h-11 ${widthClassName} items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${toneClassName} ${className}`.trim()}
      {...props}
    />
  );
}
