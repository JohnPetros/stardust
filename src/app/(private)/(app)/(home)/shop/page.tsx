'use client'

import { useEffect, useState } from 'react'

import { AvatarsSection } from './components/AvatarsSection'
import { RocketsSection } from './components/RocketsSection'

import { Loading } from '@/app/components/Loading'

export default function Shop() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3500)
  }, [])

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 pb-6">
      {isLoading && <Loading isSmall={false} />}
      <RocketsSection />
      <AvatarsSection />
    </div>
  )
}
