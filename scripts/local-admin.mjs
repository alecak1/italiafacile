import { execFileSync } from 'node:child_process';

const email = process.argv[2];
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error('Uso: npm run local:admin -- indirizzo-email-registrato');
}
const result = execFileSync('docker', [
  'exec', '-i', 'supabase_db_italiafacile',
  'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A',
  '-v', 'ON_ERROR_STOP=1', '-v', `email=${email}`,
], {
  encoding: 'utf8',
  input: `DO $$ BEGIN
  IF current_database() <> 'postgres' THEN RAISE EXCEPTION 'Unexpected database'; END IF;
END $$;
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = :'email'
ON CONFLICT (user_id, role) DO NOTHING;
SELECT 'ADMIN_EXISTS=' || count(*) FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id WHERE u.email = :'email' AND r.role = 'admin';
`,
});
if (!/^ADMIN_EXISTS=1$/m.test(result)) {
  throw new Error('Account non trovato: registrati prima nell’app locale.');
}
console.log('Ruolo amministratore assegnato al tuo account locale. Ricarica l’app.');
