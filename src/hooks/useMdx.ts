import { Text } from '@/@types/text'

export function useMdx() {
  function getProps(text: Text) {
    const props = Object.keys(text)
    const currentText: { [prop in string]: unknown } = text

    return props
      .filter((prop) => ['title', 'picture'].includes(prop))
      .map((prop) => `${prop}={'${currentText[prop]}'}`)
      .join(' ')
  }

  function getMdxComponent(text: Text) {
    const props = getProps(text)

    const content = text.content
    switch (text.type) {
      case 'default':
        return `<Text ${props} hasAnimation={undefined}>${content}</Text>`
      case 'alert':
        return `<Alert ${props} hasAnimation={undefined}>${content}</Alert>`
      case 'quote':
        return `<Quote ${props} hasAnimation={undefined}>${content}</Quote>`
      case 'image':
        return `<Image ${props} hasAnimation={undefined}>${content}</Image>`
      case 'user':
        return `<User ${props} hasAnimation={undefined}>${content}</User>`
      case 'code':
        return `<Code ${props} hasAnimation={undefined} isRunnable={${text.isRunnable}}>${content}</Code>`
      default:
        return `<Text ${props} hasAnimation={undefined}>${content}</Text>`
    }
  }

  function parseTexts(texts: Text[]) {
    return texts.map(getMdxComponent)
  }

  return {
    parseTexts,
  }
}
