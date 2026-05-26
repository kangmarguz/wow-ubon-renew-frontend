export const ADMIN_PLACES_PAGE_SIZE = 10;

export const adminPlaceTabs = [
  { key: "PENDING", label: "รอตรวจสอบ" },
  { key: "APPROVED", label: "เผยแพร่แล้ว" },
  { key: "INACTIVE", label: "ปิดการแสดงผลแล้ว" }
];

export const adminPlaceStatusBadgeConfig = {
  APPROVED: "border-[#cfe4d4] bg-[#edf7ef] text-[#2f6b41]",
  PENDING: "border-[#eadbb8] bg-[#fff6df] text-[#8a6432]",
  REJECTED: "border-[#ebc8c8] bg-[#fff1f1] text-[#9a4b4b]"
};

export const adminPlaceStatusLabelConfig = {
  APPROVED: "เผยแพร่แล้ว",
  PENDING: "รอตรวจสอบ",
  REJECTED: "ต้องแก้ไข"
};

export function getFilteredAdminPlacesByTab(places, activeTab) {
  if (activeTab === "PENDING") {
    return places.filter((place) => place.isActive !== false && place.status === "PENDING");
  }

  if (activeTab === "APPROVED") {
    return places.filter((place) => place.isActive !== false && place.status === "APPROVED");
  }

  return places.filter((place) => place.isActive === false);
}

export function getAdminPlaceTabCounts(places) {
  return {
    PENDING: places.filter((place) => place.isActive !== false && place.status === "PENDING").length,
    APPROVED: places.filter((place) => place.isActive !== false && place.status === "APPROVED").length,
    INACTIVE: places.filter((place) => place.isActive === false).length
  };
}

export function searchAdminPlaces(places, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return places;
  }

  return places.filter((place) => place.name.toLowerCase().includes(normalizedSearch));
}

export function getAdminPlacesEmptyMessage(visiblePlaces, filteredPlaces) {
  if (visiblePlaces.length === 0) {
    return "ไม่มีรายการในแท็บนี้ตอนนี้";
  }

  if (filteredPlaces.length === 0) {
    return "ไม่พบสถานที่ที่ตรงกับชื่อที่ค้นหา";
  }

  return null;
}
