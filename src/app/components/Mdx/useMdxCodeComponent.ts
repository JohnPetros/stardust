'use client'

export function useMdxCodeComponent(content: unknown) {
  let code = ''

  if (Array.isArray(content)) {
    for (const component of content) {
      const isRegularComponent =
        typeof component === 'object' && 'props' in component

      if (isRegularComponent) {
        if (!component.props.children) continue

        const componentContent = component.props.children[0]

        const isSpan = component.type === 'span'

        code += isSpan ? componentContent : componentContent + '\n'
        return
      }
    }
  }
  code += String(content) + '\n'

  return code
}
