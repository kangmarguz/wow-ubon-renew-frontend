import { getPlaceStatusBadgeClassName, getPlaceStatusLabel } from "../constants/placeStatus";

export function PlaceStatusBadge({ status, className = "" }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${getPlaceStatusBadgeClassName(status)} ${className}`.trim()}
    >
      {getPlaceStatusLabel(status)}
    </span>
  );
}
