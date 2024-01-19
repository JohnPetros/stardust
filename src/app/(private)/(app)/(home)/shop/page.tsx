'use client'

import { Suspense } from 'react'

import { AvatarsList } from './components/AvatarsList'
import { Footer } from './components/Footer'
import { RocketsList } from './components/RocketsList'

import { Loading } from '@/app/components/Loading'

export default function Shop() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 pb-[12rem] sm:pb-6">
      <Suspense fallback={<Loading isSmall={false} />}>
        <RocketsList />
        <AvatarsList />
        <Footer />
      </Suspense>
    </div>
  )
}
