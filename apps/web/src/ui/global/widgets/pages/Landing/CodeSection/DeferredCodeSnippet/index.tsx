'use client'

import { DeferredCodeSnippetView } from './DeferredCodeSnippetView'
import { useDeferredCodeSnippet } from './useDeferredCodeSnippet'

type Props = {
  code: string
  isRunnable?: boolean
}

export function DeferredCodeSnippet({ code, isRunnable = false }: Props) {
  const { containerRef, shouldLoad } = useDeferredCodeSnippet()
  const linesCount = code.split('\n').length
  const estimatedHeight = isRunnable
    ? 100 + linesCount * (linesCount >= 10 ? 20 : 32)
    : linesCount * (linesCount >= 10 ? 24 : 32)

  return (
    <DeferredCodeSnippetView
      code={code}
      isRunnable={isRunnable}
      estimatedHeight={estimatedHeight}
      shouldLoad={shouldLoad}
      containerRef={containerRef}
    />
  )
}
