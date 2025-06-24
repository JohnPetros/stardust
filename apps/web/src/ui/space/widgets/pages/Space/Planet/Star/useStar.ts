import { type RefObject, useEffect, useRef } from 'react'

import { ROUTES } from '@/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useApi } from '@/ui/global/hooks/useApi'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'
import { useInView } from '@/ui/global/hooks/useInView'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useAudioContext } from '@/ui/global/contexts/AudioContext'
import { Id } from '@stardust/core/global/structures'

type UseStarProps = {
  id: string
  slug: string
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
  const { playAudio } = useAudioContext()
  const isFirstScroll = useRef(true)
  const router = useRouter()
  const api = useApi()
  const isInView = useInView(lastUnlockedStarRef)

  async function handleStarNavigation() {
    const reponse = await api.fetchChallengeByStarId(Id.create(id))

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
