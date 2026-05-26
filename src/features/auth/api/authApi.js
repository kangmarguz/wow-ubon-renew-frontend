import { http } from "../../../shared/api/http";

export async function registerUser(payload) {
  const response = await http.post("/auth/register", payload);
  return response.data.data;
}

export async function loginUser(payload) {
  const response = await http.post("/auth/login", payload);
  return response.data.data;
}

export async function updateProfile(payload) {
  const response = await http.patch("/auth/profile", payload);
  return response.data.data.user;
}

export async function updatePassword(payload) {
  const response = await http.patch("/auth/password", payload);
  return response.data;
}
