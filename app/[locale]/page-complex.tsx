'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroCarousel from '@/components/HeroCarousel'
import LiveTicker from '@/components/LiveTicker'
import CategoryFilter from '@/components/CategoryFilter'
import ArticleCard from '@/components/ArticleCard'
import AdUnit from '@/components/AdUnit'
import { ArticleCategory } from '@/lib/types'
import { 
  useGetBreakingNewsQuery, 
  useGetArticlesQuery
} from '@/store/api/articlesApi'
import { useGetLiveMatchesQuery } from '@/store/api/liveScoresApi'
import { useGetBannerAdsQuery } from '@/store/api/adUnitsApi'
import { useAppSelector } from '@/store/hooks'

const categories: ArticleCategory[] = [
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
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch data using RTK Query
  const { 
    data: breakingNews, 
    isLoading: breakingNewsLoading,
    error: breakingNewsError 
  } = useGetBreakingNewsQuery({ limit: 5 })

  const { 
    data: liveMatches, 
    isLoading: liveMatchesLoading,
    error: liveMatchesError 
  } = useGetLiveMatchesQuery({ limit: 10 })

  const { 
    data: articles, 
    isLoading: articlesLoading,
    error: articlesError 
  } = useGetArticlesQuery({
    page: 1,
    limit: 12,
    category: selectedCategory || undefined,
    sortBy: 'published_at',
    sortOrder: 'desc'
  })

  const { 
    data: headerAds, 
    isLoading: headerAdsLoading 
  } = useGetBannerAdsQuery({ position: 'header' })

  const { 
    data: footerAds, 
    isLoading: footerAdsLoading 
  } = useGetBannerAdsQuery({ position: 'footer' })

  const handleAdClick = (adId: string) => {
    console.log(`Ad clicked: ${adId}`)
    // Track ad click analytics
  }

  // Show loading state
  if (breakingNewsLoading || articlesLoading) {
    return (
      <div className="min-h-screen bg-sport-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sport-red mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (breakingNewsError || articlesError) {
    return (
      <div className="min-h-screen bg-sport-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-sport-red text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-2">حدث خطأ في تحميل البيانات</h2>
          <p className="text-gray-400 mb-4">يرجى المحاولة مرة أخرى لاحقاً</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-sport-red hover:bg-sport-red/80 text-white px-6 py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Header Ad */}
      {headerAds?.data && headerAds.data.length > 0 && (
        <AdUnit
          adUnit={headerAds.data[0]}
          position="header"
          onAdClick={handleAdClick}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8">
          {breakingNews?.data && breakingNews.data.length > 0 ? (
            <HeroCarousel articles={breakingNews.data} />
          ) : (
            <div className="h-[400px] bg-sport-gray/30 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-lg">لا توجد أخبار عاجلة حالياً</p>
            </div>
          )}
        </section>

        {/* Live Ticker */}
        <section className="mb-8">
          {liveMatches?.data && liveMatches.data.length > 0 ? (
            <LiveTicker liveScores={liveMatches.data} />
          ) : (
            <div className="bg-sport-gray/30 border border-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-400 rounded-full animate-pulse"></div>
                <span>لا توجد مباريات مباشرة حالياً</span>
              </div>
            </div>
          )}
        </section>

        {/* Category Filter */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">آخر الأخبار</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mb-8">
          {articles?.data && articles.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.data.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant={index === 0 ? 'featured' : 'default'}
                  showAd={index === 1} // Show ad on second article
                  onAdClick={() => handleAdClick('in-article-ad')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">لا توجد مقالات متاحة</div>
              <p className="text-gray-500">
                {selectedCategory 
                  ? `لا توجد مقالات في فئة "${selectedCategory}"`
                  : 'جاري تحديث المحتوى...'
                }
              </p>
            </div>
          )}
        </section>

        {/* Load More Button */}
        {articles?.data && articles.data.length > 0 && (
          <section className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-sport-red hover:bg-sport-red/80 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={() => {
                setIsLoading(true)
                // Simulate loading more articles
                setTimeout(() => setIsLoading(false), 1000)
              }}
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحميل...' : 'تحميل المزيد'}
            </motion.button>
          </section>
        )}
      </main>

      {/* Footer Ad */}
      {footerAds?.data && footerAds.data.length > 0 && (
        <AdUnit
          adUnit={footerAds.data[0]}
          position="footer"
          onAdClick={handleAdClick}
        />
      )}

      {/* Footer */}
      <footer className="bg-sport-gray/30 border-t border-gray-700/50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <h3 className="text-xl font-bold text-white mb-4">GoalSphere</h3>
          <p className="mb-4">المصدر الأول للأخبار والإحصائيات الرياضية في العالم العربي</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
            <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
          </div>
        </div>
      </footer>
    </div>
  )
}