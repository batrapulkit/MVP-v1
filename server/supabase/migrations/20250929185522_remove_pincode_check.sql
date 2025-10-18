ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_pincode_check;

ALTER TABLE public.users
    ALTER COLUMN pincode TYPE text;
