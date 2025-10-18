'use client'

import { motion } from 'framer-motion'
import { Clock, Eye, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Article } from '@/lib/types'
import Image from 'next/image'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact' | 'featured'
  showAd?: boolean
  onAdClick?: () => void
}

// Category labels will be handled by translations

const categoryColors: Record<string, string> = {
  'transfers': 'bg-blue-500/20 text-blue-400',
  'analysis': 'bg-purple-500/20 text-purple-400',
  'breaking': 'bg-red-500/20 text-red-400',
  'premier-league': 'bg-green-500/20 text-green-400',
  'champions-league': 'bg-yellow-500/20 text-yellow-400',
  'saudi-pro-league': 'bg-sport-green/20 text-sport-green',
  'la-liga': 'bg-orange-500/20 text-orange-400',
  'serie-a': 'bg-pink-500/20 text-pink-400',
  'bundesliga': 'bg-indigo-500/20 text-indigo-400'
}

export default function ArticleCard({ 
  article, 
  variant = 'default',
  showAd = false,
  onAdClick
}: ArticleCardProps) {
  const t = useTranslations()
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-32'
      case 'featured':
        return 'h-64'
      default:
        return 'h-48'
    }
  }

  const getTitleSize = () => {
    switch (variant) {
      case 'compact':
        return 'text-sm'
      case 'featured':
        return 'text-lg md:text-xl'
      default:
        return 'text-sm'
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`pl-card group cursor-pointer ${
        article.isBreaking ? 'breaking-news' : ''
      } ${variant === 'featured' ? 'pl-card-premium' : ''}`}
    >
      {/* Image Container */}
      <div className={`relative ${getImageHeight()} overflow-hidden`}>
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pl-dark/80 via-pl-purple/20 to-transparent" />
        
        {/* Breaking News Badge */}
        {article.isBreaking && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-pl-red to-pl-gold text-pl-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <div className="w-1.5 h-1.5 bg-pl-white rounded-full animate-pulse" />
            {t('common.breaking')}
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[article.category]}`}>
            {t(`categories.${article.category}`)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Title */}
        <h3 className={`font-bold text-pl-white mb-3 group-hover:bg-gradient-to-r group-hover:from-pl-gold group-hover:to-pl-accent group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 ${getTitleSize()}`}>
          {variant === 'compact' 
            ? truncateText(article.title, 60)
            : article.title
          }
        </h3>

        {/* Excerpt */}
        {variant !== 'compact' && (
          <p className="text-pl-light-gray text-sm md:text-base mb-4 leading-relaxed">
            {truncateText(article.body, 120)}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-pl-light-gray">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-pl-gold group-hover:text-pl-accent transition-colors">
            <span className="text-xs">{t('common.readMore')}</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>

        {/* In-Article Ad Placeholder */}
        {showAd && (
          <div className="mt-4 pt-4 border-t border-pl-light-gray/30">
            <div 
              className="ad-unit cursor-pointer hover:bg-pl-dark/70 transition-colors"
              onClick={onAdClick}
            >
              <div className="text-xs text-pl-light-gray mb-1">{t('common.advertisement')}</div>
              <div className="text-pl-light-gray">
                {t('adUnit.adSpace')}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
}
