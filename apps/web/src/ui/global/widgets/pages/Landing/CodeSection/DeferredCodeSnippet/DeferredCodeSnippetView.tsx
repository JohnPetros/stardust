'use client'

import dynamic from 'next/dynamic'
import type { RefObject } from 'react'

const CodeSnippet = dynamic(
  () =>
    import('@/ui/global/widgets/components/CodeSnippet').then(
      (module) => module.CodeSnippet,
    ),
  {
    ssr: false,
    loading: () => <CodeSnippetPlaceholder />,
  },
)

export type Props = {
  code: string
  isRunnable: boolean
  estimatedHeight: number
  shouldLoad: boolean
  containerRef: RefObject<HTMLDivElement | null>
}

export function DeferredCodeSnippetView({
  code,
  isRunnable,
  estimatedHeight,
  shouldLoad,
  containerRef,
}: Props) {
  return (
    <div
      ref={containerRef}
      style={{ minHeight: estimatedHeight }}
      data-testid='deferred-code-snippet'
    >
      {shouldLoad ? (
        <CodeSnippet code={code} isRunnable={isRunnable} />
      ) : (
        <CodeSnippetPlaceholder />
      )}
    </div>
  )
}

function CodeSnippetPlaceholder() {
  return (
    <div
      className='h-full min-h-80 animate-pulse rounded-md border-2 border-gray-700 bg-gray-800'
      role='status'
      aria-label='Carregando editor de código'
    >
      <div className='flex justify-end gap-2 border-b border-gray-700 p-2'>
        <span className='h-6 w-20 rounded bg-gray-700' />
        <span className='h-6 w-20 rounded bg-gray-700' />
        <span className='h-6 w-20 rounded bg-gray-700' />
      </div>
    </div>
  )
}
