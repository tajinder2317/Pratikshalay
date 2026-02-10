import { Platform } from "react-native";

const HOST = Platform.select({
  ios: "http://localhost:4000",
  android: "http://10.0.2.2:4000",
  default: "http://localhost:4000",
});

export const API_BASE_URL = HOST;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getDoctors: ({ q, specialty, sortBy }) => {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (specialty && specialty !== "All") params.append("specialty", specialty);
    if (sortBy) params.append("sortBy", sortBy);
    const queryString = params.toString();
    return request(`/api/doctors${queryString ? `?${queryString}` : ""}`);
  },
  createDoctor: (payload) =>
    request(`/api/doctors`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getDoctor: (id) => request(`/api/doctors/${id}`),
  getFavorites: (userId = "guest") =>
    request(`/api/favorites?userId=${encodeURIComponent(userId)}`),
  addFavorite: (doctorId, userId = "guest") =>
    request(`/api/favorites`, {
      method: "POST",
      body: JSON.stringify({ doctorId, userId }),
    }),
  removeFavorite: (doctorId, userId = "guest") =>
    request(`/api/favorites/${doctorId}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    }),
  createBooking: ({ doctorId, date, time, userId = "guest" }) =>
    request(`/api/bookings`, {
      method: "POST",
      body: JSON.stringify({ doctorId, date, time, userId }),
    }),
  getBookings: (userId = "guest") =>
    request(`/api/bookings?userId=${encodeURIComponent(userId)}`),
  signUp: ({ name, email, password, allowReplace = false }) =>
    request(`/api/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ name, email, password, allowReplace }),
    }),
  login: ({ email, password }) =>
    request(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};
