
-- 1. Create app_role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Add image_url to journey_step_templates
ALTER TABLE public.journey_step_templates ADD COLUMN image_url TEXT DEFAULT NULL;

-- 5. Create storage bucket for step images
INSERT INTO storage.buckets (id, name, public) VALUES ('step-images', 'step-images', true);

-- 6. Storage RLS: anyone can view, admins can upload
CREATE POLICY "Anyone can view step images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'step-images');

CREATE POLICY "Admins can upload step images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'step-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update step images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'step-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete step images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'step-images' AND public.has_role(auth.uid(), 'admin'));

-- 7. Admin policies for journey_step_templates (insert, update, delete)
CREATE POLICY "Admins can insert step templates"
  ON public.journey_step_templates FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update step templates"
  ON public.journey_step_templates FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete step templates"
  ON public.journey_step_templates FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. Admin policies for guides
CREATE POLICY "Admins can insert guides"
  ON public.guides FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update guides"
  ON public.guides FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete guides"
  ON public.guides FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. Admin policies for relocation_corridors
CREATE POLICY "Admins can insert corridors"
  ON public.relocation_corridors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update corridors"
  ON public.relocation_corridors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete corridors"
  ON public.relocation_corridors FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 10. Admin can delete questions/answers for moderation
CREATE POLICY "Admins can delete any question"
  ON public.questions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any answer"
  ON public.answers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 11. Admin can view all profiles for management
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
