'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface Interview {
  id: string
  title: string
  titleKey: string
  person: string
  personKey: string
  image: string
  isNew?: boolean
}

const interviews: Interview[] = [
  {
    id: 'ange-weeds',
    title: 'Ange: Some look at the weeds, I look at what\'...',
    titleKey: 'interviews.angeWeeds',
    person: 'Ange Postecoglou',
    personKey: 'interviews.angePostecoglou',
    image: '/images/interviews/ange-weeds.jpg',
    isNew: true
  },
  {
    id: 'maresca-update',
    title: '\'SIX more weeks\' - Maresca updates on...',
    titleKey: 'interviews.marescaUpdate',
    person: 'Enzo Maresca',
    personKey: 'interviews.enzoMaresca',
    image: '/images/interviews/maresca-update.jpg',
    isNew: true
  },
  {
    id: 'ange-trophy',
    title: 'Ange: My story always ends with a trophy',
    titleKey: 'interviews.angeTrophy',
    person: 'Ange Postecoglou',
    personKey: 'interviews.angePostecoglou',
    image: '/images/interviews/ange-trophy.jpg'
  },
  {
    id: 'pep-break',
    title: 'Pep: I won\'t think about a break until 2035!',
    titleKey: 'interviews.pepBreak',
    person: 'Pep Guardiola',
    personKey: 'interviews.pepGuardiola',
    image: '/images/interviews/pep-break.jpg'
  },
  {
    id: 'moyes-pickford',
    title: 'Moyes: Pickford is England\'s best...',
    titleKey: 'interviews.moyesPickford',
    person: 'David Moyes',
    personKey: 'interviews.davidMoyes',
    image: '/images/interviews/moyes-pickford.jpg'
  },
  {
    id: 'howe-injuries',
    title: 'Howe delivers Wissa and Livramento injury...',
    titleKey: 'interviews.howeInjuries',
    person: 'Eddie Howe',
    personKey: 'interviews.eddieHowe',
    image: '/images/interviews/howe-injuries.jpg'
  },
  {
    id: 'hurzeler-mitoma',
    title: 'Hurzeler: Mitoma ( Veltman could fea',
    titleKey: 'interviews.hurzelerMitoma',
    person: 'Fabian Hürzeler',
    personKey: 'interviews.fabianHurzeler',
    image: '/images/interviews/hurzeler-mitoma.jpg'
  }
]

export default function InterviewsCarousel() {
  const t = useTranslations()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % interviews.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + interviews.length) % interviews.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('sections.interviews')}</h2>
          
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
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {interviews.map((interview, index) => (
              <div key={interview.id} className="w-full flex-shrink-0 px-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 cursor-pointer group"
                >
                  {/* Interview Image */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* New Badge */}
                    {interview.isNew && (
                      <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {t('common.new')}
                      </div>
                    )}
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Interview Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-white mb-2 text-lg group-hover:text-purple-300 transition-colors line-clamp-2">
                      {t(interview.titleKey)}
                    </h3>
                    <p className="text-purple-300 text-sm">
                      {t(interview.personKey)}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {interviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
