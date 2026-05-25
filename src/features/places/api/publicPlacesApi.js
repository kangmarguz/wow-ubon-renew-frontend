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
