'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react'
import { Article } from '@/lib/types'

interface HeroCarouselProps {
  articles: Article[]
}

export default function HeroCarousel({ articles }: HeroCarouselProps) {
  const t = useTranslations()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [articles.length, isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (articles.length === 0) return null

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl shadow-pl-purple/20"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${articles[currentIndex].imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-pl-dark/90 via-pl-purple/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-pl-purple/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
            <div className="max-w-4xl">
              {/* Breaking News Badge */}
              {articles[currentIndex].isBreaking && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pl-red to-pl-gold text-pl-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg"
                >
                  <div className="w-2 h-2 bg-pl-white rounded-full animate-pulse" />
                  {t('common.breaking')}
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pl-white via-pl-gold to-pl-accent bg-clip-text text-transparent mb-4 text-shadow leading-tight"
              >
                {articles[currentIndex].title}
              </motion.h1>

              {/* Meta Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base"
              >
                <div className="flex items-center gap-1 text-pl-light-gray">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(articles[currentIndex].publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-pl-light-gray">
                  <Eye className="w-4 h-4" />
                  <span>{articles[currentIndex].views.toLocaleString()} {t('common.views')}</span>
                </div>
                <span className="bg-gradient-to-r from-pl-gold/20 to-pl-accent/20 text-pl-gold px-3 py-1 rounded-full text-xs font-medium border border-pl-gold/30">
                  {articles[currentIndex].category}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-pl-dark/80 hover:bg-pl-purple/80 text-pl-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-pl-gold/30 hover:border-pl-gold"
        aria-label={t('navigation.previousArticle')}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-pl-dark/80 hover:bg-pl-purple/80 text-pl-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-pl-gold/30 hover:border-pl-gold"
        aria-label={t('navigation.nextArticle')}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-pl-gold to-pl-accent w-8' 
                : 'bg-pl-white/50 hover:bg-pl-gold/70 w-2'
            }`}
            aria-label={`${t('navigation.goToSlide')} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
