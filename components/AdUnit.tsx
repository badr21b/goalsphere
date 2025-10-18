'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X, ExternalLink } from 'lucide-react'
import { AdUnit as AdUnitType } from '@/lib/types'

interface AdUnitProps {
  adUnit: AdUnitType
  position: 'header' | 'footer' | 'sidebar' | 'in-content'
  onClose?: () => void
  onAdClick?: (adId: string) => void
}

export default function AdUnit({ 
  adUnit, 
  position, 
  onClose, 
  onAdClick 
}: AdUnitProps) {
  const t = useTranslations()
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const handleAdClick = () => {
    onAdClick?.(adUnit.id)
    // Track ad click analytics here
    console.log(`Ad clicked: ${adUnit.id}`)
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'header':
        return 'w-full h-16 md:h-20'
      case 'footer':
        return 'w-full h-20 md:h-24 sticky bottom-0 z-50'
      case 'sidebar':
        return 'w-full h-64'
      case 'in-content':
        return 'w-full h-32 md:h-40'
      default:
        return 'w-full h-32'
    }
  }

  const getContentStyles = () => {
    switch (position) {
      case 'header':
      case 'footer':
        return 'flex items-center justify-center text-center'
      case 'sidebar':
        return 'flex flex-col items-center justify-center text-center'
      case 'in-content':
        return 'flex items-center justify-center text-center'
      default:
        return 'flex items-center justify-center text-center'
    }
  }

  if (!isVisible || !adUnit.isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`${getPositionStyles()} bg-gradient-to-r from-pl-gray/80 to-pl-dark/80 border border-pl-gray/30 rounded-lg overflow-hidden relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={handleClose}
          className="absolute top-2 left-2 z-10 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label={t('adUnit.closeAd')}
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Ad Content */}
      <div 
        className={`${getContentStyles()} h-full cursor-pointer`}
        onClick={handleAdClick}
      >
        <div className="text-center">
          {/* Ad Label */}
          <div className="text-xs text-pl-white/60 mb-2 flex items-center justify-center gap-1">
            <span>{t('common.advertisement')}</span>
            <ExternalLink className="w-3 h-3" />
          </div>
          
          {/* Ad Content */}
          <div className="text-pl-white text-sm md:text-base">
            {adUnit.content || t('adUnit.adSpace')}
          </div>
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 bg-gradient-to-r from-pl-gold to-pl-accent hover:from-pl-accent hover:to-pl-gold text-pl-dark px-4 py-1 rounded-full text-xs font-medium transition-all duration-200"
          >
            {t('common.clickHere')}
          </motion.button>
        </div>
      </div>

      {/* Hover Effect */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-pl-gold/10 to-pl-accent/10 pointer-events-none"
        />
      )}

      {/* Loading Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}

// Ad Injection Function for In-Article Ads
export function injectInArticleAds(
  articleContent: string, 
  adUnits: AdUnitType[], 
  adPosition: 'after-paragraph-2' | 'after-paragraph-5' = 'after-paragraph-2'
): string {
  const paragraphs = articleContent.split('\n\n')
  const adUnit = adUnits.find(ad => ad.type === 'in-article' && ad.isActive)
  
  if (!adUnit || paragraphs.length < 2) return articleContent

  const targetParagraph = adPosition === 'after-paragraph-2' ? 1 : 4
  const adHtml = `
    <div class="ad-unit-container my-6 p-4 bg-gray-800/50 border border-gray-600/50 rounded-lg text-center">
      <div class="text-xs text-gray-500 mb-2">Advertisement</div>
      <div class="text-gray-300">${adUnit.content}</div>
      <button class="mt-2 bg-sport-red text-white px-4 py-1 rounded-full text-xs">Click here</button>
    </div>
  `

  if (targetParagraph < paragraphs.length) {
    paragraphs.splice(targetParagraph + 1, 0, adHtml)
  }

  return paragraphs.join('\n\n')
}
