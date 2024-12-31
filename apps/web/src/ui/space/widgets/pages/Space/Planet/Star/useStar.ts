'use client'

import { type RefObject, useEffect, useRef } from 'react'

import { useApi } from '@/ui/global/hooks'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useInView, useRouter } from '@/ui/global/hooks'
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
    const reponse = await api.fetchChallengeByStarId(id)

    if (reponse.isFailure) {
      router.goTo(`${ROUTES.lesson.prefix}/${slug}`)
      return
    }

    const challenge = reponse.body
    router.goTo(`${ROUTES.challenging.challenge}/${challenge.slug}`)
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
