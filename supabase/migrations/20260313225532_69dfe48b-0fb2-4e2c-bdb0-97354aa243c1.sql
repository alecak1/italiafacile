
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_linkedin text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_instagram text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_facebook text;
