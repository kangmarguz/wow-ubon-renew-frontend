import { LoaderCircle } from "lucide-react";

export function LoadingSpinner({ size = 18, className = "", strokeWidth = 2.2 }) {
  return <LoaderCircle size={size} strokeWidth={strokeWidth} aria-hidden="true" className={`animate-spin ${className}`.trim()} />;
}
