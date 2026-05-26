import { http } from "../../../shared/api/http";

export async function uploadPlaceImages(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await http.post("/uploads/place-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data.data.images;
}

export async function createPlace(payload) {
  const response = await http.post("/places", payload);
  return response.data.data.place;
}

export async function updatePlace(placeId, payload) {
  const response = await http.patch(`/places/${placeId}`, payload);
  return response.data.data.place;
}
