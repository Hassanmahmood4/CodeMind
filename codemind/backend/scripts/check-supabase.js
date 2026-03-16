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

  const r = await c.from('conversations').select('id').limit(1);
  if (r.error) {
    if (r.error.message && r.error.message.includes('fetch failed')) {
      console.log('Supabase client failed: fetch failed (network/TLS from Node).');
      console.log('App will still work; conversation history will not be saved until this is fixed.');
    } else {
      console.log('DB error:', r.error.message);
      if (r.error.code) console.log('Code:', r.error.code);
    }
    process.exit(1);
  }
  console.log('Supabase OK – connected');
}

main().catch((err) => {
  console.log('Error:', err.message);
  if (err.cause) console.log('Cause:', err.cause?.message || err.cause?.code || err.cause);
  process.exit(1);
});
