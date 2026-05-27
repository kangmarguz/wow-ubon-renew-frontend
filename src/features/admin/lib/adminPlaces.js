import { getPlaceStatusBadgeClassName, getPlaceStatusLabel } from "../../../shared/constants/placeStatus";

export const ADMIN_PLACES_PAGE_SIZE = 10;

export const adminPlaceTabs = [
  { key: "PENDING", label: "รอตรวจสอบ" },
  { key: "APPROVED", label: "เผยแพร่แล้ว" },
  { key: "INACTIVE", label: "ปิดการแสดงผลแล้ว" }
];

export const adminPlaceStatusBadgeConfig = {
  APPROVED: getPlaceStatusBadgeClassName("APPROVED"),
  PENDING: getPlaceStatusBadgeClassName("PENDING"),
  REJECTED: getPlaceStatusBadgeClassName("REJECTED")
};

export const adminPlaceStatusLabelConfig = {
  APPROVED: getPlaceStatusLabel("APPROVED"),
  PENDING: getPlaceStatusLabel("PENDING"),
  REJECTED: getPlaceStatusLabel("REJECTED")
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
