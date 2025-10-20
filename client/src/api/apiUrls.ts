// client/src/api/apiUrls.ts

// Dynamically determine the backend API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:3001"
    : window.location.origin);

// Full base URL for all API routes
export const BASE_URL = `${API_BASE_URL}/api`;

// Define all endpoint URLs here
export const API_URLS = {
  // === AUTH ENDPOINTS ===
  LOGIN: `${BASE_URL}/users/login`,
  REGISTER: `${BASE_URL}/users/register`,
  CURRENT_USER: `${BASE_URL}/users/me`,
  LOGOUT: `${BASE_URL}/users/logout`,
  GOOGLE_LOGIN: `${BASE_URL}/users/auth/google`,

  // === PROFILE ENDPOINTS ===
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,

  // === CHAT ENDPOINTS ===
  SAVE_CHAT: `${BASE_URL}/chat/save`, // POST
  GET_CHAT: (chatId: string) => `${BASE_URL}/chat/${chatId}`, // GET
};

// Log the base URL used for verification in console
console.log("🌍 Using API Base URL:", API_BASE_URL);
