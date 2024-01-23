import { CodeSnippet } from '../CodeSnippet'

import { Animation } from './Animation'

type CodeProps = {
  code: string
  isRunnable: boolean
  children: string | string[]
  hasAnimation: boolean
}

export function Code({
  isRunnable = true,
  children,
  hasAnimation = false,
}: CodeProps) {
  return (
    <Animation hasAnimation={hasAnimation}>
      <CodeSnippet
        code={Array.isArray(children) ? children[0] : children}
        isRunnable={isRunnable}
      />
    </Animation>
  )
}
