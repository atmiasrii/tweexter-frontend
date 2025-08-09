-- Add follower_count column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN follower_count integer DEFAULT 0 NOT NULL;

-- Update the handle_new_user function to include follower_count
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, follower_count)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'follower_count')::integer, 0)
  );
  RETURN NEW;
END;
$function$