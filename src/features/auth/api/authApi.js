import { http } from "../../../shared/api/http";

export async function registerUser(payload) {
  const response = await http.post("/auth/register", payload);
  return response.data.data;
}

export async function loginUser(payload) {
  const response = await http.post("/auth/login", payload);
  return response.data.data;
}
