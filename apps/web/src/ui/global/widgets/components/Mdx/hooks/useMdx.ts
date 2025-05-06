import { useCallback } from 'react'
import { v4 as uuid } from 'uuid'

import type { TextBlock } from '@stardust/core/global/structures'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

import { REGEX } from '@/constants'
import { formatSpecialCharacters } from '../formatSpecialCharacters'

export function useMdx() {
  function parseMdxToText(mdx: string) {
    const { betweenTwoAsterisks, betweenFourAsterisks } = REGEX
    const strongTemplate = '<strong class="strong">$1</strong>'

    return mdx
      .replace(betweenTwoAsterisks, strongTemplate)
      .replace(betweenFourAsterisks, strongTemplate)
  }

  const parseTextBlocksToMdx = useCallback((textBlocks: TextBlock[]) => {
    function getPropValue(prop: string, textBlockDto: TextBlockDto) {
      return textBlockDto[prop as keyof TextBlockDto]
    }

    function parseOrtherProps(textBlockDto: TextBlockDto) {
      const props = Object.keys(textBlockDto)

      const otherProps = props.filter((prop) => {
        return (
          ['title', 'picture'].includes(prop) &&
          getPropValue(prop, textBlockDto) !== undefined
        )
      })

      return otherProps
        .map(
          (prop) =>
            `${prop}={'${
              prop === 'title'
                ? formatSpecialCharacters(String(textBlockDto[prop]), 'encode')
                : getPropValue(prop, textBlockDto)
            }'}`,
        )
        .join(' ')
    }

    function parseMdx(textBlock: TextBlock) {
      const props = parseOrtherProps(textBlock.dto)
      const content = textBlock.content
      const key = uuid()

      switch (textBlock.type) {
        case 'default':
          return `<Text key={'${key}'} ${props} hasAnimation={false}>${formatSpecialCharacters(content, 'encode')}</Text>`
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

  function getTemplateContent(component: string) {
    const nameMatch = REGEX.componentName.exec(component)
    const componentName = nameMatch ? nameMatch[1] : 'Text'

    const componentRegex = new RegExp(
      `<${componentName}[^>]*>([\\s\\S]*?)</${componentName}>`,
      'g',
    )

    const contentMatch = componentRegex.exec(component)
    if (contentMatch !== null) {
      return contentMatch[1]
    }

    return ''
  }

  function formatCodeContent(initialMdx: string) {
    let mdx = initialMdx

    const codeComponents = mdx.match(REGEX.mdxCodeComponent)

    if (!codeComponents) return mdx

    codeComponents.forEach((codeComponent) => {
      const codeComponentContent = getTemplateContent(codeComponent)
      if (codeComponentContent) {
        const newContent = `\`\`\`
${codeComponentContent}\`\`\``
        mdx = mdx.replace(codeComponentContent, newContent)
      }
    })

    return mdx
  }

  return {
    parseMdxToText,
    parseTextBlocksToMdx,
    formatCodeContent,
  }
}
