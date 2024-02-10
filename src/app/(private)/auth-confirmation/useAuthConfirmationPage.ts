import { useEffect, useRef, useState } from 'react'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { ROCKET_ANIMATION_DELAY, ROUTES } from '@/global/constants'

export function useAuthConfirmationPage() {
  const { user } = useAuthContext()
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const router = useRouter()
  const rocketRef = useRef(null) as LottieRef

  async function launchRocket() {
    await new Promise((resolve) =>
      setTimeout(() => {
        rocketRef.current?.goToAndPlay(0)
        resolve(true)
      }, ROCKET_ANIMATION_DELAY * 1000)
    )
  }

  async function handleHomeLink() {
    setIsRocketVisible(true)
    await launchRocket()
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRocketVisible) {
      timer = setTimeout(
        () => {
          router.push(ROUTES.private.home.space)
        },
        ROCKET_ANIMATION_DELAY * 1000 + 1500
      )
    }

    return () => clearTimeout(timer)
  }, [isRocketVisible, router])

  return {
    handleHomeLink,
    rocketRef,
    user,
    isRocketVisible,
  }
}
