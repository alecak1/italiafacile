-- Only demonstration content for local development; not legal guidance.
INSERT INTO public.journey_step_templates
(corridor_id, step_order, title, explanation, why_it_matters, category)
SELECT c.id, s.step_order, s.title,
       'Contenuto dimostrativo locale: completa questa scheda dal pannello amministratore.',
       'Passaggio di esempio per provare il percorso.', s.category
FROM public.relocation_corridors c
CROSS JOIN (VALUES
  (1, 'Richiedi il codice fiscale', 'documenti'),
  (2, 'Registra la residenza', 'documenti'),
  (3, 'Informati sull’assistenza sanitaria', 'sanita'),
  (4, 'Apri un conto bancario', 'vita'),
  (5, 'Cerca una casa', 'casa')
) AS s(step_order, title, category)
WHERE c.slug = 'bg-it'
ON CONFLICT (corridor_id, step_order) DO NOTHING;

-- Recovered illustration is versioned with the frontend, independent of remote storage.
UPDATE public.journey_step_templates AS step
SET image_url = '/images/journey/codice-fiscale.png'
FROM public.relocation_corridors AS corridor
WHERE step.corridor_id = corridor.id
  AND corridor.slug = 'bg-it'
  AND step.step_order = 1
  AND step.image_url IS NULL;
