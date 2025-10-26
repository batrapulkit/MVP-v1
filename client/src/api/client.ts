// src/supabase/client.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktojsokydntrdbbpttsa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b2pzb2t5ZG50cmRiYnB0dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDM0OTQsImV4cCI6MjA2ODc3OTQ5NH0.Z9CUyMuP36RcwP3sOLT2i0qV2mFBLhN9gQ2U7FyLGnE'; // Public anon key from Supabase settings

export const supabase = createClient(supabaseUrl, supabaseKey);
