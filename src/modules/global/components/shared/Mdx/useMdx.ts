import { useCallback } from 'react'
import { v4 as uuid } from 'uuid'

import type { TextBlock } from '@/@core/domain/structs'
import type { TextBlockDTO } from '@/@core/dtos'
import { REGEX } from '@/modules/global/constants'
import { getTemplateContent } from '@/modules/global/utils'
import { formatSpecialCharacters } from './formatSpecialCharacters'

export function useMdx() {
  function parseMdxToText(mdx: string) {
    const { betweenTwoAsterisks, betweenFourAsterisks } = REGEX
    const strongTemplate = '<span class="strong">$1</span>'

    return mdx
      .replace(betweenTwoAsterisks, strongTemplate)
      .replace(betweenFourAsterisks, strongTemplate)
  }

  const parseTextBlocksToMdx = useCallback((textBlocks: TextBlock[]) => {
    function getPropValue(prop: string, textBlockDTO: TextBlockDTO) {
      return textBlockDTO[prop as keyof TextBlockDTO]
    }

    function parseOrtherProps(textBlockDTO: TextBlockDTO) {
      const props = Object.keys(textBlockDTO)

      const otherProps = props.filter(
        (prop) =>
          ['title', 'picture'].includes(prop) &&
          getPropValue(prop, textBlockDTO) !== undefined,
      )

      return otherProps
        .map(
          (prop) =>
            `${prop}={'${
              prop === 'title'
                ? formatSpecialCharacters(String(textBlockDTO[prop]), 'encode')
                : getPropValue(prop, textBlockDTO)
            }'}`,
        )
        .join(' ')
    }

    function parseMdx(textBlock: TextBlock) {
      const props = parseOrtherProps(textBlock.dto)

      const content =
        textBlock.type !== 'code'
          ? formatSpecialCharacters(textBlock.content, 'encode')
          : textBlock.content

      const key = uuid()

      switch (textBlock.type) {
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
          return `<Code key={'${key}'} ${props} hasAnimation={false} isRunnable={${textBlock.isRunnable.value}}>${content}</Code>`
        default:
          return `<Text key={'${key}'} ${props} hasAnimation={false}>${content}</Text>`
      }
    }

    return textBlocks.map(parseMdx)
  }, [])

  function formatCodeContent(initialMdx: string) {
    let mdx = initialMdx

    const codeComponents = mdx.match(REGEX.mdxCodeComponent)

    if (!codeComponents) return mdx

    codeComponents.forEach((codeComponent) => {
      const codeComponentContent = getTemplateContent(codeComponent)
      const newContent = `\`\`\`\n${codeComponentContent}\n\`\`\``
      mdx = mdx.replace(codeComponentContent, newContent)
    })

    return mdx
  }

  return {
    parseMdxToText,
    parseTextBlocksToMdx,
    formatCodeContent,
  }
}
