import dynamic from 'next/dynamic'
import type { LottieRef } from 'lottie-react'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
})

type Props = {
  lottieRef: LottieRef
  lottieData: unknown | null
  size: number | 'full'
  windowWidth: number
  autoplay: boolean
  loop: boolean
}

export const LottieAnimationView = ({
  lottieRef,
  lottieData,
  size,
  windowWidth,
  autoplay,
  loop,
}: Props) => {
  if (size === 'full' && !lottieData) return null

  if (size === 'full')
    return (
      <Lottie
        lottieRef={lottieRef}
        animationData={lottieData}
        style={{
          width: windowWidth,
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        autoplay={autoplay}
        loop={loop}
      />
    )

  const boxSize = `min(${size}px, 100vw, 100vh)`

  return (
    <div
      style={{ width: boxSize, height: boxSize, maxWidth: '100vw', maxHeight: '100vh' }}
    >
      {lottieData ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={lottieData}
          style={{
            width: boxSize,
            height: boxSize,
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
          autoplay={autoplay}
          loop={loop}
        />
      ) : null}
    </div>
  )
}
