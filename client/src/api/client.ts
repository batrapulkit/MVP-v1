import axios from "axios";
import { createClient } from "@supabase/supabase-js";

/**
 * Determine correct API base URL dynamically.
 * This ensures that your frontend calls the correct backend
 * whether it's running locally or deployed on DigitalOcean.
 */
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (envUrl) {
    console.log("🌍 Using VITE_API_URL:", envUrl);
    return envUrl;
  }

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log("🧩 Using local backend: http://127.0.0.1:3001");
    return "http://127.0.0.1:3001";
  }

  console.log("🚀 Using current origin:", window.location.origin);
  return window.location.origin;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Axios client for backend REST API calls
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Supabase client initialization
 * Uses env vars if available, otherwise falls back to your working local config.
 */
const getSupabaseConfig = () => {
  const url =
    import.meta.env.VITE_SUPABASE_URL ||
    "https://ktojsokydntrdbbpttsa.supabase.co"; // fallback (safe public URL)
  const key =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b2pzb2t5ZG50cmRiYnB0dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDM0OTQsImV4cCI6MjA2ODc3OTQ5NH0.Z9CUyMuP36RcwP3sOLT2i0qV2mFBLhN9gQ2U7FyLGnE";

  if (!url || !key) console.error("❌ Missing Supabase configuration");
  else console.log("✅ Supabase configured for:", url);

  return { url, key };
};

const { url: supabaseUrl, key: supabaseKey } = getSupabaseConfig();

/**
 * Create and export Supabase client
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
