'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Menu, X, Search, Bell, User, Trophy, Calendar, BarChart3 } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
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
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold">{t('home.title')}</span>
            <span className="text-pl-gold">|</span>
            <span>{t('home.description')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">{t('common.lastUpdate')}: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pl-purple to-pl-gold rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-pl-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pl-gold to-pl-accent bg-clip-text text-transparent">
                {t('home.title')}
              </h1>
              <p className="text-xs text-pl-light-gray">{t('home.subtitle')}</p>
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
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pl-red rounded-full"></span>
            </motion.button>

            {/* Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-pl-gray/50 hover:bg-pl-gray/80 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                className="w-full bg-pl-gray/50 border border-pl-light-gray/30 rounded-lg px-4 py-3 pr-12 text-pl-white placeholder-pl-light-gray focus:outline-none focus:ring-2 focus:ring-pl-gold/50 focus:border-pl-gold"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pl-light-gray" />
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
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="pl-nav-link flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-pl-gray/50 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
