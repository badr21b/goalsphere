'use client'

import { useTranslations } from 'next-intl'

export default function TestPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-sport-dark">
      <header className="bg-pl-dark border-b border-pl-light-gray/30 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pl-purple to-pl-gold rounded-xl flex items-center justify-center">
                <span className="text-pl-white text-xl">⚽</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pl-gold to-pl-accent bg-clip-text text-transparent">
                  {t('home.title')}
                </h1>
                <p className="text-xs text-pl-light-gray">{t('home.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select className="bg-pl-gray/50 border border-pl-light-gray/30 rounded-lg px-3 py-2 text-pl-white">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-white mb-6">{t('home.welcome')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-sport-gray/80 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-sport-red/20 to-sport-gold/20 flex items-center justify-center">
                <span className="text-gray-400">{t('home.imagePlaceholder', { number: i })}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-3 text-lg">
                  {t('home.articleTitle', { number: i })}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {t('home.articleContent')}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{t('common.hoursAgo', { count: 2 })}</span>
                  <span>1,234 {t('common.views')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
