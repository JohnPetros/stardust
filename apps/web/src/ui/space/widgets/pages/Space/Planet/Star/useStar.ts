import { type RefObject, useEffect, useRef } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Id, Slug } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'
import { useInView } from '@/ui/global/hooks/useInView'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'

type Params = {
  starId: Id
  starSlug: Slug
  isLastUnlockedStar: boolean
  starAnimationRef: RefObject<AnimationRef | null>
  challengingService: ChallengingService
}

export function useStar({
  starId,
  starSlug,
  isLastUnlockedStar,
  starAnimationRef,
  challengingService,
}: Params) {
  const { lastUnlockedStarRef, scrollIntoLastUnlockedStar, setLastUnlockedStarPosition } =
    useSpaceContext()
  const { playAudio } = useAudioContext()
  const isFirstScroll = useRef(true)
  const navigationProvider = useNavigationProvider()
  const isInView = useInView(lastUnlockedStarRef)

  async function handleStarNavigation() {
    const reponse = await challengingService.fetchChallengeByStarId(starId)

    if (reponse.isFailure) {
      navigationProvider.goTo(ROUTES.lesson.star(starSlug.value))
      return
    }

    const challenge = reponse.body
    if (challenge.slug)
      navigationProvider.goTo(ROUTES.challenging.challenges.challenge(challenge.slug))
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
    let timeout: NodeJS.Timeout

    if (isLastUnlockedStar && lastUnlockedStarRef.current && isFirstScroll.current) {
      timeout = setTimeout(() => {
        scrollIntoLastUnlockedStar()
        isFirstScroll.current = false
      }, 1500)
    }
    return () => clearTimeout(timeout)
  }, [isLastUnlockedStar, lastUnlockedStarRef, scrollIntoLastUnlockedStar])

  return {
    lastUnlockedStarRef,
    handleStarClick,
  }
}
