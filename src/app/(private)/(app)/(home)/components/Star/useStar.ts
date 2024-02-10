'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { Star } from '@/@types/Star'
import { useSpaceContext } from '@/contexts/SpaceContext/hooks/useSpaceContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { ROUTES } from '@/global/constants'
import { playAudio } from '@/global/helpers'
import { useApi } from '@/services/api'

export function useStar(
  { id, slug, isChallenge }: Pick<Star, 'id' | 'slug' | 'isChallenge'>,
  isLastUnlockedStar: boolean
) {
  const {
    spaceRocket,
    lastUnlockedStarRef,
    scrollIntoLastUnlockedStar,
    setLastUnlockedStarPosition,
  } = useSpaceContext()
  const starRef = useRef(null) as LottieRef

  const router = useRouter()
  const api = useApi()
  const isInView = useInView(lastUnlockedStarRef)

  const toast = useToastContext()

  async function handleStarNavigation() {
    if (isChallenge) {
      try {
        const challengeSlug = await api.getChallengeSlugByStarId(id)
        router.push(`${ROUTES.private.challenge}/${challengeSlug}`)
      } catch (error) {
        console.log(error)
        toast.show('Falha ao tentar acessar o desafio', {
          type: 'error',
          seconds: 4,
        })
      }
    } else {
      router.push(`${ROUTES.private.lesson}/${slug}`)
    }
  }

  function handleStarClick() {
    playAudio('star.wav')
    starRef.current?.goToAndPlay(0)

    setTimeout(() => {
      handleStarNavigation()
    }, 50)
  }

  // TODO: Fix useEffect dependencies
  useEffect(() => {
    if (isLastUnlockedStar && isInView) {
      setLastUnlockedStarPosition('in')
    }
  }, [isLastUnlockedStar, isInView, setLastUnlockedStarPosition])

  useEffect(() => {
    if (isLastUnlockedStar && lastUnlockedStarRef.current) {
      setTimeout(() => {
        scrollIntoLastUnlockedStar()
      }, 1500)
    }
  }, [isLastUnlockedStar, lastUnlockedStarRef])

  return {
    starRef,
    lastUnlockedStarRef,
    spaceRocket,
    handleStarClick,
  }
}
