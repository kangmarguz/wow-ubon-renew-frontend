import { http } from "../../../shared/api/http";

export async function fetchAdminDashboard() {
  const response = await http.get("/admin/dashboard");
  return response.data.data.summary;
}
