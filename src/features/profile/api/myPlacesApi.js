import { http } from "../../../shared/api/http";

export async function fetchMyPlaces() {
  const response = await http.get("/my/places");
  return response.data.data.places;
}

export async function fetchMyPlaceDetail(placeId) {
  const response = await http.get(`/my/places/${placeId}`);
  return response.data.data.place;
}

export async function resubmitMyPlace(placeId) {
  const response = await http.post(`/places/${placeId}/submit-for-review`);
  return response.data.data.place;
}

export async function updateMyPlaceVisibility(placeId, isActive) {
  const response = await http.patch(`/my/places/${placeId}/visibility`, {
    isActive
  });
  return response.data.data.place;
}
