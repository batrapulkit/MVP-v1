// client/src/api/apiUrls.ts

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:3001"
    : window.location.origin); // triponic.com in production

export const BASE_URL = `${API_BASE_URL}/api`;

export const API_URLS = {
  LOGIN: `${BASE_URL}/users/login`,
  REGISTER: `${BASE_URL}/users/register`,
  CURRENT_USER: `${BASE_URL}/users/me`,
  LOGOUT: `${BASE_URL}/users/logout`,
  GOOGLE_LOGIN: `${BASE_URL}/users/auth/google`,
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
  SAVE_CHAT: `${BASE_URL}/chat/save`,
  GET_CHAT: (chatId: string) => `${BASE_URL}/chat/${chatId}`,
};

console.log("🌍 Using API Base URL:", API_BASE_URL);
