import { http } from "../../../shared/api/http";

export async function fetchAdminPasswordResetRequests() {
  const response = await http.get("/admin/password-reset-requests");
  return response.data.data.requests;
}

export async function approveAdminPasswordResetRequest(requestId) {
  const response = await http.patch(`/admin/password-reset-requests/${requestId}/approve`);
  return response.data.data.request;
}

export async function rejectAdminPasswordResetRequest(requestId, rejectReason) {
  const response = await http.patch(`/admin/password-reset-requests/${requestId}/reject`, {
    rejectReason
  });
  return response.data.data.request;
}
