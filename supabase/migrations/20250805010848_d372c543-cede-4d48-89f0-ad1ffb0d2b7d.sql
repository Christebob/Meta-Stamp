-- Create demo user account
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
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440000',
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
  ''
);

-- Enable RLS on all tables
ALTER TABLE public.content_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content_registry
CREATE POLICY "Users can view their own content" 
ON public.content_registry 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own content" 
ON public.content_registry 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own content" 
ON public.content_registry 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own content" 
ON public.content_registry 
FOR DELETE 
USING (user_id = auth.uid());

-- Create RLS policies for ai_usage_logs
CREATE POLICY "Users can view their own usage logs" 
ON public.ai_usage_logs 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own usage logs" 
ON public.ai_usage_logs 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own usage logs" 
ON public.ai_usage_logs 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own usage logs" 
ON public.ai_usage_logs 
FOR DELETE 
USING (user_id = auth.uid());