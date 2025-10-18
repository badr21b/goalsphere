const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported)
  './i18n.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental.appDir option
}

module.exports = withNextIntl(nextConfig)