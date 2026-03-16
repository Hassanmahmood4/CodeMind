/**
 * Run from backend folder: node scripts/check-supabase.js
 * Checks Supabase env and connection (does not print secrets).
 */
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const host = url.replace(/^https?:\/\//, '').split('/')[0];
console.log('Node version:', process.version, '(need 18+ for fetch)');
console.log('Supabase host:', host);
console.log('Key length:', key.length);

function testWithHttps() {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const req = https.get(`https://${host}`, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  try {
    await testWithHttps();
    console.log('Reachability: host responds to HTTPS');
  } catch (e) {
    console.log('Reachability: FAILED –', e.message);
    console.log('Fix: check VPN/firewall, try another network, or use a different Supabase project/region.');
    process.exit(1);
  }

  const { createClient } = require('@supabase/supabase-js');
  const c = createClient(url, key);

  // Smoke test: any table the app might use (Prisma creates "User" / "Conversation")
  const tablesToTry = ['User', 'user', 'Conversation', 'conversation'];
  let lastError = null;
  for (const table of tablesToTry) {
    const r = await c.from(table).select('id').limit(1);
    if (!r.error) {
      console.log('Supabase OK – connected (table "' + table + '" reachable)');
      return;
    }
    lastError = r.error;
  }
  // PGRST205 = table not in schema cache (common when Prisma created tables; app uses Prisma, not REST)
  if (lastError && lastError.code === 'PGRST205') {
    console.log('Supabase OK – URL and anon key valid.');
    console.log('(Tables not in PostgREST cache; your app uses Prisma + DATABASE_URL for data, so this is fine.)');
    return;
  }
  if (lastError && lastError.message && lastError.message.includes('fetch failed')) {
    console.log('Supabase client failed: fetch failed (network/TLS from Node).');
    process.exit(1);
  }
  console.log('DB error:', lastError?.message || lastError);
  if (lastError?.code) console.log('Code:', lastError.code);
  process.exit(1);
}

main().catch((err) => {
  console.log('Error:', err.message);
  if (err.cause) console.log('Cause:', err.cause?.message || err.cause?.code || err.cause);
  process.exit(1);
});
