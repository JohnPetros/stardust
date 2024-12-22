'use client'

import { type RefObject, useEffect, useRef } from 'react'

import { useApi } from '@/ui/global/hooks'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useInView, useRouter } from ''@/ui/global/hooks''
import { ROUTES } from '@/constants'
import { playAudio } from '@/utils'

type UseStarProps = {
  id: string
  slug: string
  isChallenge: boolean
  isLastUnlockedStar: boolean
  starAnimationRef: RefObject<AnimationRef>
}

export function useStar({
  id,
  isChallenge,
  slug,
  isLastUnlockedStar,
  starAnimationRef,
}: UseStarProps) {
  const { lastUnlockedStarRef, scrollIntoLastUnlockedStar, setLastUnlockedStarPosition } =
    useSpaceContext()
  const toast = useToastContext()
  const isFirstScroll = useRef(true)

  const router = useRouter()
  const api = useApi()
  const isInView = useInView(lastUnlockedStarRef)

  async function handleStarNavigation() {
    if (!isChallenge) {
      router.goTo(`${ROUTES.private.app.lesson}/${slug}`)
      return
    }

    const reponse = await api.fetchChallengeSlugByStarId(id)

    if (reponse.isFailure) {
      toast.show(reponse.errorMessage, {
        type: 'error',
        seconds: 4,
      })
      return
    }

    const challengeSlug = reponse.data
    router.goTo(`${ROUTES.private.app.challenge}/${challengeSlug}`)
  }

  function handleStarClick() {
    playAudio('star.wav')
    starAnimationRef.current?.restart()

    setTimeout(() => {
      handleStarNavigation()
    }, 50)
  }

  useEffect(() => {
    if (isLastUnlockedStar && isInView) {
      setLastUnlockedStarPosition('in')
    }
  }, [isLastUnlockedStar, isInView, setLastUnlockedStarPosition])

  useEffect(() => {
    if (isLastUnlockedStar && lastUnlockedStarRef.current && isFirstScroll.current) {
      setTimeout(() => {
        scrollIntoLastUnlockedStar()
        isFirstScroll.current = false
      }, 1500)
    }
  }, [isLastUnlockedStar, lastUnlockedStarRef, scrollIntoLastUnlockedStar])

  return {
    lastUnlockedStarRef,
    handleStarClick,
  }
}
