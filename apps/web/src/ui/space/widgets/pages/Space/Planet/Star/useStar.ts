'use client'

import { type RefObject, useEffect, useRef } from 'react'

import { ROUTES } from '@/constants'
import { playAudio } from '@/utils'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { useInView } from '@/ui/global/hooks/useInView'
import { useRouter } from '@/ui/global/hooks/useRouter'

type UseStarProps = {
  id: string
  slug: string
  isChallenge: boolean
  isLastUnlockedStar: boolean
  starAnimationRef: RefObject<AnimationRef>
}

export function useStar({
  id,
  slug,
  isLastUnlockedStar,
  starAnimationRef,
}: UseStarProps) {
  const { lastUnlockedStarRef, scrollIntoLastUnlockedStar, setLastUnlockedStarPosition } =
    useSpaceContext()
  const isFirstScroll = useRef(true)
  const router = useRouter()
  const api = useApi()
  const isInView = useInView(lastUnlockedStarRef)

  async function handleStarNavigation() {
    const reponse = await api.fetchChallengeByStarId(id)

    if (reponse.isFailure) {
      router.goTo(ROUTES.lesson.star(slug))
      return
    }

    const challenge = reponse.body
    if (challenge.slug)
      router.goTo(ROUTES.challenging.challenges.challenge(challenge.slug))
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
