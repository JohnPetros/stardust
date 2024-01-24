import { CodeSnippet } from '../CodeSnippet'

import { Animation } from './Animation'

type CodeProps = {
  code: string
  isRunnable: boolean
  children: string
  hasAnimation: boolean
}

export function Code({
  isRunnable = true,
  children,
  hasAnimation = false,
}: CodeProps) {
  const code = Array.isArray(children)
    ? children
        .map((component) => {
          if (typeof component === 'object' && 'props' in component)
            return component.props.children
          else return component
        })
        .join('\n')
    : children

  return (
    <Animation hasAnimation={hasAnimation}>
      <CodeSnippet code={code} isRunnable={isRunnable} />
    </Animation>
  )
}
