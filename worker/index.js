/**
 * Armtrex website Worker.
 *
 * Serves the static build (Vite output) for everything except a few API
 * routes:
 *
 *   GET  /api/access/verify?token=…   Verify a signed access link (stateless
 *                                     HMAC, no KV/DB needed).
 *   GET  /api/products?token=…        Full gated product catalogue — only
 *                                     returned once the token verifies.
 *   POST /api/kyc                     Stage 1 buyer/supplier enquiry
 *                                     (multipart/form-data, no identity
 *                                     document uploads at this stage).
 *                                     Relayed onward as an email — see
 *                                     sendKycEmail() below.
 *
 * ---- Access tokens -------------------------------------------------------
 * Stateless, no database: token = base64url(JSON{exp}) + "." +
 * base64url(HMAC-SHA256(payload, ACCESS_TOKEN_SECRET)). Generate one with
 * `node scripts/generate-access-link.mjs [days]` (needs the same secret in
 * its environment). Anyone holding a valid, unexpired token can read
 * /api/products — there's no per-person revocation list, so treat leaked
 * links as "burn and reissue" (rotate ACCESS_TOKEN_SECRET, which invalidates
 * every outstanding link at once) if one gets shared somewhere it shouldn't.
 *
 * ---- KYC email delivery ---------------------------------------------------
 * Two options, pick whichever fits your infra by setting the matching
 * secret — sendKycEmail() prefers KYC_RELAY_URL if both are set:
 *
 *   KYC_RELAY_URL + KYC_RELAY_SECRET   Forward the submission to your own
 *                                      mail relay (e.g. the existing
 *                                      server/contact_service.py Proton
 *                                      relay, extended with a matching
 *                                      /api/kyc endpoint — see that file).
 *                                      Reuses infra you already run; no new
 *                                      accounts/DNS needed.
 *
 *   RESEND_API_KEY (+ RESEND_FROM)     Send directly from the Worker via
 *                                      the Resend REST API. Cloudflare
 *                                      dropped free MailChannels access for
 *                                      Workers in Aug 2024, so a REST
 *                                      provider like Resend/Postmark/SES is
 *                                      the standalone-Worker option; swap
 *                                      the fetch call below for your
 *                                      provider of choice if not Resend.
 */

import { products, categories } from './data/products.js'

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS })
}

// ---- base64url helpers (Workers runtime has atob/btoa, not base64url) ----
function bytesToBinaryString(bytes) {
  const CHUNK = 0x8000
  let str = ''
  for (let i = 0; i < bytes.length; i += CHUNK) {
    str += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK))
  }
  return str
}
function b64urlEncode(bytes) {
  return btoa(bytesToBinaryString(bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function b64urlDecodeToString(b64url) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=')
  return atob(b64)
}
function b64stdEncode(bytes) {
  return btoa(bytesToBinaryString(bytes))
}

async function hmacSign(payloadStr, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadStr))
  return b64urlEncode(new Uint8Array(sig))
}

async function verifyToken(token, secret) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return { ok: false }
  const [payloadB64, sig] = token.split('.')
  const expectedSig = await hmacSign(payloadB64, secret)
  if (sig !== expectedSig) return { ok: false }
  let payload
  try {
    payload = JSON.parse(b64urlDecodeToString(payloadB64))
  } catch {
    return { ok: false }
  }
  if (!payload.exp || Date.now() > payload.exp) return { ok: false, expired: true }
  return { ok: true, expiresAt: payload.exp }
}

// ---- Very lightweight per-isolate rate limiting ---------------------------
// Best-effort only: each Worker isolate has its own counters, and isolates
// are ephemeral/regional, so this does NOT provide a hard global cap. For
// real protection, add a Cloudflare Rate Limiting rule on /api/* in the
// dashboard (Security → WAF → Rate limiting rules) — this is just a cheap
// backstop against a single hot script hammering one isolate.
const hits = new Map()
function rateOk(ip, max = 8, windowMs = 60_000) {
  const now = Date.now()
  const times = (hits.get(ip) || []).filter((t) => now - t < windowMs)
  if (times.length >= max) {
    hits.set(ip, times)
    return false
  }
  times.push(now)
  hits.set(ip, times)
  return true
}

