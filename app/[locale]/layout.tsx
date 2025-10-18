import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Cairo, Inter } from 'next/font/google'

const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const locales = ['en', 'fr', 'de', 'ar']

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  // Load messages for the current locale
  const messages = await import(`../../messages/${locale}.json`).then(m => m.default)

  // Determine text direction and font based on locale
  const isRTL = locale === 'ar'
  const fontClass = isRTL ? cairo.className : inter.className

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={`${cairo.variable} ${inter.variable}`}>
      <body className={`${fontClass} bg-sport-dark text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
