import { useEffect, useRef, useState } from 'react'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'
import { ROCKET_ANIMATION_DELAY, ROUTES } from '@/utils/constants'

export function useEmailConfirmationPage() {
  const { user } = useAuth()
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
          router.push(ROUTES.private.home)
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
