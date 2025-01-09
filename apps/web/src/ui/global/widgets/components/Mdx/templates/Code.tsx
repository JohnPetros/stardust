import { CodeSnippet } from '../../CodeSnippet'
import { Animation } from './Animation'

type CodeProps = {
  code: string
  isRunnable: boolean
  children: string | [{ props: { children?: string | { props: { children: string } } } }]
  hasAnimation: boolean
}

export function Code({ children, isRunnable = true, hasAnimation = true }: CodeProps) {
  if (!children) return

  const code = children[0]
  if (code)
    return (
      <Animation hasAnimation={hasAnimation}>
        <CodeSnippet
          code={(code as string).replaceAll('\n\n', '\n')}
          isRunnable={isRunnable}
        />
      </Animation>
    )
}
