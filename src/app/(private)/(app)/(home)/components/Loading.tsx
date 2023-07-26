'use client'
import Lottie from 'lottie-react'
import LoadingAnimation from '../../../../../../public/animations/loading.json'

export function Loading() {
  return (
    <Lottie
      animationData={LoadingAnimation}
      style={{ width: 40, height: 40 }}
      loop={true}
    />
  )
}
