import { CodeSnippet } from '../../CodeSnippet'

type Props = {
  code?: string
  isRunnable?: boolean
  exec?: boolean
  children?: unknown
  hasAnimation?: boolean
  onChange?: (code: string) => void
}

export const CodeView = ({
  code,
  children,
  isRunnable = false,
  exec = false,
  onChange,
}: Props) => {
  let resolvedCode = code ?? ''

  if (!resolvedCode && children) {
    if (!Array.isArray(children)) {
      resolvedCode = String(children)
    } else if (typeof children[0] === 'string') {
      resolvedCode = children[0]
    } else if (typeof children[0] === 'object') {
      if (typeof children[0].props.children === 'object') {
        resolvedCode = children[0].props.children.props.children
      } else resolvedCode = children[0].props.children
    }
  }

  if (!resolvedCode) return

  return (
    <CodeSnippet
      code={resolvedCode}
      isRunnable={isRunnable || exec}
      onChange={onChange}
    />
  )
}
