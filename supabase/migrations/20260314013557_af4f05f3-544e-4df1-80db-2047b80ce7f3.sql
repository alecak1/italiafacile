
-- Community Tips table
CREATE TABLE public.community_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  step_template_id UUID REFERENCES public.journey_step_templates(id) ON DELETE CASCADE,
  corridor_id UUID REFERENCES public.relocation_corridors(id) ON DELETE CASCADE,
  city TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending',
  is_highlighted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community Experiences table
CREATE TABLE public.community_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  step_template_id UUID REFERENCES public.journey_step_templates(id) ON DELETE CASCADE,
  corridor_id UUID REFERENCES public.relocation_corridors(id) ON DELETE CASCADE,
  city TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  time_required TEXT NOT NULL DEFAULT '',
  problems TEXT NOT NULL DEFAULT '',
  advice TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tip votes table
CREATE TABLE public.tip_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tip_id UUID NOT NULL REFERENCES public.community_tips(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tip_id)
);

-- Experience votes table
CREATE TABLE public.experience_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  experience_id UUID NOT NULL REFERENCES public.community_experiences(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, experience_id)
);

-- Enable RLS
ALTER TABLE public.community_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tip_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_votes ENABLE ROW LEVEL SECURITY;

-- Tips RLS policies
CREATE POLICY "Anyone can view approved tips" ON public.community_tips FOR SELECT TO public USING (status = 'approved');
CREATE POLICY "Users can view their own tips" ON public.community_tips FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all tips" ON public.community_tips FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can insert tips" ON public.community_tips FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending tips" ON public.community_tips FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins can update any tip" ON public.community_tips FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete any tip" ON public.community_tips FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Experiences RLS policies
CREATE POLICY "Anyone can view approved experiences" ON public.community_experiences FOR SELECT TO public USING (status = 'approved');
CREATE POLICY "Users can view their own experiences" ON public.community_experiences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all experiences" ON public.community_experiences FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can insert experiences" ON public.community_experiences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending experiences" ON public.community_experiences FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins can update any experience" ON public.community_experiences FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete any experience" ON public.community_experiences FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Votes RLS policies
CREATE POLICY "Anyone can view tip votes" ON public.tip_votes FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can insert tip votes" ON public.tip_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tip votes" ON public.tip_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view experience votes" ON public.experience_votes FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can insert experience votes" ON public.experience_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own experience votes" ON public.experience_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Updated at triggers
CREATE TRIGGER update_community_tips_updated_at BEFORE UPDATE ON public.community_tips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_experiences_updated_at BEFORE UPDATE ON public.community_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
