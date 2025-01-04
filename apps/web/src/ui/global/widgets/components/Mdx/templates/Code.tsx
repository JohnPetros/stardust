import { CodeSnippet } from '../../CodeSnippet'
import { Animation } from './Animation'

type CodeProps = {
  code: string
  isRunnable: boolean
  children: string | [{ props: { children: string | { props: { children: string } } } }]
  hasAnimation: boolean
}

export function Code({ children, isRunnable = true, hasAnimation = true }: CodeProps) {
  let code: unknown

  if (!Array.isArray(children)) {
    code = children
  } else if (
    children.length > 0 &&
    typeof children[0]?.props.children !== 'string' &&
    'props' in children[0].props.children
  ) {
    code = children[0].props.children.props.children
  } else if (children.length > 0) {
    code = children[0].props.children
  }

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
