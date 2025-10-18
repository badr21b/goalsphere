'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
]

export default function LanguageSwitcher() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-pl-gray/50 hover:bg-pl-gray/70 border border-pl-light-gray/30 rounded-lg px-3 py-2 transition-all duration-200 hover:border-pl-gold/50"
      >
        <Globe className="w-4 h-4 text-pl-gold" />
        <span className="text-sm font-medium text-pl-white">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-pl-light-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Language Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 bg-pl-gray border border-pl-light-gray/30 rounded-lg shadow-xl z-50 overflow-hidden backdrop-blur-sm"
          >
            <div className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                    locale === language.code
                      ? 'bg-gradient-to-r from-pl-gold/20 to-pl-accent/20 text-pl-gold border border-pl-gold/50'
                      : 'hover:bg-pl-light-gray/20 text-pl-light-gray'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="flex-1">{language.name}</span>
                  {locale === language.code && (
                    <div className="w-2 h-2 bg-pl-gold rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
