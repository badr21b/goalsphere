'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import HeaderNoI18n from '@/components/HeaderNoI18n'
import AdUnitNoI18n from '@/components/AdUnitNoI18n'
import { useTranslations } from '@/hooks/useTranslations'

const categories = [
  'transfers',
  'analysis', 
  'breaking',
  'premier-league',
  'champions-league',
  'saudi-pro-league',
  'la-liga',
  'serie-a',
  'bundesliga'
]

export default function HomePage() {
  const t = useTranslations()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Mock loading states for development
  const headerLoading = false
  const footerLoading = false
  const inContentLoading = false

  // Fallback ad data for development
  const fallbackAds = {
    header: {
      id: 'fallback-header',
      type: 'banner' as const,
      position: 'header' as const,
      content: 'Header Advertisement',
      isActive: true,
      targetCategory: undefined
    },
    footer: {
      id: 'fallback-footer',
      type: 'banner' as const,
      position: 'footer' as const,
      content: 'Footer Advertisement',
      isActive: true,
      targetCategory: undefined
    },
    inContent: {
      id: 'fallback-incontent',
      type: 'banner' as const,
      position: 'in-content' as const,
      content: 'In-Content Advertisement',
      isActive: true,
      targetCategory: undefined
    }
  }

  // For development, always show ads
  const showAds = true

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Header */}
      <HeaderNoI18n />

      {/* Header Banner Ad */}
      {headerLoading && (
        <div className="bg-sport-gray/20 border-b border-gray-700/30 py-2">
          <div className="container mx-auto px-4">
            <div className="h-16 bg-sport-gray/50 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Loading...</span>
            </div>
          </div>
        </div>
      )}
      {showAds && (
        <div className="bg-sport-gray/20 border-b border-gray-700/30 py-2">
          <div className="container mx-auto px-4">
            <AdUnitNoI18n
              adUnit={fallbackAds.header}
              position="header"
              onAdClick={(adId) => console.log('Header ad clicked:', adId)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="h-[400px] bg-sport-gray/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">{t('home.welcome')}</h2>
              <p className="text-gray-400 text-lg">{t('home.heroDescription')}</p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{t('home.latestNews')}</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-sport-red text-white'
                    : 'bg-sport-gray/50 text-gray-300 hover:bg-sport-gray/70'
                }`}
              >
                {t('common.allCategories')}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-sport-red text-white'
                      : 'bg-sport-gray/50 text-gray-300 hover:bg-sport-gray/70'
                  }`}
                >
                  {t(`categories.${category}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-sport-gray/80 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden transition-all duration-300 hover:bg-sport-gray/90 hover:scale-105 hover:shadow-2xl hover:shadow-sport-red/20"
              >
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
              </motion.article>
            ))}
          </div>

          {/* In-Content Ad after articles */}
          {inContentLoading && (
            <div className="mt-8">
              <div className="h-32 bg-sport-gray/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            </div>
          )}
          {showAds && (
            <div className="mt-8">
              <AdUnitNoI18n
                adUnit={fallbackAds.inContent}
                position="in-content"
                onAdClick={(adId) => console.log('In-content ad clicked:', adId)}
              />
            </div>
          )}
        </section>
      </main>

      {/* Footer Banner Ad */}
      {footerLoading && (
        <div className="bg-sport-gray/20 border-t border-gray-700/30 py-2">
          <div className="container mx-auto px-4">
            <div className="h-20 bg-sport-gray/50 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Loading...</span>
            </div>
          </div>
        </div>
      )}
      {showAds && (
        <div className="bg-sport-gray/20 border-t border-gray-700/30 py-2">
          <div className="container mx-auto px-4">
            <AdUnitNoI18n
              adUnit={fallbackAds.footer}
              position="footer"
              onAdClick={(adId) => console.log('Footer ad clicked:', adId)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-sport-gray/30 border-t border-gray-700/50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <h3 className="text-xl font-bold text-white mb-4">{t('footer.title')}</h3>
          <p className="mb-4">{t('footer.description')}</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.termsOfService')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.contactUs')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
