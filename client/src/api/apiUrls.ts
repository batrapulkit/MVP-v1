export const BASE_URL = 'http://127.0.0.1:3001/api';

export const API_URLS = {
  LOGIN: `${BASE_URL}/users/login`,
  REGISTER: `${BASE_URL}/users/register`,
  CURRENT_USER: `${BASE_URL}/users/me`,
  LOGOUT: `${BASE_URL}/users/logout`,
  GOOGLE_LOGIN: `${BASE_URL}/users/auth/google`,
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,

  // Chat endpoints
  SAVE_CHAT: `${BASE_URL}/chat/save`,       // POST
  GET_CHAT: (chatId: string) => `${BASE_URL}/chat/${chatId}`, // GET
};
