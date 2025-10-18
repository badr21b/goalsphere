'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'

interface Sponsor {
  id: string
  name: string
  logo: string
  role: string
  roleKey: string
}

const sponsors: Sponsor[] = [
  {
    id: 'ea-sports',
    name: 'EA Sports',
    logo: '/images/sponsors/ea-sports.svg',
    role: 'Lead Partner',
    roleKey: 'sponsors.leadPartner'
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: '/images/sponsors/adobe.svg',
    role: 'Official Creativity Partner',
    roleKey: 'sponsors.creativityPartner'
  },
  {
    id: 'barclays',
    name: 'Barclays',
    logo: '/images/sponsors/barclays.svg',
    role: 'Official Bank',
    roleKey: 'sponsors.officialBank'
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    logo: '/images/sponsors/coca-cola.svg',
    role: 'Official Soft Drink',
    roleKey: 'sponsors.officialSoftDrink'
  },
  {
    id: 'guinness',
    name: 'Guinness',
    logo: '/images/sponsors/guinness.svg',
    role: 'Official Beer',
    roleKey: 'sponsors.officialBeer'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '/images/sponsors/microsoft.svg',
    role: 'Official Cloud & AI Partner',
    roleKey: 'sponsors.cloudPartner'
  },
  {
    id: 'puma',
    name: 'Puma',
    logo: '/images/sponsors/puma.svg',
    role: 'Official Ball',
    roleKey: 'sponsors.officialBall'
  },
  {
    id: 'avery-dennison',
    name: 'Avery Dennison',
    logo: '/images/sponsors/avery-dennison.svg',
    role: 'Official Licensee',
    roleKey: 'sponsors.officialLicensee'
  }
]

export default function SponsorsSection() {
  const t = useTranslations()

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-t border-purple-700/20 py-8"
    >
      <div className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 md:gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              {/* Sponsor Logo Placeholder */}
              <div className="w-20 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-xs font-bold text-white">{sponsor.name}</span>
              </div>
              
              {/* Sponsor Role */}
              <div className="text-center">
                <p className="text-xs text-gray-400 group-hover:text-white transition-colors">
                  {t(sponsor.roleKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
