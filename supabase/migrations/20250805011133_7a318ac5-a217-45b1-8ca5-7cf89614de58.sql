-- Fix the demo user record by setting NULL values properly
UPDATE auth.users 
SET 
  confirmation_token = NULL,
  email_change_token_new = NULL,
  recovery_token = NULL,
  email_change = NULL,
  email_change_sent_at = NULL,
  email_change_confirm_status = 0,
  phone_change = NULL,
  phone_change_token = NULL,
  phone_change_sent_at = NULL
WHERE id = '550e8400-e29b-41d4-a716-446655440000';