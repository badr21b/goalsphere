'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'
import { ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react'

interface Video {
  id: string
  title: string
  titleKey: string
  category: string
  categoryKey: string
  thumbnail: string
  duration: string
  views: string
  isNew?: boolean
}

const videos: Video[] = [
  {
    id: 'haaland-goals',
    title: 'Watch all NINE Haaland goals this season',
    titleKey: 'videos.haalandGoals',
    category: 'Highlights',
    categoryKey: 'categories.highlights',
    thumbnail: '/images/videos/haaland-goals.jpg',
    duration: '3:45',
    views: '2.1M',
    isNew: true
  },
  {
    id: 'zubimendi-goal',
    title: 'ALL ANGLES: Zubimendi\'s Go',
    titleKey: 'videos.zubimendiGoal',
    category: 'Highlights',
    categoryKey: 'categories.highlights',
    thumbnail: '/images/videos/zubimendi-goal.jpg',
    duration: '2:30',
    views: '1.8M'
  },
  {
    id: 'vintage-cr7',
    title: 'Vintage CR7',
    titleKey: 'videos.vintageCr7',
    category: 'Highlights',
    categoryKey: 'categories.highlights',
    thumbnail: '/images/videos/vintage-cr7.jpg',
    duration: '4:12',
    views: '3.2M'
  },
  {
    id: 'szoboszlai-best',
    title: 'Best of Szoboszl',
    titleKey: 'videos.szoboszlaiBest',
    category: 'Highlights',
    categoryKey: 'categories.highlights',
    thumbnail: '/images/videos/szoboszlai-best.jpg',
    duration: '3:20',
    views: '1.5M'
  },
  {
    id: 'fpl-challenge',
    title: 'Harry\'s FPL Challenge Team',
    titleKey: 'videos.fplChallenge',
    category: 'Fantasy',
    categoryKey: 'categories.fantasy',
    thumbnail: '/images/videos/fpl-challenge.jpg',
    duration: '5:30',
    views: '890K'
  }
]

export default function LatestVideos() {
  const t = useTranslations()
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, videos.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, videos.length - 2)) % Math.max(1, videos.length - 2))
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('sections.latestVideos')}</h2>
          
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-600/40 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-600/40 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="text-purple-300 hover:text-white transition-colors flex items-center gap-1 text-sm">
              {t('common.viewMore')} <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / Math.min(3, videos.length))}%)` }}>
            {videos.map((video, index) => (
              <div key={video.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 cursor-pointer group"
                >
                  {/* Video Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* New Badge */}
                    {video.isNew && (
                      <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {t('common.new')}
                      </div>
                    )}
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
                      >
                        <Play className="w-5 h-5 text-white ml-1" />
                      </motion.div>
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* Video Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full">
                        {t(video.categoryKey)}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-white mb-2 text-sm group-hover:text-purple-300 transition-colors line-clamp-2">
                      {t(video.titleKey)}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{video.views} {t('common.views')}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
