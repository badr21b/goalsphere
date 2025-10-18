'use client'

import { useTranslations } from 'next-intl'
import Header from '@/components/Header'

export default function TestI18nPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-sport-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            {t('home.title')} - Internationalization Test
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Common Translations */}
            <div className="bg-sport-gray/80 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Common Translations</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>Loading:</strong> {t('common.loading')}</p>
                <p><strong>Read More:</strong> {t('common.readMore')}</p>
                <p><strong>Advertisement:</strong> {t('common.advertisement')}</p>
                <p><strong>Click Here:</strong> {t('common.clickHere')}</p>
                <p><strong>Views:</strong> {t('common.views')}</p>
                <p><strong>All Categories:</strong> {t('common.allCategories')}</p>
                <p><strong>Breaking:</strong> {t('common.breaking')}</p>
                <p><strong>Live:</strong> {t('common.live')}</p>
                <p><strong>Finished:</strong> {t('common.finished')}</p>
                <p><strong>Upcoming:</strong> {t('common.upcoming')}</p>
              </div>
            </div>

            {/* Navigation Translations */}
            <div className="bg-sport-gray/80 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Navigation Translations</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>Home:</strong> {t('navigation.home')}</p>
                <p><strong>Matches:</strong> {t('navigation.matches')}</p>
                <p><strong>Standings:</strong> {t('navigation.standings')}</p>
                <p><strong>News:</strong> {t('navigation.news')}</p>
                <p><strong>Transfers:</strong> {t('navigation.transfers')}</p>
                <p><strong>Search:</strong> {t('navigation.search')}</p>
                <p><strong>Notifications:</strong> {t('navigation.notifications')}</p>
                <p><strong>Profile:</strong> {t('navigation.profile')}</p>
              </div>
            </div>

            {/* Category Translations */}
            <div className="bg-sport-gray/80 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Category Translations</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>Transfers:</strong> {t('categories.transfers')}</p>
                <p><strong>Analysis:</strong> {t('categories.analysis')}</p>
                <p><strong>Breaking News:</strong> {t('categories.breaking')}</p>
                <p><strong>Premier League:</strong> {t('categories.premier-league')}</p>
                <p><strong>Champions League:</strong> {t('categories.champions-league')}</p>
                <p><strong>Saudi Pro League:</strong> {t('categories.saudi-pro-league')}</p>
                <p><strong>La Liga:</strong> {t('categories.la-liga')}</p>
                <p><strong>Serie A:</strong> {t('categories.serie-a')}</p>
                <p><strong>Bundesliga:</strong> {t('categories.bundesliga')}</p>
              </div>
            </div>

            {/* Home Translations */}
            <div className="bg-sport-gray/80 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Home Translations</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>Title:</strong> {t('home.title')}</p>
                <p><strong>Subtitle:</strong> {t('home.subtitle')}</p>
                <p><strong>Description:</strong> {t('home.description')}</p>
                <p><strong>Welcome:</strong> {t('home.welcome')}</p>
                <p><strong>Hero Description:</strong> {t('home.heroDescription')}</p>
                <p><strong>Latest News:</strong> {t('home.latestNews')}</p>
                <p><strong>Article Title:</strong> {t('home.articleTitle', { number: 1 })}</p>
                <p><strong>Article Content:</strong> {t('home.articleContent')}</p>
              </div>
            </div>

            {/* Footer Translations */}
            <div className="bg-sport-gray/80 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Footer Translations</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>Title:</strong> {t('footer.title')}</p>
                <p><strong>Description:</strong> {t('footer.description')}</p>
                <p><strong>Privacy Policy:</strong> {t('footer.privacyPolicy')}</p>
                <p><strong>Terms of Service:</strong> {t('footer.termsOfService')}</p>
                <p><strong>Contact Us:</strong> {t('footer.contactUs')}</p>
              </div>
            </div>

            {/* Live Ticker Translations */}
            <div className="bg-sport-gray/80 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Live Ticker Translations</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>Title:</strong> {t('liveTicker.title')}</p>
                <p><strong>No Matches:</strong> {t('liveTicker.noMatches')}</p>
                <p><strong>Home:</strong> {t('common.home')}</p>
                <p><strong>Away:</strong> {t('common.away')}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Use the language switcher in the header to test different languages
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
