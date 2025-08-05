-- Delete the manually created user that's causing issues
DELETE FROM auth.users WHERE email = 'demo@example.com';

-- Update existing content to use a different demo user ID that we'll create properly
UPDATE public.content_registry SET user_id = '11111111-1111-1111-1111-111111111111';
UPDATE public.ai_usage_logs SET user_id = '11111111-1111-1111-1111-111111111111';

-- Create a proper demo user with all required columns set correctly
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmed_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'demo@example.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "demo@example.com"}',
  false,
  now()
);