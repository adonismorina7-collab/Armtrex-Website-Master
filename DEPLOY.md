# Armtrex website — deployment notes

## Project

This is the clean Armtrex React/Vite source project for Cloudflare Workers with static assets.

Build and deploy with:

```bash
npm install
npm run build
npx wrangler deploy
```

`wrangler.toml` points the Worker at `worker/index.js` and serves Vite's `dist/` directory through Cloudflare Workers Assets.

## Access control

Public pages contain only high-level product and capability information. Detailed product data is kept in `worker/data/products.js` and is returned by `/api/products` only after a valid signed access token has been verified.

The Request Access page is a Stage 1 buyer/supplier enquiry. It is deliberately designed not to collect passport copies or other identity documents through the public form. If further due-diligence material is required, it should be requested and transferred through an appropriate secure channel.

## Required Cloudflare secret

Set a strong secret for access-token signing:

```bash
npx wrangler secret put ACCESS_TOKEN_SECRET
```

Rotating this secret invalidates outstanding signed access links.

## Stage 1 enquiry email delivery

The Worker sends `/api/kyc` submissions using one of these configured methods:

- `KYC_RELAY_URL` + `KYC_RELAY_SECRET`
- `RESEND_API_KEY` (with optional `RESEND_FROM` and `KYC_TO_EMAIL`)

Configure the required secrets with `wrangler secret put`. Do not put secrets in source files or this repository.

## Compliance positioning

The website uses firm but factual compliance wording. It does **not** claim that Armtrex is "MOD approved", "MOD compliant", or certified to a particular MOD standard unless the underlying status has actually been established.

Website screening is a preliminary control only. Actual transactions require the appropriate internal due diligence, end-user/end-use assessment, sanctions screening, export/trade-control assessment and any required authorisations.

## Security

The project includes security headers in `public/_headers`. Keep these protections enabled when deploying.

Do not commit passports, End-User Certificates, banking information, credentials, API keys, or other sensitive customer/company material.
