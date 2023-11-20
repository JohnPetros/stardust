import type { Text } from '@/@types/text'

function getProps(text: Text) {
  const props = Object.keys(text)
  const currentText: { [prop in string]: unknown } = text

  return props
    .filter((prop) => ['title', 'picture'].includes(prop))
    .map((prop) => `${prop}={'${currentText[prop]}'}`)
    .join(' ')
}

export function parseTextToMdx(text: Text, hasAnimation: boolean) {
  const props = getProps(text)

  switch (text.type) {
    case 'default':
      return `<Text ${props} hasAnimation={${hasAnimation}}>${text.content}</Text>`
    case 'alert':
      return `<Alert ${props} hasAnimation={${hasAnimation}}>${text.content}</Alert>`
    case 'quote':
      return `<Quote ${props} hasAnimation={${hasAnimation}}>${text.content}</Quote>`
    default:
      return `<Text ${props} hasAnimation={${hasAnimation}}>${text.content}</Text>`
  }
}
