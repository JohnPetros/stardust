import { useRef, useState } from 'react'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'
import { ROCKET_ANIMATION_DURATION } from '@/utils/constants'

export function useEmailConfirmationPage() {
  const { fetchUser, user } = useAuth()
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const router = useRouter()
  const rocketRef = useRef(null) as LottieRef
  console.log(user)

  async function launchRocket() {
    await new Promise((resolve) =>
      setTimeout(() => {
        rocketRef.current?.goToAndPlay(0)
        resolve(true)
      }, ROCKET_ANIMATION_DURATION + 1000)
    )
  }

  async function handleHomeLink() {
    setIsRocketVisible(true)
    await launchRocket()
  }

  // useEffect(() => {
  //   async function signUserIn() {
  //     try {
  //       await fetchUser()
  //     } catch (error) {
  //       console.error(error)
  //       router.push(ROUTES.public.signIn)
  //     }
  //   }

  //   signUserIn()
  // }, [fetchUser, router])

  // useEffect(() => {
  //   let timer: NodeJS.Timeout
  //   if (isRocketVisible) {
  //     timer = setTimeout(() => {
  //       router.push(ROUTES.private.home)
  //     }, 5000)
  //   }

  //   return () => clearTimeout(timer)
  // }, [isRocketVisible, router])

  return {
    handleHomeLink,
    rocketRef,
    user,
    isRocketVisible,
  }
}
