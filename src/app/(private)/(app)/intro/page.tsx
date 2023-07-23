'use client'

import { useAuth } from '@/hooks/useAuth'

export function Intro() {
  const { user } = useAuth()

  return <div className='text-white'>intro {user?.name}</div>
}
