// src/api/services.ts

import axios from 'axios';
import { API_URLS } from './apiUrls';

// ==================== INTERFACES ====================

export interface RegisterUserPayload {
  user_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  password: string;
  age: number;
  status: string;
  role_type: 'user';
  is_active: boolean;
  auth_type?: string;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: any[];
}

export interface LoginResponse {
  auth_type: string;
  data: {
    token: string;
    user: any;
  };
}

export interface ProfilePayload {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  age?: number;
  status?: string;
  is_active?: boolean;
}

export interface ProfileResponse {
  status: number;
  message: string;
  data: {
    user: any;
  };
}

export interface CurrentUserResponse {
  status: number;
  message: string;
  data: {
    user: any;
  };
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  status: number;
  message: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  type: 'text' | 'tripPlan';
  detailedPlan?: any;
  id?: string;
  plan_id?: string;
}

export interface ChatHistory {
  id?: string;
  chat_id: string;
  user_id?: string;
  messages: ChatMessage[];
  created_at?: string;
  updated_at?: string;
}

// ==================== AUTH SERVICES ====================

export async function registerUser(payload: RegisterUserPayload): Promise<RegisterResponse> {
  const response = await axios.post(
    API_URLS.REGISTER,
    payload,
    {
      headers: {
        ReferrerPolicy: 'no-referrer',
      },
      withCredentials: true,
    }
  );
  return response.data;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post(
    API_URLS.LOGIN,
    { email, password },
    {
      headers: {
        ReferrerPolicy: 'no-referrer',
      },
      withCredentials: true,
    }
  );
  return response.data;
}

export async function googleLoginUser(email: string): Promise<LoginResponse> {
  const response = await axios.post(
    API_URLS.GOOGLE_LOGIN,
    { email },
    {
      headers: {
        ReferrerPolicy: 'no-referrer',
      },
      withCredentials: true,
    }
  );
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await axios.post(API_URLS.LOGOUT, {}, { withCredentials: true });
}

// ==================== USER SERVICES ====================

export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
  console.log('👤 Fetching current user from:', API_URLS.CURRENT_USER);
  const response = await axios.get(API_URLS.CURRENT_USER, {
    withCredentials: true,
  });
  console.log('✅ Current user fetched successfully');
  return response.data;
}

export async function saveProfile(payload: ProfilePayload): Promise<ProfileResponse> {
  const response = await axios.put(API_URLS.UPDATE_PROFILE, payload, {
    withCredentials: true,
  });
  return response.data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const response = await axios.post(API_URLS.CHANGE_PASSWORD, payload, {
    withCredentials: true,
  });
  return response.data;
}

// ==================== CHAT SERVICES ====================

export async function saveChat(chatId: string, messages: ChatMessage[]) {
  const response = await axios.post(
    API_URLS.SAVE_CHAT,
    { chatId, messages },
    { withCredentials: true }
  );
  return response.data;
}

export async function getChat(chatId: string) {
  const response = await axios.get(API_URLS.GET_CHAT(chatId), {
    withCredentials: true,
  });
  return response.data;
}
