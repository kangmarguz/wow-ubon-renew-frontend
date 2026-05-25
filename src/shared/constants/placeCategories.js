export const placeCategories = [
  { value: "", label: "ทุกประเภท" },
  { value: "RESTAURANT", label: "ร้านอาหาร" },
  { value: "ACCOMMODATION", label: "ที่พัก" },
  { value: "ATTRACTION", label: "สถานที่ท่องเที่ยว" }
];

export function getPlaceCategoryLabel(category) {
  const foundCategory = placeCategories.find((item) => item.value === category);
  return foundCategory?.label || category;
}
