import { formatThaiDate } from "../../../shared/lib/formatDate";

export const MY_PLACES_PAGE_SIZE = 10;

export const myPlacesStatusConfig = {
  APPROVED: {
    label: "เผยแพร่แล้ว",
    badgeClassName: "border-[#cfe4d4] bg-[#edf7ef] text-[#2f6b41]",
    panelClassName: "border-[#dbe9df] bg-[linear-gradient(180deg,rgba(239,248,241,0.92),rgba(255,255,255,1))]",
    titleClassName: "text-[#2f6b41]",
    description: "สถานที่นี้ผ่านการอนุมัติแล้ว คุณสามารถเปิดหรือปิดการแสดงผลได้ และหากแก้ไขข้อมูล รายการจะกลับเข้าสู่คิวตรวจสอบอีกครั้ง"
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

export function filterAndSortMyPlaces(places, { searchTerm, statusFilter, visibilityFilter, sortBy }) {
  return places
    .filter((place) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ? true : place.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesStatus = statusFilter === "ALL" ? true : place.status === statusFilter;
      const matchesVisibility =
        visibilityFilter === "ALL"
          ? true
          : visibilityFilter === "VISIBLE"
            ? place.status === "APPROVED" && place.isActive
            : place.status === "APPROVED" && !place.isActive;

      return matchesSearch && matchesStatus && matchesVisibility;
    })
    .sort((left, right) => {
      if (sortBy === "oldest") {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      }

      if (sortBy === "name") {
        return left.name.localeCompare(right.name, "th");
      }

      if (sortBy === "updated") {
        return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
}

export function formatMyPlaceDate(value) {
  return formatThaiDate(value);
}

export function getMyPlacesEmptyMessage(places, filteredPlaces, hasActiveFilters = false) {
  if (places.length === 0) {
    return "คุณยังไม่มีสถานที่ที่ส่งเข้าระบบตอนนี้";
  }

  if (filteredPlaces.length === 0) {
    return hasActiveFilters ? "ไม่พบรายการที่ตรงกับตัวกรองหรือคำค้นหาที่เลือก" : "ยังไม่มีรายการในสถานะนี้";
  }

  return null;
}

export function getMyPlacesSummary(places) {
  return {
    total: places.length,
    pending: places.filter((place) => place.status === "PENDING").length,
    rejected: places.filter((place) => place.status === "REJECTED").length,
    visible: places.filter((place) => place.status === "APPROVED" && place.isActive).length,
    hidden: places.filter((place) => place.status === "APPROVED" && !place.isActive).length
  };
}
