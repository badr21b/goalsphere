'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'
import { Trophy, Calendar, BarChart3, Users, Target, Star } from 'lucide-react'

interface Feature {
  id: string
  title: string
  titleKey: string
  category: string
  categoryKey: string
  icon: any
  image: string
  isNew?: boolean
}

const features: Feature[] = [
  {
    id: 'weekend-questions',
    title: 'Ten KEY questions for the weekend\'s matches',
    titleKey: 'features.weekendQuestions',
    category: 'Features',
    categoryKey: 'categories.features',
    icon: Target,
    image: '/images/features/weekend-questions.jpg',
    isNew: true
  },
  {
    id: 'title-race',
    title: 'Title race is shaping up to be an absolute classic',
    titleKey: 'features.titleRace',
    category: 'Features',
    categoryKey: 'categories.features',
    icon: Trophy,
    image: '/images/features/title-race.jpg',
    isNew: true
  },
  {
    id: 'matchweek-predictor',
    title: 'Can you predict this weekend\'s Premier League results?',
    titleKey: 'features.matchweekPredictor',
    category: 'Mini-Games',
    categoryKey: 'categories.miniGames',
    icon: Calendar,
    image: '/images/features/matchweek-predictor.jpg'
  },
  {
    id: 'haaland-analysis',
    title: 'Analysis: Is Haaland somehow getting even better?',
    titleKey: 'features.haalandAnalysis',
    category: 'Features',
    categoryKey: 'categories.features',
    icon: BarChart3,
    image: '/images/features/haaland-analysis.jpg'
  },
  {
    id: 'title-vote',
    title: 'VOTE: Who do YOU think will win the 2025/26 title race?',
    titleKey: 'features.titleVote',
    category: 'Features',
    categoryKey: 'categories.features',
    icon: Star,
    image: '/images/features/title-vote.jpg'
  },
  {
    id: 'wharton-analysis',
    title: 'Analysis: Wharton excelling as one of league\'s best midfielders',
    titleKey: 'features.whartonAnalysis',
    category: 'Features',
    categoryKey: 'categories.features',
    icon: Users,
    image: '/images/features/wharton-analysis.jpg'
  }
]

export default function FeaturesGrid() {
  const t = useTranslations()

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">{t('sections.features')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.article
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 cursor-pointer group"
            >
              {/* Feature Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* New Badge */}
                {feature.isNew && (
                  <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {t('common.new')}
                  </div>
                )}
                
                {/* Feature Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <feature.icon className="w-16 h-16 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
              </div>
              
              {/* Feature Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full">
                    {t(feature.categoryKey)}
                  </span>
                </div>
                
                <h3 className="font-bold text-white mb-2 text-sm group-hover:text-purple-300 transition-colors line-clamp-2">
                  {t(feature.titleKey)}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
        
        {/* View More Button */}
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
          >
            {t('common.viewMore')}
          </motion.button>
        </div>
      </div>
    </motion.section>
  )
}
