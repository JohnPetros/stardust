import type { MetadataRoute } from 'next'

import { CLIENT_ENV } from '@/constants'

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: `${CLIENT_ENV}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${CLIENT_ENV}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${CLIENT_ENV}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}

export default sitemap
