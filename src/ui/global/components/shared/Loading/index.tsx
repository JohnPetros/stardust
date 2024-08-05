'use client'

import { Animation } from '../Animation'

type LoadingProps = {
  isSmall?: boolean
}

export function Loading({ isSmall = true }: LoadingProps) {
  const size = isSmall ? 64 : 100

  if (isSmall) {
    return <Animation name='spinner' size={size} hasLoop={true} />
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-900'>
      <Animation name='rocket-floating' size={size} hasLoop={true} />
    </div>
  )
}
