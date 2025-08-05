import { CodeSnippet } from '../../CodeSnippet'

type Props = {
  code: string
  isRunnable: boolean
  exec: boolean
  children: unknown
  hasAnimation: boolean
}

export const CodeView = ({ children, isRunnable = false, exec = false }: Props) => {
  if (!children) return
  let code = ''

  if (!Array.isArray(children)) {
    code = String(children)
  } else if (typeof children[0] === 'string') {
    code = children[0]
  } else if (typeof children[0] === 'object') {
    if (typeof children[0].props.children === 'object') {
      code = children[0].props.children.props.children
    } else code = children[0].props.children
  }

  if (code) return <CodeSnippet code={code as string} isRunnable={isRunnable || exec} />
}
