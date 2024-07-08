import { useRef } from 'react'
import { LottieRef } from 'lottie-react'

export function useLottieAnimation() {
  const lottieRef = useRef(null) as LottieRef

  function restart() {
    lottieRef.current?.goToAndPlay(0)
  }

  return {
    lottieRef,
    restart,
  }
}
