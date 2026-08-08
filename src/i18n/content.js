// Locale-aware accessors. English is the source of truth; when lang === 'ms'
// the Malay company-copy overlay (company.ms.js) is merged on top, with a
// per-field fallback to English. Components should read content through the
// hooks below so they re-render on language change.
//
// NOTE: product data is intentionally NOT statically imported here anymore.
// The full catalogue lives server-side (worker/data/products.js) and is only
// available after a KYC access link is verified — see src/access/. The
// products.ms.js overlay (translated labels for the old bundled catalogue)
// is unused and deliberately not imported, so it can't be pulled into the
// client bundle even if the language toggle is re-enabled later.
import { categories as categoriesEn, heroTeasers } from '../data/products.js'
import { company as companyEn } from '../data/company.js'
import { useLang } from './LanguageContext.jsx'
import { useCatalog } from '../access/CatalogContext.jsx'

export function getCategories(lang) {
  if (lang !== 'ms') return categoriesEn
  return categoriesEn // Malay category names retired along with the product overlay; English fallback only.
}

export function getCompany() {
return companyEn
}

export { heroTeasers }

// Hooks — read the active language from context and return localized content.
export function useCompany() {
  return getCompany()
}
export function useCategories() {
  return getCategories(useLang().lang)
}

// Gated catalogue: empty array until a verified KYC access link has been
// exchanged for the real product data via /api/products.
export function useProducts() {
  const { products } = useCatalog()
  return products
}
