'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// Import all translation files
import enMessages from '../messages/en.json'
import frMessages from '../messages/fr.json'
import deMessages from '../messages/de.json'
import arMessages from '../messages/ar.json'

const messages = {
  en: enMessages,
  fr: frMessages,
  de: deMessages,
  ar: arMessages
}

export function useTranslations() {
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState('en')

  useEffect(() => {
    // Extract locale from pathname
    const locale = pathname.split('/')[1] || 'en'
    setCurrentLocale(locale)
  }, [pathname])

  const t = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.')
    let value: any = messages[currentLocale as keyof typeof messages] || messages.en

    // Navigate through nested keys
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        // Fallback to English if key not found
        value = messages.en
        for (const fallbackKey of keys) {
          value = value?.[fallbackKey]
        }
        break
      }
    }

    if (typeof value === 'string') {
      // Replace parameters in the string
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
      }
      return value
    }

    return key // Return the key if translation not found
  }

  return t
}
