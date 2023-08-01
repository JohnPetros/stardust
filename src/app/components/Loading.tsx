'use client'
import Lottie from 'lottie-react'
import Spinner from './../../../public/animations/spinner.json'
import Rocket from './../../../public/animations/rocket-floating.json'

interface LoadingProps {
  isSmall?: boolean
}

export function Loading({ isSmall = true }: LoadingProps) {
  const size = isSmall ? 64 : 100

  if (isSmall) {
    return (
      <Lottie
        animationData={Spinner}
        style={{ width: size, height: size }}
        loop={true}
      />
    )
  }

  return (
    <div className="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-gray-900 z-30">
      <Lottie
        animationData={Rocket}
        style={{ width: size, height: size }}
        loop={true}
      />
    </div>
  )
}
