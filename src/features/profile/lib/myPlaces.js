import { formatThaiDate } from "../../../shared/lib/formatDate";

export const MY_PLACES_PAGE_SIZE = 10;

export const myPlacesStatusConfig = {
  APPROVED: {
    label: "เผยแพร่แล้ว",
    badgeClassName: "border-[#cfe4d4] bg-[#edf7ef] text-[#2f6b41]",
    panelClassName: "border-[#dbe9df] bg-[linear-gradient(180deg,rgba(239,248,241,0.92),rgba(255,255,255,1))]",
    titleClassName: "text-[#2f6b41]",
    description: "สถานที่นี้ผ่านการอนุมัติแล้วและกำลังแสดงผลบนเว็บไซต์"
  },
  PENDING: {
    label: "รอตรวจสอบ",
    badgeClassName: "border-[#eadbb8] bg-[#fff6df] text-[#8a6432]",
    panelClassName: "border-[#eee1c3] bg-[linear-gradient(180deg,rgba(255,247,227,0.95),rgba(255,255,255,1))]",
    titleClassName: "text-[#8a6432]",
    description: "สถานที่นี้ถูกส่งเข้าระบบแล้วและกำลังรอแอดมินตรวจสอบ"
  },
  REJECTED: {
    label: "ต้องแก้ไข",
    badgeClassName: "border-[#ebc8c8] bg-[#fff1f1] text-[#9a4b4b]",
    panelClassName: "border-[#f0d4d4] bg-[linear-gradient(180deg,rgba(255,241,241,0.96),rgba(255,255,255,1))]",
    titleClassName: "text-[#9a4b4b]",
    description: "สถานที่นี้ยังไม่ผ่านการอนุมัติ กรุณาตรวจสอบเหตุผลและส่งกลับเข้าตรวจสอบอีกครั้ง"
  }
};

export function filterAndSortMyPlaces(places, statusFilter, sortBy) {
  return places
    .filter((place) => (statusFilter === "ALL" ? true : place.status === statusFilter))
    .sort((left, right) => {
      if (sortBy === "oldest") {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      }

      if (sortBy === "name") {
        return left.name.localeCompare(right.name, "th");
      }

      if (sortBy === "rating") {
        return Number(right.averageRating || 0) - Number(left.averageRating || 0);
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });
}

export function formatMyPlaceDate(value) {
  return formatThaiDate(value);
}

export function getMyPlacesEmptyMessage(places, filteredPlaces) {
  if (places.length === 0) {
    return "คุณยังไม่มีสถานที่ที่ส่งเข้าระบบตอนนี้";
  }

  if (filteredPlaces.length === 0) {
    return "ไม่พบรายการที่ตรงกับตัวกรองที่เลือก";
  }

  return null;
}
