import type { MetadataRoute } from 'next'

import { CLIENT_ENV } from '@/constants'

export const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/api/',
          '/admin/',
          '/space/',
          '/shop/',
          '/ranking/',
          '/challenging/',
          '/lesson/',
          '/rewarding/',
          '/playground/',
        ],
      },
    ],
    sitemap: `${CLIENT_ENV.stardustWebUrl}/sitemap.xml`,
  }
}

export default robots
