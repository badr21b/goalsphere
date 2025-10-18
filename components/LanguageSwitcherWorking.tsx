'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
]

export default function LanguageSwitcherWorking() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en'
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  const handleLanguageChange = (locale: string) => {
    // Replace the locale in the current pathname
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${locale}`)
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-pl-gray/50 hover:bg-pl-gray/70 border border-pl-light-gray/30 rounded-lg px-3 py-2 text-pl-white text-sm transition-all duration-200 hover:border-pl-gold/50"
      >
        <Globe className="w-4 h-4" />
        <span className="flex items-center gap-2">
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.name}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentLocale === language.code
                      ? 'bg-gradient-to-r from-pl-gold/20 to-pl-accent/20 text-pl-gold border border-pl-gold/50'
                      : 'hover:bg-pl-light-gray/20 text-pl-light-gray'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {currentLocale === language.code && (
                    <span className="ml-auto text-pl-gold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
