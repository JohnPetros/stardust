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
  console.log(children)

  const code = Array.isArray(children)
    ? children
        .map((component) => {
          const isComponent =
            typeof component === 'object' && 'props' in component

          if (isComponent) {
            const componentContent = component.props.children
              ? component.props.children[0]
              : ''

            const isSpan = component.type === 'span'

            return isSpan ? componentContent : componentContent + '\n'
          } else return component
        })
        .join('\n')
    : children

  return (
    <Animation hasAnimation={hasAnimation}>
      <CodeSnippet code={code} isRunnable={isRunnable} />
    </Animation>
  )
}
