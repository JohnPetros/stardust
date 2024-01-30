import { Text } from '@/@types/text'
import { REGEX } from '@/utils/constants'
import { getComponentContent } from '@/utils/helpers'

export function useMdx() {
  function getProps(text: Text) {
    const props = Object.keys(text)
    const currentText: { [prop in string]: unknown } = text

    return props
      .filter((prop) => ['title', 'picture'].includes(prop))
      .map((prop) => `${prop}={'${currentText[prop]}'}`)
      .join(' ')
  }

  function getMdxComponent(text: Text, index: number) {
    const props = getProps(text)

    const content = text.content
    switch (text.type) {
      case 'default':
        return `<Text key=${index} ${props} hasAnimation={false}>${content}</Text>`
      case 'alert':
        return `<Alert key=${index} ${props} hasAnimation={false}>${content}</Alert>`
      case 'quote':
        return `<Quote key=${index} ${props} hasAnimation={false}>${content}</Quote>`
      case 'image':
        return `<Image key=${index} ${props} hasAnimation={false}>${content}</Image>`
      case 'user':
        return `<User key=${index} ${props} hasAnimation={false}>${content}</User>`
      case 'code':
        return `<Code key=${index} ${props} hasAnimation={false} isRunnable={${text.isRunnable}}>${content}</Code>`
      default:
        return `<Text key=${index} ${props} hasAnimation={false}>${content}</Text>`
    }
  }

  function parseTexts(texts: Text[]) {
    return texts.map(getMdxComponent)
  }

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
    parseTexts,
    formatCodeComponentsContent,
  }
}
