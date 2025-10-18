'use client'

import { useTranslations } from 'next-intl'

export default function TestPage() {
  const t = useTranslations()
  
  return (
    <div className="min-h-screen bg-sport-dark text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">Test Page - {t('home.title')} is Working!</h1>
    </div>
  )
}
