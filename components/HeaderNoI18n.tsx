'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Search, Bell, User, Trophy, Calendar, BarChart3 } from 'lucide-react'
import LanguageSwitcherWorking from './LanguageSwitcherWorking'
import { useTranslations } from '@/hooks/useTranslations'

export default function HeaderNoI18n() {
  const t = useTranslations()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navigationItems = [
    { name: t('navigation.home'), href: '#', icon: Trophy },
    { name: t('navigation.matches'), href: '#', icon: Calendar },
    { name: t('navigation.standings'), href: '#', icon: BarChart3 },
    { name: t('navigation.news'), href: '#', icon: Bell },
    { name: t('navigation.transfers'), href: '#', icon: User },
  ]

  return (
    <header className="bg-pl-dark border-b border-pl-light-gray/30 sticky top-0 z-50 backdrop-blur-md">
      {/* Top Bar */}
      <div className="bg-pl-purple text-pl-white py-2">
        <div className="w-full px-6 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-medium">{t('home.title')}</span>
              <span className="text-pl-gold hidden sm:inline">|</span>
              <span className="text-xs">{t('home.description')}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">{t('common.lastUpdate')}: {t('common.liveUpdate')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full px-6 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-pl-gold to-pl-accent bg-clip-text text-transparent">
                {t('home.title')}
              </h1>
              <p className="text-xs text-pl-light-gray hidden sm:block">{t('home.subtitle')}</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="pl-nav-link flex items-center gap-2 group"
              >
                <item.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{item.name}</span>
              </motion.a>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Switcher - Hidden on mobile */}
            <div className="hidden sm:block">
              <LanguageSwitcherWorking />
            </div>

            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-pl-red rounded-full"></span>
            </motion.button>

            {/* Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              <User className="w-4 h-4" />
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder={t('navigation.search')}
                className="w-full bg-pl-gray/50 border border-pl-light-gray/30 rounded-lg px-3 py-2 pr-10 text-sm text-pl-white placeholder-pl-light-gray focus:outline-none focus:ring-2 focus:ring-pl-gold/50 focus:border-pl-gold"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pl-light-gray" />
            </div>
          </motion.div>
        )}
      </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-pl-light-gray/30 bg-pl-gray/20"
            >
              <nav className="w-full px-6 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8 py-6">
                <div className="flex flex-col gap-2">
                  {/* Language Switcher for Mobile */}
                  <div className="mb-4">
                    <LanguageSwitcherWorking />
                  </div>
                  
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="pl-nav-link flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-pl-gray/50 transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </a>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
    </header>
  )
}