// ---- KYC email delivery ----------------------------------------------------
async function sendKycEmail(env, fields, files) {
  if (env.KYC_RELAY_URL && env.KYC_RELAY_SECRET) {
    const fd = new FormData()
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v))
    for (const f of files) fd.append(f.fieldName, f.blob, f.filename)
    const res = await fetch(env.KYC_RELAY_URL, {
      method: 'POST',
      headers: { 'X-Relay-Secret': env.KYC_RELAY_SECRET },
      body: fd,
    })
    if (!res.ok) throw new Error(`relay responded ${res.status}`)
    return
  }

  if (env.RESEND_API_KEY) {
    const attachments = []
    for (const f of files) {
      const buf = await f.blob.arrayBuffer()
      attachments.push({
        filename: f.filename,
        content: b64stdEncode(new Uint8Array(buf)),
      })
    }
    const body = [
      'New Armtrex Stage 1 buyer/supplier enquiry',
      '-'.repeat(40),
      ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`),
    ].join('\n')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || 'Armtrex KYC <kyc@armtrex.co.uk>',
        to: [env.KYC_TO_EMAIL || 'info@armtrex.co.uk'],
        subject: `[Stage 1 Enquiry] ${fields.legalEntityName || 'Unnamed organisation'}`,
        text: body,
        attachments,
      }),
    })
    if (!res.ok) throw new Error(`resend responded ${res.status}`)
    return
  }

  throw new Error('no KYC email delivery method configured (set KYC_RELAY_URL+KYC_RELAY_SECRET or RESEND_API_KEY)')
}

async function handleKyc(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (!rateOk(ip, 5, 60_000)) {
    return json({ ok: false, error: 'too many requests' }, 429)
  }

  const contentType = request.headers.get('Content-Type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return json({ ok: false, error: 'expected multipart/form-data' }, 400)
  }

  const form = await request.formData()

  // Honeypot — real visitors never fill this hidden field.
  if ((form.get('_gotcha') || '').toString().trim()) {
    return json({ ok: true })
  }

  const oneLine = (v) => (v || '').toString().replace(/[\r\n]+/g, ' ').trim().slice(0, 2000)
  const fields = {
    legalEntityName: oneLine(form.get('legalEntityName')),
    tradingName: oneLine(form.get('tradingName')),
    registrationNumber: oneLine(form.get('registrationNumber')),
    incorporationCountry: oneLine(form.get('incorporationCountry')),
    registeredAddress: oneLine(form.get('registeredAddress')),
    website: oneLine(form.get('website')),
    businessDescription: (form.get('businessDescription') || '').toString().slice(0, 4000),
    contactName: oneLine(form.get('contactName')),
    contactTitle: oneLine(form.get('contactTitle')),
    contactEmail: oneLine(form.get('contactEmail')),
    contactPhone: oneLine(form.get('contactPhone')),
    capability: (form.get('capability') || '').toString().slice(0, 5000),
    indicativeQuantity: oneLine(form.get('indicativeQuantity')),
    timeframe: oneLine(form.get('timeframe')),
    isEndUser: oneLine(form.get('isEndUser')),
    destinationCountry: oneLine(form.get('destinationCountry')),
    statedPurpose: (form.get('statedPurpose') || '').toString().slice(0, 5000),
    onwardTransfer: oneLine(form.get('onwardTransfer')),
    intermediaryInvolved: oneLine(form.get('intermediaryInvolved')),
    intermediaryDetails: (form.get('intermediaryDetails') || '').toString().slice(0, 3000),
    sanctionsDeclaration: oneLine(form.get('sanctionsDeclaration')),
    exportControlDeclaration: oneLine(form.get('exportControlDeclaration')),
    eusDeclaration: oneLine(form.get('eusDeclaration')),
  }

  const required = [
    'legalEntityName',
    'incorporationCountry',
    'registeredAddress',
    'businessDescription',
    'contactName',
    'contactTitle',
    'contactEmail',
    'capability',
    'destinationCountry',
    'statedPurpose',
    'isEndUser',
    'onwardTransfer',
    'intermediaryInvolved',
  ]
  const missing = required.filter((key) => !fields[key])

  if (
    missing.length ||
    fields.sanctionsDeclaration !== 'true' ||
    fields.exportControlDeclaration !== 'true' ||
    fields.eusDeclaration !== 'true' ||
    (fields.intermediaryInvolved === 'yes' && !fields.intermediaryDetails)
  ) {
    return json({ ok: false, error: 'missing required fields or declarations not accepted' }, 400)
  }

  try {
    await sendKycEmail(env, fields, [])
  } catch (err) {
    console.error('KYC email delivery failed:', err.message)
    return json({ ok: false, error: 'delivery failed' }, 502)
  }

  return json({ ok: true })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/access/verify' && request.method === 'GET') {
      const token = url.searchParams.get('token')
      const result = await verifyToken(token, env.ACCESS_TOKEN_SECRET)
      return json(result, result.ok ? 200 : 401)
    }

    if (url.pathname === '/api/products' && request.method === 'GET') {
      const token = url.searchParams.get('token')
      const result = await verifyToken(token, env.ACCESS_TOKEN_SECRET)
      if (!result.ok) return json({ ok: false, error: 'invalid or expired access link' }, 401)
      return json({ ok: true, products, categories })
    }

    if (url.pathname === '/api/kyc' && request.method === 'POST') {
      return handleKyc(request, env)
    }

    // Everything else: static site (Vite build output via Workers Assets).
    return env.ASSETS.fetch(request)
  },
}
