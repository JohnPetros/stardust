'use client'

import dynamic from 'next/dynamic'

export const Animation = dynamic(() => import('./LottieAnimation'), {
  ssr: false,
})
