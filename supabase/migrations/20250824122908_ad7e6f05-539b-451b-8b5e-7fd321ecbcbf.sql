-- Disable email confirmation for signup
-- This allows users to sign up without needing to confirm their email
-- The user will be automatically signed in after account creation

-- Update auth settings to disable email confirmation
UPDATE auth.config 
SET enable_signup = true, 
    email_confirm_change = false;

-- Alternatively, if the above doesn't work, we can create a policy
-- that allows users to sign up without email confirmation by updating
-- the auth schema settings through SQL