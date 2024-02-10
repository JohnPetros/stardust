import { useCallback } from 'react'
import { v4 as uuid } from 'uuid'

import { Text } from '@/@types/Text'
import { REGEX } from '@/global/constants'
import { formatSpecialCharacters, getComponentContent } from '@/global/helpers'

export function useMdx() {
  const parseTextsToMdxComponents = useCallback((texts: Text[]) => {
    function getProps(text: Text) {
      const props = Object.keys(text)
      const currentText: { [prop in string]: unknown } = text

      return props
        .filter((prop) => ['title', 'picture'].includes(prop))
        .map(
          (prop) =>
            `${prop}={'${
              prop === 'title'
                ? formatSpecialCharacters(String(currentText[prop]), 'encode')
                : currentText[prop]
            }'}`
        )
        .join(' ')
    }

    function getMdxComponent(text: Text) {
      const props = getProps(text)

      const content =
        text.type !== 'code'
          ? formatSpecialCharacters(text.content, 'encode')
          : text.content

      const key = uuid()

      switch (text.type) {
        case 'default':
          return `<Text key={'${key}'} ${props} hasAnimation={false}>${content}</Text>`
        case 'alert':
          return `<Alert key={'${key}'} ${props} hasAnimation={false}>${content}</Alert>`
        case 'quote':
          return `<Quote key={'${key}'} ${props} hasAnimation={false}>${content}</Quote>`
        case 'image':
          return `<Image key={'${key}'} ${props} hasAnimation={false}>${content}</Image>`
        case 'user':
          return `<User key={'${key}'} ${props} hasAnimation={false}>${content}</User>`
        case 'code':
          return `<Code key={'${key}'} ${props} hasAnimation={false} isRunnable={${text.isRunnable}}>${content}</Code>`
        default:
          return `<Text key={'${key}'} ${props} hasAnimation={false}>${content}</Text>`
      }
    }

    return texts.map(getMdxComponent)
  }, [])

  function formatCodeComponentsContent(initialMdx: string) {
    let mdx = initialMdx

    const codeComponents = mdx.match(REGEX.mdxCodeComponent)

    if (!codeComponents) return mdx

    codeComponents.forEach((codeComponent) => {
      const codeComponentContent = getComponentContent(codeComponent)
      const newContent = `\`\`\`\n${codeComponentContent}\n\`\`\``
      mdx = mdx.replace(codeComponentContent, newContent)
    })

    return mdx
  }

  return {
    parseTextsToMdxComponents,
    formatCodeComponentsContent,
  }
}
