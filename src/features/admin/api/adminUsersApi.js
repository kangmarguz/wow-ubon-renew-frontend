import { http } from "../../../shared/api/http";

export async function fetchAdminUsers() {
  const response = await http.get("/admin/users");
  return response.data.data.users;
}

export async function updateAdminUserRole(userId, role) {
  const response = await http.patch(`/admin/users/${userId}/role`, { role });
  return response.data.data.user;
}
