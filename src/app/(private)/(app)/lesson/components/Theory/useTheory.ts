'use client'

import { useEffect, useRef, useState } from 'react'

import { useLessonStore } from '@/stores/lessonStore'

type MdxComponent = {
  content: string
  hasAnimation: boolean
}

export function useTheory(compiledMdxComponets: string[]) {
  const incrementMdxComponentsAmount = useLessonStore(
    (store) => store.actions.incrementRenderedTextsAmount
  )

  const [mdxComponents, setMdxComponents] = useState<MdxComponent[]>([])
  const nextMdxComponentIndex = useRef(0)
  const hasNextMdxComponent =
    !!compiledMdxComponets[nextMdxComponentIndex.current + 1]

  function nextText() {
    if (!hasNextMdxComponent) return

    nextMdxComponentIndex.current = nextMdxComponentIndex.current + 1

    setMdxComponents(() => {
      const previousMdxComponents = mdxComponents.map((mdxComponent) => ({
        ...mdxComponent,
        hasAnimation: false,
      }))

      const nextText = {
        content: compiledMdxComponets[nextMdxComponentIndex.current],
        hasAnimation: true,
      }

      return [...previousMdxComponents, nextText]
    })

    incrementMdxComponentsAmount()
  }

  function handleContinueButtonClick() {
    nextText()
  }

  useEffect(() => {
    setMdxComponents([{ content: compiledMdxComponets[0], hasAnimation: true }])
    incrementMdxComponentsAmount()
  }, [compiledMdxComponets])

  return {
    mdxComponents,
    currentMdxComponentIndex: nextMdxComponentIndex.current - 1,
    hasNextMdxComponent,
    handleContinueButtonClick,
  }
}
