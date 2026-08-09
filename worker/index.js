/**
 * Armtrex website Worker.
 *
 * API routes:
 *   GET  /api/access/verify?token=...
 *   GET  /api/products?token=...
 *   POST /api/contact
 *   POST /api/kyc
 *
 * Static Vite assets are served through Cloudflare Workers Assets.
 */

import { products, categories } from './data/products.js'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  })
}

// -----------------------------------------------------------------------------
// Base64url helpers
// -----------------------------------------------------------------------------

function bytesToBinaryString(bytes) {
  const CHUNK = 0x8000
  let str = ''

  for (let i = 0; i < bytes.length; i += CHUNK) {
    str += String.fromCharCode.apply(
      null,
      bytes.subarray(i, i + CHUNK),
    )
  }

  return str
}

function b64urlEncode(bytes) {
  return btoa(bytesToBinaryString(bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function b64urlDecodeToString(b64url) {
  const b64 = b64url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(b64url.length / 4) * 4, '=')

  return atob(b64)
}

// -----------------------------------------------------------------------------
// Access-token verification
// -----------------------------------------------------------------------------

async function hmacSign(payloadStr, secret) {
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not configured')
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadStr),
  )

  return b64urlEncode(new Uint8Array(sig))
}

async function verifyToken(token, secret) {
  if (
    !token ||
    typeof token !== 'string' ||
    !token.includes('.')
  ) {
    return { ok: false }
  }

  const [payloadB64, sig] = token.split('.')

  if (!payloadB64 || !sig) {
    return { ok: false }
  }

  const expectedSig = await hmacSign(payloadB64, secret)

  if (sig !== expectedSig) {
    return { ok: false }
  }

  let payload

  try {
    payload = JSON.parse(
      b64urlDecodeToString(payloadB64),
    )
  } catch {
    return { ok: false }
  }

  if (!payload.exp || Date.now() > payload.exp) {
    return {
      ok: false,
      expired: true,
    }
  }

  return {
    ok: true,
    expiresAt: payload.exp,
  }
}

// -----------------------------------------------------------------------------
// Best-effort per-isolate rate limiting
// -----------------------------------------------------------------------------

const hits = new Map()

function rateOk(ip, max = 8, windowMs = 60_000) {
  const now = Date.now()

  const times = (hits.get(ip) || []).filter(
    (t) => now - t < windowMs,
  )

  if (times.length >= max) {
    hits.set(ip, times)
    return false
  }

  times.push(now)
  hits.set(ip, times)

  return true
}

// -----------------------------------------------------------------------------
// Shared Resend email sender
// -----------------------------------------------------------------------------

