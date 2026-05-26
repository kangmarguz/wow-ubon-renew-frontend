import { AlertCircle, Info } from "lucide-react";

export function StateNotice({ tone = "neutral", children }) {
  const isError = tone === "error";
  const toneClassName = isError
    ? "border-[#f0c6c6] bg-[#fff5f5] text-[#9a4b4b]"
    : "border-dashed border-[#d7c5b4] bg-[#fffaf4] text-[#7c6f63]";
  const Icon = isError ? AlertCircle : Info;

  return (
    <div className={`rounded-[1.5rem] border px-6 py-10 text-sm ${toneClassName}`}>
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
        <div>{children}</div>
      </div>
    </div>
  );
}
