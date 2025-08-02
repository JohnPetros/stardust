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

  if (code)
    return (
      <pre className='bg-gray-800 p-4 rounded-lg overflow-x-auto'>
        <code className='text-green-400 font-mono text-sm'>{code as string}</code>
      </pre>
    )
}
