const DEFAULT_API_BASE_URL = "https://pratikshalay-backend.onrender.com";

const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
export const API_BASE_URL = (envUrl || DEFAULT_API_BASE_URL).replace(/\/$/, "");

const REQUEST_TIMEOUT_MS = 20000;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });

    if (response.status === 204) return null;

    let parsedBody = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      parsedBody = await response.json();
    } else {
      const text = await response.text();
      parsedBody = text || null;
    }

    if (!response.ok) {
      const message =
        (typeof parsedBody === "object" && parsedBody?.message) ||
        (typeof parsedBody === "string" && parsedBody) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return parsedBody;
  } catch (error) {
    const isAbort = error?.name === "AbortError";
    const isNetworkError =
      !isAbort &&
      (error?.message?.includes("Network request failed") ||
        error?.message?.includes("Failed to fetch"));

    if (isAbort) {
      throw new Error("Server timeout. Please try again.");
    }

    if (isNetworkError) {
      throw new Error(
        `Cannot reach server at ${API_BASE_URL}. Check internet or API URL.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  healthCheck: () => request(`/`),
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
