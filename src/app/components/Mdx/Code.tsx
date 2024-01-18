import { CodeSnippet } from '../CodeSnippet'

import { Animation } from './Animation'

import { formatCode } from '@/utils/helpers/formatCode'

type CodeProps = {
  code: string
  isRunnable: boolean
  children: string
  hasAnimation: boolean
}

export function Code({
  isRunnable,
  children,
  hasAnimation = false,
}: CodeProps) {
  return (
    <Animation hasAnimation={hasAnimation}>
      <CodeSnippet
        code={formatCode(children, 'decode')}
        isRunnable={isRunnable}
      />
    </Animation>
  )
}
