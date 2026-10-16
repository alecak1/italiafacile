import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const status = JSON.parse(execFileSync('npx', ['supabase', 'status', '-o', 'json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
assert(['localhost', '127.0.0.1'].includes(new URL(status.API_URL).hostname), 'Local backend required');
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(status.API_URL, status.SERVICE_ROLE_KEY, options);
const first = createClient(status.API_URL, status.ANON_KEY, options);
const second = createClient(status.API_URL, status.ANON_KEY, options);
const users = [];
let imagePath;
const check = ({ data, error }) => { assert.ifError(error); return data; };
try {
  for (const client of [first, second]) {
    const data = check(await client.auth.signUp({ email: `smoke-${randomUUID()}@example.test`, password: randomUUID(), options: { data: { full_name: 'Local smoke test' } } }));
    assert(data.session, 'Signup must return a local session');
    users.push(data.user.id);
  }
  const profile = check(await first.from('profiles').select('*').eq('user_id', users[0]).single());
  assert.equal(profile.name, 'Local smoke test');
  assert.equal(check(await second.from('profiles').select('*').eq('user_id', users[0])).length, 0, 'RLS must hide other profiles');
  const steps = check(await first.from('journey_step_templates').select('id').order('step_order'));
  assert(steps.length >= 5, 'Local demo steps missing');
  check(await first.from('user_step_progress').insert({ user_id: users[0], step_template_id: steps[0].id, status: 'current' }));
  check(await first.from('user_step_progress').update({ status: 'completed' }).eq('user_id', users[0]));
  assert.equal(check(await first.from('user_step_progress').select('status').eq('user_id', users[0]).single()).status, 'completed');
  assert.equal(check(await second.from('user_step_progress').select('*').eq('user_id', users[0])).length, 0);
  imagePath = `${users[0]}/smoke.svg`;
  check(await first.storage.from('avatars').upload(imagePath, '<svg xmlns="http://www.w3.org/2000/svg"/>', { contentType: 'image/svg+xml' }));
  check(await first.storage.from('avatars').remove([imagePath]));
  const { user } = check(await first.auth.getUser());
  assert.throws(() => execFileSync(process.execPath, ['scripts/local-admin.mjs', `missing-${randomUUID()}@example.test`], { stdio: 'pipe' }));
  execFileSync(process.execPath, ['scripts/local-admin.mjs', user.email], { stdio: 'pipe' });
  assert.equal(check(await first.from('user_roles').select('role').eq('user_id', user.id).single()).role, 'admin');
  console.log('PASS: signup, profile trigger, RLS isolation, journey progress, avatar upload/delete, local admin');
} finally {
  if (imagePath) check(await admin.storage.from('avatars').remove([imagePath]));
  for (const id of users) check(await admin.auth.admin.deleteUser(id));
}
