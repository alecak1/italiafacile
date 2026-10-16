import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'backups/legacy-content/restore.sql';
const sql = readFileSync(file);
execFileSync('docker', [
  'exec', '-i', 'supabase_db_italiafacile',
  'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1',
], { input: sql, stdio: ['pipe', 'inherit', 'inherit'] });
console.log('Contenuti ripristinati nel database locale.');
