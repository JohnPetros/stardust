'use client'

import { type RefObject, useEffect, useRef } from 'react'

import { useApi } from '@/infra/api'
import { useSpaceContext } from '@/modules/app/contexts/SpaceContext'
import { useToastContext } from '@/modules/global/contexts/ToastContext'
import type { AnimationRef } from '@/modules/global/components/shared/Animation/types'
import { useInView, useRouter } from '@/modules/global/hooks'
import { ROUTES } from '@/modules/global/constants'
import { playAudio } from '@/modules/global/utils'

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
