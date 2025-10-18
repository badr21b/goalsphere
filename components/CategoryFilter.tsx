'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Filter, X } from 'lucide-react'
import { ArticleCategory } from '@/lib/types'

interface CategoryFilterProps {
  categories: ArticleCategory[]
  selectedCategory: ArticleCategory | null
  onCategoryChange: (category: ArticleCategory | null) => void
}

// Category labels will be handled by translations

const categoryColors: Record<ArticleCategory, string> = {
  'transfers': 'bg-pl-blue/20 text-pl-blue border-pl-blue/50',
  'analysis': 'bg-pl-purple/20 text-pl-purple border-pl-purple/50',
  'breaking': 'bg-pl-red/20 text-pl-red border-pl-red/50',
  'premier-league': 'bg-pl-accent/20 text-pl-accent border-pl-accent/50',
  'champions-league': 'bg-pl-gold/20 text-pl-gold border-pl-gold/50',
  'saudi-pro-league': 'bg-pl-accent/20 text-pl-accent border-pl-accent/50',
  'la-liga': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  'serie-a': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  'bundesliga': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

  const handleCategorySelect = (category: ArticleCategory) => {
    onCategoryChange(category === selectedCategory ? null : category)
    setIsOpen(false)
  }

  const clearFilter = () => {
    onCategoryChange(null)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-pl-gray/50 hover:bg-pl-gray/70 border border-pl-light-gray/30 rounded-lg px-4 py-2 transition-all duration-200 hover:border-pl-gold/50"
      >
        <Filter className="w-4 h-4 text-pl-gold" />
        <span className="text-sm font-medium text-pl-white">
          {selectedCategory ? t(`categories.${selectedCategory}`) : t('common.allCategories')}
        </span>
        {selectedCategory && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              clearFilter()
            }}
            className="text-pl-light-gray hover:text-pl-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-pl-gray border border-pl-light-gray/30 rounded-lg shadow-xl z-50 overflow-hidden backdrop-blur-sm"
          >
            <div className="p-2">
              {/* All Categories Option */}
              <button
                onClick={clearFilter}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !selectedCategory
                    ? 'bg-gradient-to-r from-pl-gold/20 to-pl-accent/20 text-pl-gold border border-pl-gold/50'
                    : 'hover:bg-pl-light-gray/20 text-pl-light-gray'
                }`}
              >
                {t('common.allCategories')}
              </button>

              {/* Category Options */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    selectedCategory === category
                      ? categoryColors[category]
                      : 'hover:bg-pl-light-gray/20 text-pl-light-gray border-transparent'
                  }`}
                >
                  {t(`categories.${category}`)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
