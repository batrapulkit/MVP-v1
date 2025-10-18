ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS auth_type VARCHAR(20) NOT NULL DEFAULT 'email'
CHECK (auth_type IN ('email', 'google_auth'));
