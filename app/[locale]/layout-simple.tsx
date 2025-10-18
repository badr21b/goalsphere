import { Cairo, Inter } from 'next/font/google'

const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function SimpleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
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
