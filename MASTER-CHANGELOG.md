# Armtrex Master — 8 August 2026

This master version is based on the uploaded `Armtrex Clean(1).zip` source and has been cleaned into a single deployable project.

## Changes made

- Removed the duplicated nested project copy.
- Removed `node_modules`, `.git` metadata and stale build output from the master source archive.
- Restored and retained the `Request Access` navigation and `/kyc` route.
- Reworked the Request Access page as a Stage 1 buyer/supplier enquiry.
- Removed public passport and identity-document uploads from the Stage 1 form.
- Added organisation, authorised-contact, requirement, end-user/end-use, destination, onward-transfer and intermediary screening fields.
- Added sanctions, export-control and End-User Certificate/Undertaking acknowledgements.
- Added a clear statement that submission is not approval, licensing, catalogue access or an obligation to supply.
- Strengthened the Compliance & Responsible Defence wording without making unsupported MOD approval/compliance claims.
- Kept the existing visual design and navigation structure, including the existing gold accent treatment.
- Kept the existing Cloudflare Worker access-control architecture for protected product data.
- Retained the existing security headers and deployment configuration.

## Verification

- JavaScript/JSX source files changed in this master were syntax-checked successfully.
- A production Vite build could not be executed in the isolated build environment because the uploaded Windows `node_modules` did not contain the Linux Rollup optional binary and the available package registry could not retrieve it. This is an environment limitation, not a source-syntax failure.
- Run `npm install`, `npm run build`, and `npx wrangler deploy` on the normal development/Cloudflare environment before deploying this master.
