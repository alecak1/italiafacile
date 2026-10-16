import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const status = JSON.parse(execFileSync(executable, ['supabase', 'status', '-o', 'json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
const url = new URL(status.API_URL);
if (!['127.0.0.1', 'localhost'].includes(url.hostname) || !status.ANON_KEY) {
  throw new Error('Expected a running local Supabase instance.');
}
writeFileSync('.env.local', `VITE_SUPABASE_URL=${status.API_URL}\nVITE_SUPABASE_PUBLISHABLE_KEY=${status.ANON_KEY}\nVITE_GOOGLE_AUTH_ENABLED=false\n`, { mode: 0o600 });
console.log('Configurazione locale salvata in .env.local. Riavvia Vite se già aperto.');
