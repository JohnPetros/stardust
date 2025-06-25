'use client'

import { useEffect, useRef, useState } from 'react'

import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { StarRewardingPayload } from '@stardust/core/profile/types'
import { TextBlock } from '@stardust/core/global/structures'
import { Quiz, Story } from '@stardust/core/lesson/structures'

import { COOKIES, ROUTES, STORAGE } from '@/constants'
import { useLessonStore } from '@/ui/lesson/stores/LessonStore'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useSecondsCounter } from '@/ui/global/hooks/useSecondsCounter'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import { useMdx } from '@/ui/global/widgets/components/Mdx/hooks/useMdx'

export function useLessonPage(
  starId: string,
  questionsDto: QuestionDto[],
  textsBlocksDto: TextBlockDto[],
  storyContent: string,
) {
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const { getStageSlice, getQuizSlice, getStorySlice, resetStore } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const { stage } = getStageSlice()
  const { setStory } = getStorySlice()
  const { setCookie } = useCookieActions()
  const { parseTextBlocksToMdx } = useMdx()
  const router = useRouter()
  const secondsCounter = useLocalStorage(STORAGE.keys.secondsCounter)
  const scrollRef = useRef<HTMLDivElement>(null)
  useSecondsCounter(stage === 'quiz')

  function handleLeavePage() {
    localStorage.removeItem(STORAGE.keys.secondsCounter)
    resetStore()
    router.goTo(ROUTES.space)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitionVisible(false), 1000)

    const textBlocks = textsBlocksDto.map((dto) => {
      let textBlock = TextBlock.create(dto.type, dto.content)

      if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
      if (dto.title) textBlock = textBlock.setTitle(dto.title)
      if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)

      return textBlock
    })
    setStory(
      Story.create(
        storyContent ? storyContent.split('---') : parseTextBlocksToMdx(textBlocks),
      ),
    )
    setQuiz(Quiz.create(questionsDto))

    localStorage.removeItem(STORAGE.keys.secondsCounter)

    return () => {
      clearTimeout(timeout)
    }
  }, [
    textsBlocksDto,
    storyContent,
    questionsDto,
    setStory,
    setQuiz,
    parseTextBlocksToMdx,
  ])

  useEffect(() => {
    if (stage !== 'rewarding' || !quiz) return

    async function goToRewardingPage() {
      if (!quiz) return

      const rewardingPayload: StarRewardingPayload = {
        questionsCount: quiz.questionsCount,
        incorrectAnswersCount: quiz.incorrectAnswersCount.value,
        secondsCount: Number(secondsCounter.get()),
        starId,
      }

      await setCookie({
        key: COOKIES.keys.rewardingPayload,
        value: JSON.stringify(rewardingPayload),
      })
      localStorage.removeItem(STORAGE.keys.secondsCounter)
      resetStore()
      router.goTo(ROUTES.rewarding.star)
    }

    setQuiz(null)
    goToRewardingPage()
  }, [
    stage,
    quiz,
    router.goTo,
    secondsCounter.get,
    resetStore,
    setCookie,
    setQuiz,
    starId,
  ])

  return {
    scrollRef,
    stage,
    isTransitionVisible,
    handleLeavePage,
  }
}
