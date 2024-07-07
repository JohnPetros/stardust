'use client'
import Lottie from 'lottie-react'

import Rocket from '../../../../../../public/animations/rocket-floating.json'
import Spinner from '../../../../../../public/animations/spinner.json'

type LoadingProps = {
  isSmall?: boolean
}

export function Loading({ isSmall = true }: LoadingProps) {
  const size = isSmall ? 64 : 100

  if (isSmall) {
    return (
      <Lottie
        data-testid='loading'
        animationData={Spinner}
        style={{ width: size, height: size }}
        loop={true}
      />
    )
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-900'>
      <Lottie
        data-testid='loading'
        animationData={Rocket}
        style={{ width: size, height: size }}
        loop={true}
      />
    </div>
  )
}
