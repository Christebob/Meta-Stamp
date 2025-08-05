-- Delete the problematic user
DELETE FROM auth.users WHERE email = 'demo@example.com';

-- Update existing content to use a different demo user ID
UPDATE public.content_registry SET user_id = '11111111-1111-1111-1111-111111111111';
UPDATE public.ai_usage_logs SET user_id = '11111111-1111-1111-1111-111111111111';

-- Create demo user with all required columns (excluding generated ones)
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
  confirmation_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  reauthentication_token,
  is_sso_user,
  is_anonymous
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
  '',
  '',
  '',
  '',
  '',
  '',
  0,
  '',
  false,
  false
);