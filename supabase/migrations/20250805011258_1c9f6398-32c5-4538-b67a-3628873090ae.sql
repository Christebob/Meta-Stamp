-- Delete the manually created user that's causing issues
DELETE FROM auth.users WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Update existing content to use a different demo user ID that we'll create properly
UPDATE public.content_registry SET user_id = '11111111-1111-1111-1111-111111111111';
UPDATE public.ai_usage_logs SET user_id = '11111111-1111-1111-1111-111111111111';

-- Create a proper demo user using Supabase's auth functions
SELECT auth.users() -- This will show us the current schema

-- Instead, let's use the signup function properly
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
  recovery_token,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  confirmed_at,
  email_change_sent_at,
  email_change,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at,
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
  null,
  '',
  '',
  null,
  now(),
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null,
  false
);