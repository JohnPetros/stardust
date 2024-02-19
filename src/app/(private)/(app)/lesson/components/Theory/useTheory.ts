'use client'

import { useEffect, useRef, useState } from 'react'

import { useLessonStore } from '@/stores/lessonStore'

type MdxComponent = {
  content: string
  hasAnimation: boolean
}

export function useTheory(allMdxComponents: string[]) {
  const incrementMdxComponentsCount = useLessonStore(
    (store) => store.actions.incrementRenderedMdxComponentsCount
  )

  const [parsedMdxComponents, setParsedMdxComponents] = useState<
    MdxComponent[]
  >([])
  const nextMdxComponentIndex = useRef(0)
  const hasNextMdxComponent =
    !!allMdxComponents[nextMdxComponentIndex.current + 1]

  function renderNextMdxComponent() {
    if (!hasNextMdxComponent) return

    nextMdxComponentIndex.current = nextMdxComponentIndex.current + 1

    setParsedMdxComponents(() => {
      const previousMdxComponents = parsedMdxComponents.map((mdxComponent) => ({
        ...mdxComponent,
        hasAnimation: false,
      }))

      const nextMdxComponent = {
        content: allMdxComponents[nextMdxComponentIndex.current],
        hasAnimation: true,
      }

      return [...previousMdxComponents, nextMdxComponent]
    })

    incrementMdxComponentsCount()
  }

  function handleContinueButtonClick() {
    renderNextMdxComponent()
  }

  useEffect(() => {
    setParsedMdxComponents([
      { content: allMdxComponents[0], hasAnimation: true },
    ])
    incrementMdxComponentsCount()
  }, [allMdxComponents[0]])

  return {
    parsedMdxComponents,
    currentMdxComponentIndex: nextMdxComponentIndex.current - 1,
    hasNextMdxComponent,
    handleContinueButtonClick,
  }
}
