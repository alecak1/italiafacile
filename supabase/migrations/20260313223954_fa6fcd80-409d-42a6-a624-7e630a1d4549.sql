
-- ============================================================
-- RELOCATION CORRIDORS (e.g. Bulgaria→Italy, Romania→Italy)
-- ============================================================
CREATE TABLE public.relocation_corridors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_country text NOT NULL,
  destination_country text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(origin_country, destination_country)
);

ALTER TABLE public.relocation_corridors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active corridors"
  ON public.relocation_corridors FOR SELECT
  TO public
  USING (is_active = true);

-- Seed initial corridor
INSERT INTO public.relocation_corridors (origin_country, destination_country, slug)
VALUES ('Bulgaria', 'Italia', 'bg-it');

-- ============================================================
-- JOURNEY STEP TEMPLATES (per corridor, admin-managed content)
-- ============================================================
CREATE TABLE public.journey_step_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id uuid NOT NULL REFERENCES public.relocation_corridors(id) ON DELETE CASCADE,
  step_order int NOT NULL,
  title text NOT NULL,
  explanation text NOT NULL DEFAULT '',
  why_it_matters text NOT NULL DEFAULT '',
  where_to_go text NOT NULL DEFAULT '',
  estimated_time text NOT NULL DEFAULT '',
  cost text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'documenti',
  documents jsonb NOT NULL DEFAULT '[]',
  checklist_items jsonb NOT NULL DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(corridor_id, step_order)
);

ALTER TABLE public.journey_step_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active step templates"
  ON public.journey_step_templates FOR SELECT
  TO public
  USING (is_active = true);

-- ============================================================
-- USER JOURNEY PROGRESS (tracks user's status per step)
-- ============================================================
CREATE TABLE public.user_step_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_template_id uuid NOT NULL REFERENCES public.journey_step_templates(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'current', 'completed')),
  checklist_state jsonb NOT NULL DEFAULT '[]',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, step_template_id)
);

ALTER TABLE public.user_step_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.user_step_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_step_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_step_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- GUIDES (content, per corridor)
-- ============================================================
CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id uuid REFERENCES public.relocation_corridors(id) ON DELETE SET NULL,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'documenti',
  reading_time text NOT NULL DEFAULT '5 min',
  summary text NOT NULL DEFAULT '',
  sections jsonb NOT NULL DEFAULT '[]',
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published guides"
  ON public.guides FOR SELECT
  TO public
  USING (is_published = true);

-- ============================================================
-- COMMUNITY QUESTIONS
-- ============================================================
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  corridor_id uuid REFERENCES public.relocation_corridors(id) ON DELETE SET NULL,
  text text NOT NULL,
  category text NOT NULL DEFAULT 'generale',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
  ON public.questions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert questions"
  ON public.questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions"
  ON public.questions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions"
  ON public.questions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- COMMUNITY ANSWERS
-- ============================================================
CREATE TABLE public.answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL,
  upvotes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view answers"
  ON public.answers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert answers"
  ON public.answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
  ON public.answers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers"
  ON public.answers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- ADD corridor_id to profiles for multi-tenant routing
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS corridor_id uuid REFERENCES public.relocation_corridors(id) ON DELETE SET NULL;

-- ============================================================
-- Enable realtime for community tables
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.answers;

-- ============================================================
-- Updated_at triggers for new tables
-- ============================================================
CREATE TRIGGER update_journey_step_templates_updated_at
  BEFORE UPDATE ON public.journey_step_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_step_progress_updated_at
  BEFORE UPDATE ON public.user_step_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_answers_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
