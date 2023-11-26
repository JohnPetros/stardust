import { CodeSnippet } from '../Code/CodeSnippet'

import { Animation } from './Animation'

interface CodeProps {
  code: string
  isRunnable: boolean
  children: string
  hasAnimation: boolean
}

export function Code({ isRunnable, children, hasAnimation = true }: CodeProps) {
  return (
    <Animation hasAnimation={hasAnimation}>
      <CodeSnippet code={children} isRunnable={isRunnable} />
    </Animation>
  )
}
