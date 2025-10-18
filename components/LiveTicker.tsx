'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Activity, Clock, Trophy } from 'lucide-react'
import { LiveScore } from '@/lib/types'

interface LiveTickerProps {
  liveScores: LiveScore[]
}

export default function LiveTicker({ liveScores }: LiveTickerProps) {
  const t = useTranslations()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (liveScores.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveScores.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [liveScores.length])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'text-sport-red'
      case 'finished':
        return 'text-sport-green'
      case 'upcoming':
        return 'text-sport-gold'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return t('common.live')
      case 'finished':
        return t('common.finished')
      case 'upcoming':
        return t('common.upcoming')
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <Activity className="w-4 h-4 animate-pulse" />
      case 'finished':
        return <Trophy className="w-4 h-4" />
      case 'upcoming':
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  if (liveScores.length === 0) {
    return (
      <div className="pl-card p-6">
        <div className="flex items-center justify-center gap-2 text-pl-light-gray">
          <Activity className="w-5 h-5" />
          <span>{t('liveTicker.noMatches')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="pl-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pl-purple to-pl-gold px-6 py-3 flex items-center gap-3">
        <Activity className="w-5 h-5 text-pl-white animate-pulse" />
        <span className="text-pl-white font-bold text-sm">{t('liveTicker.title')}</span>
        <div className="ml-auto w-2 h-2 bg-pl-white rounded-full animate-pulse"></div>
      </div>

      {/* Ticker Content */}
      <div className="relative overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="p-6"
        >
          <div className="flex items-center justify-between">
            {/* Match Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-pl-light-gray bg-pl-gray/50 px-2 py-1 rounded-full">{liveScores[currentIndex].league}</span>
                <div className={`flex items-center gap-2 ${getStatusColor(liveScores[currentIndex].status)}`}>
                  {getStatusIcon(liveScores[currentIndex].status)}
                  <span className="text-sm font-medium">
                    {getStatusText(liveScores[currentIndex].status)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <div className="font-bold text-lg text-pl-white">{liveScores[currentIndex].homeTeam}</div>
                  <div className="text-sm text-pl-light-gray">{t('common.home')}</div>
                </div>
                
                <div className="text-center px-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pl-gold to-pl-accent bg-clip-text text-transparent">
                    {liveScores[currentIndex].homeScore} - {liveScores[currentIndex].awayScore}
                  </div>
                  {liveScores[currentIndex].status === 'live' && liveScores[currentIndex].minute && (
                    <div className="text-sm text-pl-red font-medium bg-pl-red/10 px-2 py-1 rounded-full mt-1">
                      {liveScores[currentIndex].minute}'
                    </div>
                  )}
                </div>
                
                <div className="text-left">
                  <div className="font-bold text-lg text-pl-white">{liveScores[currentIndex].awayTeam}</div>
                  <div className="text-sm text-pl-light-gray">{t('common.away')}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-pl-gray/50">
          <motion.div
            className="h-full bg-gradient-to-r from-pl-gold to-pl-accent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Dots Indicator */}
      {liveScores.length > 1 && (
        <div className="flex justify-center gap-2 p-4">
          {liveScores.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-pl-gold to-pl-accent w-8' 
                  : 'bg-pl-light-gray hover:bg-pl-gold/70 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
