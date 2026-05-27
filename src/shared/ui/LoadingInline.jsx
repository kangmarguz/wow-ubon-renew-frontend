import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingInline({ label, size = 16, className = "", textClassName = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <LoadingSpinner size={size} />
      <span className={textClassName}>{label}</span>
    </span>
  );
}
