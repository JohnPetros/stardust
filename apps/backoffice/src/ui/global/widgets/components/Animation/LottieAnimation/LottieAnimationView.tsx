import type { LottieRef } from 'lottie-react'
import Lottie from 'lottie-react'

type Props = {
  lottieRef: LottieRef
  data: unknown
  size: number | 'full'
  windowWidth: number
  hasLoop: boolean
}

export const LottieAnimationView = ({
  lottieRef,
  data,
  size,
  windowWidth,
  hasLoop = true,
}: Props) => {
  if (size === 'full')
    return (
      <Lottie
        lottieRef={lottieRef}
        animationData={data}
        style={{
          width: windowWidth,
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        loop={hasLoop}
      />
    )

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={data}
      style={{ width: size, height: size }}
      loop={hasLoop}
    />
  )
}
