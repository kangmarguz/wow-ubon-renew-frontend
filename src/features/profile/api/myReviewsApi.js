import { http } from "../../../shared/api/http";

export async function fetchMyReviews() {
  const response = await http.get("/my/reviews");
  return response.data.data.reviews;
}
