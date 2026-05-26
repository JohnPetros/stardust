import { CodeSnippet } from '../../CodeSnippet'
import { Animation } from '../Animation'
import type { LessonCodeExplanation } from '../../CodeSnippet'

type CodeProps = {
  code?: string
  isRunnable?: boolean
  exec?: boolean
  children?: unknown
  hasAnimation?: boolean
  lessonCodeExplanation?: LessonCodeExplanation
  onChange?: (code: string) => void
}

export const CodeView = ({
  code: initialCode = '',
  children,
  isRunnable = false,
  exec = false,
  hasAnimation = true,
  lessonCodeExplanation,
  onChange,
}: CodeProps) => {
  let code = initialCode

  if (!code && children && !Array.isArray(children)) {
    code = String(children)
  } else if (!code && Array.isArray(children) && typeof children[0] === 'string') {
    code = children[0]
  } else if (!code && Array.isArray(children) && typeof children[0] === 'object') {
    if (typeof children[0].props.children === 'object') {
      code = children[0].props.children.props.children
    } else code = children[0].props.children
  }

  if (code || onChange)
    return (
      <Animation hasAnimation={hasAnimation}>
        <CodeSnippet
          code={code as string}
          isRunnable={isRunnable || exec}
          lessonCodeExplanation={lessonCodeExplanation}
          onChange={onChange}
        />
      </Animation>
    )
}
