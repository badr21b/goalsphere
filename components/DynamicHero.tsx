'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'
import { getHeroContent, getHeroContentByCategory, HeroContent } from '@/lib/heroContent'
import { Trophy, Star, Calendar, TrendingUp } from 'lucide-react'

interface DynamicHeroProps {
  selectedCategory?: string | null
  autoRotate?: boolean
  rotationInterval?: number
}

export default function DynamicHero({ 
  selectedCategory, 
  autoRotate = true, 
  rotationInterval = 8000 
}: DynamicHeroProps) {
  const t = useTranslations()
  const [currentContent, setCurrentContent] = useState<HeroContent | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get initial content based on selected category
    const content = selectedCategory 
      ? getHeroContentByCategory(selectedCategory)
      : getHeroContent()
    setCurrentContent(content)
  }, [selectedCategory])

  useEffect(() => {
    if (!autoRotate || selectedCategory) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        const newContent = getHeroContent()
        setCurrentContent(newContent)
        setIsVisible(true)
      }, 300)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, rotationInterval, selectedCategory])

  if (!currentContent) return null

  const getIcon = (id: string) => {
    switch (id) {
      case 'premier-league':
        return <Trophy className="w-8 h-8 text-blue-500" />
      case 'champions-league':
        return <Star className="w-8 h-8 text-yellow-500" />
      case 'world-cup':
        return <Trophy className="w-8 h-8 text-green-500" />
      case 'la-liga':
        return <Trophy className="w-8 h-8 text-red-500" />
      case 'serie-a':
        return <Trophy className="w-8 h-8 text-green-600" />
      case 'bundesliga':
        return <Trophy className="w-8 h-8 text-red-600" />
      case 'saudi-pro-league':
        return <Trophy className="w-8 h-8 text-green-500" />
      default:
        return <Trophy className="w-8 h-8 text-purple-500" />
    }
  }

  const getStats = (id: string) => {
    switch (id) {
      case 'premier-league':
        return [
          { label: t('hero.stats.teams'), value: '20' },
          { label: t('hero.stats.matches'), value: '380' },
          { label: t('hero.stats.seasons'), value: '32' }
        ]
      case 'champions-league':
        return [
          { label: t('hero.stats.teams'), value: '32' },
          { label: t('hero.stats.matches'), value: '125' },
          { label: t('hero.stats.trophies'), value: '68' }
        ]
      case 'world-cup':
        return [
          { label: t('hero.stats.teams'), value: '32' },
          { label: t('hero.stats.matches'), value: '64' },
          { label: t('hero.stats.trophies'), value: '22' }
        ]
      default:
        return [
          { label: t('hero.stats.leagues'), value: '50+' },
          { label: t('hero.stats.matches'), value: '1000+' },
          { label: t('hero.stats.news'), value: '24/7' }
        ]
    }
  }

  return (
    <section className="mb-8">
      <div className={`h-[400px] bg-gradient-to-br ${currentContent.gradient} rounded-lg overflow-hidden relative`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-8">
          <div className="text-center max-w-4xl">
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.div
                  key={currentContent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                  >
                    {getIcon(currentContent.id)}
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                  >
                    {currentContent.title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-200 mb-4"
                  >
                    {currentContent.subtitle}
                  </motion.p>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
                  >
                    {currentContent.description}
                  </motion.p>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center gap-8 flex-wrap"
                  >
                    {getStats(currentContent.id).map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-300">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Calendar className="w-16 h-16 text-white" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>
      </div>
    </section>
  )
}
