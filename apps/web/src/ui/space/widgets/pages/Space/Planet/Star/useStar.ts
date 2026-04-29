import { type RefObject, useEffect, useRef } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Id, Slug } from '@stardust/core/global/structures'
import type { LastUnlockedStarViewPortPosition } from '@/ui/space/contexts/SpaceContext/types'

import { ROUTES } from '@/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'

type Params = {
  starId: Id
  starSlug: Slug
  isLastUnlockedStar: boolean
  starAnimationRef: RefObject<AnimationRef | null>
  challengingService: ChallengingService
  lastUnlockedStarRef: RefObject<HTMLDivElement | null>
  lastUnlockedStarPosition: LastUnlockedStarViewPortPosition
  scrollIntoLastUnlockedStar: () => void
  setLastUnlockedStarPosition: (position: LastUnlockedStarViewPortPosition) => void
}

export function useStar({
  starId,
  starSlug,
  isLastUnlockedStar,
  starAnimationRef,
  challengingService,
  lastUnlockedStarRef,
  lastUnlockedStarPosition,
  scrollIntoLastUnlockedStar,
  setLastUnlockedStarPosition,
}: Params) {
  const { playAudio } = useAudioContext()
  const isFirstScroll = useRef(true)
  const navigationProvider = useNavigationProvider()
  const isInView = lastUnlockedStarPosition === 'in'

  function getLayoutSnapshot() {
    const starElement = lastUnlockedStarRef.current

    if (!starElement) {
      return null
    }

    const starRect = starElement.getBoundingClientRect()

    return [
      Math.round(starRect.top),
      Math.round(starRect.height),
      document.documentElement.scrollHeight,
    ].join(':')
  }

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
    let timeout: number | undefined

    if (isLastUnlockedStar && lastUnlockedStarRef.current && isFirstScroll.current) {
      let attempts = 0
      let stableIterations = 0
      let previousSnapshot = getLayoutSnapshot()

      const waitForStableLayout = () => {
        if (!lastUnlockedStarRef.current || !isFirstScroll.current) {
          return
        }

        const currentSnapshot = getLayoutSnapshot()

        if (!currentSnapshot) {
          return
        }

        attempts += 1

        if (currentSnapshot === previousSnapshot) {
          stableIterations += 1
        } else {
          previousSnapshot = currentSnapshot
          stableIterations = 0
        }

        if (stableIterations >= 2 || attempts >= 30) {
          scrollIntoLastUnlockedStar()
          isFirstScroll.current = false
          return
        }

        timeout = window.setTimeout(waitForStableLayout, 100)
      }

      timeout = window.setTimeout(waitForStableLayout, 100)
    }

    return () => window.clearTimeout(timeout)
  }, [isLastUnlockedStar, lastUnlockedStarRef, scrollIntoLastUnlockedStar])

  return {
    lastUnlockedStarRef,
    handleStarClick,
  }
}
