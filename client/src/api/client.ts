// src/api/client.ts

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = 'https://ktojsokydntrdbbpttsa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b2pzb2t5ZG50cmRiYnB0dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDM0OTQsImV4cCI6MjA2ODc3OTQ5NH0.Z9CUyMuP36RcwP3sOLT2i0qV2mFBLhN9gQ2U7FyLGnE';

// Singleton pattern to prevent multiple Supabase instances
let supabaseInstance: SupabaseClient | null = null;

export const supabase = supabaseInstance ?? createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }
});

supabaseInstance = supabase;

console.log('✅ Supabase configured for:', supabaseUrl);

// Add Supabase auth token to all axios requests
axios.interceptors.request.use(
  async (config) => {
    try {
      // Get current Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        // Add Supabase token to Authorization header
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('🔑 Added Supabase token to request:', config.url);
      } else {
        console.log('⚠️ No Supabase session found for request:', config.url);
      }
    } catch (error) {
      console.error('❌ Error getting Supabase session:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses by signing out
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('❌ 401 Unauthorized - Signing out');
      await supabase.auth.signOut();
    }
    return Promise.reject(error);
  }
);
