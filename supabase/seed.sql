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
