import { http } from "../../../shared/api/http";

export async function fetchPlaces(params) {
  const response = await http.get("/places", {
    params
  });

  return response.data.data;
}

export async function fetchPlaceDetail(slug) {
  const response = await http.get(`/places/${slug}`);
  return response.data.data.place;
}

export async function createPlaceReview(placeId, payload) {
  const response = await http.post(`/places/${placeId}/reviews`, payload);
  return response.data.data.review;
}

export async function updatePlaceReview(reviewId, payload) {
  const response = await http.patch(`/reviews/${reviewId}`, payload);
  return response.data.data.review;
}
