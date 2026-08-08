import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'oim-lang'
export const LANGS = ['en', 'ms']
const DEFAULT_LANG = 'en' // English remains the default language

const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {} })

function readInitialLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return LANGS.includes(stored) ? stored : DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang)

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