async function sendEmail(env, {
  subject,
  text,
}) {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const response = await fetch(
    'https://api.resend.com/emails',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:
          env.RESEND_FROM ||
          'Armtrex Website <website@armtrex.co.uk>',
        to: [
          env.KYC_TO_EMAIL ||
          'info@armtrex.co.uk',
        ],
        subject,
        text,
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Resend responded ${response.status}: ${errorText}`,
    )
  }
}

// -----------------------------------------------------------------------------
// Contact Us
// -----------------------------------------------------------------------------

async function handleContact(request, env) {
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    'unknown'

  if (!rateOk(ip, 5, 60_000)) {
    return json(
      {
        ok: false,
        error: 'too many requests',
      },
      429,
    )
  }

  const contentType =
    request.headers.get('Content-Type') || ''

  if (!contentType.includes('application/json')) {
    return json(
      {
        ok: false,
        error: 'expected application/json',
      },
      400,
    )
  }

  let body

  try {
    body = await request.json()
  } catch {
    return json(
      {
        ok: false,
        error: 'invalid JSON',
      },
      400,
    )
  }

  // Honeypot.
  if (
    typeof body._gotcha === 'string' &&
    body._gotcha.trim()
  ) {
    return json({ ok: true })
  }

  const clean = (value, maxLength) =>
    (value || '')
      .toString()
      .replace(/[\r\n]+/g, ' ')
      .trim()
      .slice(0, maxLength)

  const name = clean(body.name, 200)
  const email = clean(body.email, 200)
  const company = clean(body.company, 200)
  const subject = clean(body.subject, 300)
  const message = (body.message || '')
    .toString()
    .trim()
    .slice(0, 5000)

  if (!name || !email || !subject || !message) {
    return json(
      {
        ok: false,
        error: 'missing required fields',
      },
      400,
    )
  }

  // Basic email sanity check.
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return json(
      {
        ok: false,
        error: 'invalid email address',
      },
      400,
    )
  }

  const emailText = [
    'New Armtrex website enquiry',
    '----------------------------------------',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || 'Not provided'}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
    '',
    'Submitted through: armtrex.co.uk',
  ].join('\n')

  try {
    await sendEmail(env, {
      subject: `[Website Enquiry] ${subject}`,
      text: emailText,
    })
  } catch (error) {
    console.error(
      'Contact email delivery failed:',
      error.message,
    )

    return json(
      {
        ok: false,
        error: 'delivery failed',
      },
      502,
    )
  }

  return json({ ok: true })
}

// -----------------------------------------------------------------------------
// Request Access / KYC
// -----------------------------------------------------------------------------

async function handleKyc(request, env) {
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    'unknown'

  if (!rateOk(ip, 5, 60_000)) {
    return json(
      {
        ok: false,
        error: 'too many requests',
      },
      429,
    )
  }

  const contentType =
    request.headers.get('Content-Type') || ''

  if (!contentType.includes('multipart/form-data')) {
    return json(
      {
        ok: false,
        error: 'expected multipart/form-data',
      },
      400,
    )
  }

  const form = await request.formData()

  // Honeypot.
  if (
    (form.get('_gotcha') || '')
      .toString()
      .trim()
  ) {
    return json({ ok: true })
  }

  const oneLine = (value) =>
    (value || '')
      .toString()
      .replace(/[\r\n]+/g, ' ')
      .trim()
      .slice(0, 2000)

  const fields = {
    legalEntityName:
      oneLine(form.get('legalEntityName')),

    tradingName:
      oneLine(form.get('tradingName')),

    ownershipControl:
      (form.get('ownershipControl') || '')
        .toString()
        .slice(0, 3000),

    registrationNumber:
      oneLine(form.get('registrationNumber')),

    incorporationCountry:
      oneLine(form.get('incorporationCountry')),

    registeredAddress:
      oneLine(form.get('registeredAddress')),

    website:
      oneLine(form.get('website')),

    businessDescription:
      (form.get('businessDescription') || '')
        .toString()
        .slice(0, 4000),

    contactName:
      oneLine(form.get('contactName')),

    contactTitle:
      oneLine(form.get('contactTitle')),

    contactEmail:
      oneLine(form.get('contactEmail')),

    contactPhone:
      oneLine(form.get('contactPhone')),

    capability:
      (form.get('capability') || '')
        .toString()
        .slice(0, 5000),

    indicativeQuantity:
      oneLine(form.get('indicativeQuantity')),

    timeframe:
      oneLine(form.get('timeframe')),

    isEndUser:
      oneLine(form.get('isEndUser')),

    destinationCountry:
      oneLine(form.get('destinationCountry')),

    statedPurpose:
      (form.get('statedPurpose') || '')
        .toString()
        .slice(0, 5000),

    onwardTransfer:
      oneLine(form.get('onwardTransfer')),

    intermediaryInvolved:
      oneLine(form.get('intermediaryInvolved')),

    intermediaryDetails:
      (form.get('intermediaryDetails') || '')
        .toString()
        .slice(0, 3000),

    sanctionsDeclaration:
      oneLine(form.get('sanctionsDeclaration')),

    exportControlDeclaration:
      oneLine(form.get('exportControlDeclaration')),

    eusDeclaration:
      oneLine(form.get('eusDeclaration')),
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

  const missing = required.filter(
    (key) => !fields[key],
  )

  if (
    missing.length ||
    fields.sanctionsDeclaration !== 'true' ||
    fields.exportControlDeclaration !== 'true' ||
    fields.eusDeclaration !== 'true' ||
    (
      fields.intermediaryInvolved === 'yes' &&
      !fields.intermediaryDetails
    )
  ) {
    return json(
      {
        ok: false,
        error:
          'missing required fields or declarations not accepted',
      },
      400,
    )
  }

  const emailText = [
    'New Armtrex Stage 1 buyer/supplier enquiry',
    '----------------------------------------',
    ...Object.entries(fields).map(
      ([key, value]) => `${key}: ${value}`,
    ),
  ].join('\n')

  try {
    await sendEmail(env, {
      subject:
        `[Stage 1 Enquiry] ` +
        `${fields.legalEntityName || 'Unnamed organisation'}`,
      text: emailText,
    })
  } catch (error) {
    console.error(
      'KYC email delivery failed:',
      error.message,
    )

    return json(
      {
        ok: false,
        error: 'delivery failed',
      },
      502,
    )
  }

const requestId = crypto.randomUUID()
const submittedAt = new Date().toISOString()

try {
  await env.DB.prepare(
    `INSERT INTO access_requests
      (id, applicant_name, organisation, email, status, submitted_at, request_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      requestId,
      fields.contactName,
      fields.legalEntityName,
      fields.contactEmail,
      'pending',
      submittedAt,
      JSON.stringify(fields),
    )
    .run()

  await env.DB.prepare(
    `INSERT INTO access_audit_log
      (id, access_request_id, event_type, event_detail, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      requestId,
      'request_submitted',
      'Stage 1 access request submitted',
      submittedAt,
    )
    .run()
} catch (error) {
  console.error(
    'Access request database save failed:',
    error.message,
  )

  return json(
    {
      ok: false,
      error: 'request could not be recorded',
    },
    500,
  )
}

return json({ ok: true })
}

// -----------------------------------------------------------------------------
// Worker
// -----------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (
      url.pathname === '/api/access/verify' &&
      request.method === 'GET'
    ) {
      const token =
        url.searchParams.get('token')

      const result = await verifyToken(
        token,
        env.ACCESS_TOKEN_SECRET,
      )

      return json(
        result,
        result.ok ? 200 : 401,
      )
    }

    if (
      url.pathname === '/api/products' &&
      request.method === 'GET'
    ) {
      const token =
        url.searchParams.get('token')

      const result = await verifyToken(
        token,
        env.ACCESS_TOKEN_SECRET,
      )

      if (!result.ok) {
        return json(
          {
            ok: false,
            error:
              'invalid or expired access link',
          },
          401,
        )
      }

      return json({
        ok: true,
        products,
        categories,
      })
    }
if (
  url.pathname === '/api/admin/access-requests' &&
  request.method === 'GET'
) {
  const suppliedSecret =
    request.headers.get('X-Admin-Secret') || ''

  if (
    !env.ADMIN_SECRET ||
    suppliedSecret !== env.ADMIN_SECRET
  ) {
    return json(
      {
        ok: false,
        error: 'unauthorized',
      },
      401,
    )
  }

  const result = await env.DB.prepare(
    `SELECT
      id,
      applicant_name,
      organisation,
      email,
      status,
      submitted_at,
      reviewed_at,
      reviewed_by,
      access_expires_at,
      rejection_reason
     FROM access_requests
     ORDER BY submitted_at DESC
     LIMIT 100`,
  ).all()

  return json({
    ok: true,
    requests: result.results || [],
  })
}
    if (
      url.pathname === '/api/contact' &&
      request.method === 'POST'
    ) {
      return handleContact(request, env)
    }
async function handleContact(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'

  if (!rateOk(ip, 5, 60_000)) {
    return json({ ok: false, error: 'too many requests' }, 429)
  }

  let data

  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid request' }, 400)
  }

  const clean = (value, max = 5000) =>
    (value || '')
      .toString()
      .replace(/[\r\n]+/g, ' ')
      .trim()
      .slice(0, max)

  // Honeypot — genuine visitors should leave this empty.
  if (clean(data._gotcha, 200)) {
    return json({ ok: true })
  }

  const name = clean(data.name, 200)
  const email = clean(data.email, 200)
  const companyName = clean(data.company, 200)
  const subject = clean(data.subject, 300)
  const message = clean(data.message, 5000)

  if (!name || !email || !subject || !message) {
    return json({ ok: false, error: 'missing required fields' }, 400)
  }

  const body = [
    'New Armtrex website enquiry',
    '-'.repeat(40),
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${companyName || 'Not provided'}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n')

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || 'Armtrex Website <kyc@armtrex.co.uk>',
        to: [env.CONTACT_TO_EMAIL || 'info@armtrex.co.uk'],
        reply_to: email,
        subject: `[Website Enquiry] ${subject}`,
        text: body,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Resend contact delivery failed:', errorText)
      throw new Error(`resend responded ${res.status}`)
    }
  } catch (err) {
    console.error('Contact email delivery failed:', err.message)
    return json({ ok: false, error: 'delivery failed' }, 502)
  }
const requestId = crypto.randomUUID()
const submittedAt = new Date().toISOString()


try {
  await env.DB.prepare(
    `INSERT INTO access_requests
      (id, applicant_name, organisation, email, status, submitted_at, request_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      requestId,
      fields.contactName,
      fields.legalEntityName,
      fields.contactEmail,
      'pending',
      submittedAt,
      JSON.stringify(fields),
    )
    .run()

  await env.DB.prepare(
    `INSERT INTO access_audit_log
      (id, access_request_id, event_type, event_detail, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      requestId,
      'request_submitted',
      'Stage 1 access request submitted',
      submittedAt,
    )
    .run()
} catch (error) {
  console.error(
    'Access request database save failed:',
    error.message,
  )

  return json(
    {
      ok: false,
      error: 'request could not be recorded',
    },
    500,
  )
}
  return json({ ok: true })
}
    if (url.pathname === '/api/contact' && request.method === 'POST') {
  return handleContact(request, env)
}

    if (url.pathname === '/api/kyc' && request.method === 'POST') {
      return handleKyc(request, env)
    }

    // Everything else: static site.
    return env.ASSETS.fetch(request)
  },
}