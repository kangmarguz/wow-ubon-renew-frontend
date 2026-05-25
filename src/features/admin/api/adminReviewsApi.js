import { http } from "../../../shared/api/http";

export async function fetchAdminReviews() {
  const response = await http.get("/admin/reviews");
  return response.data.data.reviews;
}

export async function hideAdminReview(reviewId) {
  const response = await http.patch(`/admin/reviews/${reviewId}/hide`);
  return response.data.data.review;
}

export async function deleteAdminReview(reviewId) {
  const response = await http.delete(`/admin/reviews/${reviewId}`);
  return response.data.data.review;
}
