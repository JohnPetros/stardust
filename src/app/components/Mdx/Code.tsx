import { CodeSnippet } from '../CodeSnippet'

import { Animation } from './Animation'

type CodeProps = {
  code: string
  isRunnable: boolean
  children:
    | string
    | [{ props: { children: string | { props: { children: string } } } }]
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
        code={
          !Array.isArray(children)
            ? children
            : typeof children[0].props.children !== 'string' &&
              'props' in children[0].props.children
            ? children[0].props.children.props.children
            : children[0].props.children
        }
        isRunnable={isRunnable}
      />
    </Animation>
  )
}
