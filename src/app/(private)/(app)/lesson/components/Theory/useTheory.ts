'use client'

import { useEffect, useRef, useState } from 'react'

import type { Text as TextData } from '@/@types/text'
import { useLessonStore } from '@/stores/lessonStore'

export function useTheory() {
  const { state, actions } = useLessonStore()
  const [texts, setTexts] = useState<TextData[]>([])
  const nextTextIndex = useRef(0)
  const hasNextText = !!state.texts[nextTextIndex.current + 1]

  function nextText() {
    if (!hasNextText) return

    nextTextIndex.current = nextTextIndex.current + 1

    setTexts(() => {
      const previousTexts = texts.map((text) => ({
        ...text,
        hasAnimation: false,
      }))

      const nextText = {
        ...state.texts[nextTextIndex.current],
        hasAnimation: true,
      }

      return [...previousTexts, nextText]
    })

    actions.incrementRenderedTextsAmount()
  }

  function handleContinueButtonClick() {
    nextText()
  }

  useEffect(() => {
    setTexts([{ ...state.texts[0], hasAnimation: true }])
    actions.incrementRenderedTextsAmount()
  }, [state.texts, actions])

  return {
    texts,
    nextTextIndex,
    hasNextText,
    handleContinueButtonClick,
  }
}
