export const placeStatusLabelConfig = {
  APPROVED: "เผยแพร่แล้ว",
  PENDING: "รอตรวจสอบ",
  REJECTED: "ต้องแก้ไข"
};

export const placeStatusBadgeClassNameConfig = {
  APPROVED: "border-[#cfe4d4] bg-[#edf7ef] text-[#2f6b41]",
  PENDING: "border-[#eadbb8] bg-[#fff6df] text-[#8a6432]",
  REJECTED: "border-[#ebc8c8] bg-[#fff1f1] text-[#9a4b4b]"
};

export function getPlaceStatusLabel(status) {
  return placeStatusLabelConfig[status] || status;
}

export function getPlaceStatusBadgeClassName(status) {
  return placeStatusBadgeClassNameConfig[status] || placeStatusBadgeClassNameConfig.PENDING;
}
