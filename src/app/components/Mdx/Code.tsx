import { CodeSnippet } from '../Code/CodeSnippet'

import { Animation } from './Animation'

import { formatCode } from '@/utils/helpers/formatCode'

interface CodeProps {
  code: string
  isRunnable: boolean
  children: string
  hasAnimation: boolean
}

export function Code({ isRunnable, children, hasAnimation = true }: CodeProps) {
  console.log({ children })
  return (
    <Animation hasAnimation={hasAnimation}>
      <CodeSnippet
        code={formatCode(children, 'decode')}
        isRunnable={isRunnable}
      />
    </Animation>
  )
}
