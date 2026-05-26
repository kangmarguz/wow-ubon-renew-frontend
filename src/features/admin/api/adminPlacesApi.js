import { http } from "../../../shared/api/http";

export async function fetchAdminPlaces() {
  const response = await http.get("/admin/places");
  return response.data.data.places;
}

export async function fetchPendingPlaces() {
  const response = await http.get("/admin/places/pending");
  return response.data.data.places;
}

export async function approvePendingPlace(placeId) {
  const response = await http.patch(`/admin/places/${placeId}/approve`);
  return response.data.data.place;
}

export async function rejectPendingPlace(placeId, rejectionReason) {
  const response = await http.patch(`/admin/places/${placeId}/reject`, {
    rejectionReason
  });

  return response.data.data.place;
}

export async function deactivateAdminPlace(placeId) {
  const response = await http.patch(`/admin/places/${placeId}/deactivate`);
  return response.data.data.place;
}
