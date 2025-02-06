import { CodeSnippet } from '../../CodeSnippet'
import { Animation } from './Animation'

type CodeProps = {
  code: string
  isRunnable: boolean
  exec: boolean
  children: unknown
  hasAnimation: boolean
}

export function Code({
  children,
  isRunnable = true,
  exec = false,
  hasAnimation = true,
}: CodeProps) {
  if (!children) return
  let code = ''

  if (!Array.isArray(children)) {
    code = String(children)
  } else if (typeof children[0] === 'string') {
    code = children[0]
  } else if ('props' in children[0]) {
    code = children[0].props.children[0]
    code = children.map((child) => child.props.children[0]).join('\n')
  }

  if (code)
    return (
      <Animation hasAnimation={hasAnimation}>
        <CodeSnippet code={code as string} isRunnable={isRunnable || exec} />
      </Animation>
    )
}
