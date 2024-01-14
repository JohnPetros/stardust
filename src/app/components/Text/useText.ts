'use client'

import { useEffect, useRef, useState } from 'react'

import type { Text } from '@/@types/text'
import { MdxRef } from '@/app/components/Mdx'

export function useText(text: Text) {
  const [content, setContent] = useState('')
  const textRef = useRef<HTMLDivElement>(null)
  const mdxRef = useRef<MdxRef>(null)

  function getProps(text: Text) {
    const props = Object.keys(text)
    const currentText: { [prop in string]: unknown } = text

    return props
      .filter((prop) => ['title', 'picture'].includes(prop))
      .map((prop) => `${prop}={'${currentText[prop]}'}`)
      .join(' ')
  }

  useEffect(() => {
    function parseTextToMdx() {
      const props = getProps(text)

      switch (text.type) {
        case 'default':
          return `<Text ${props} hasAnimation={${text.hasAnimation}}>${text.content}</Text>`
        case 'alert':
          return `<Alert ${props} hasAnimation={${text.hasAnimation}}>${text.content}</Alert>`
        case 'quote':
          return `<Quote ${props} hasAnimation={${text.hasAnimation}}>${text.content}</Quote>`
        case 'image':
          return `<Image ${props} hasAnimation={${text.hasAnimation}}>${text.content}</Image>`
        case 'user':
          return `<User ${props} hasAnimation={${text.hasAnimation}}>${text.content}</User>`
        case 'code':
          return `<Code ${props} isRunnable={${text.isRunnable}} hasAnimation={${text.hasAnimation}}>${text.content}</Code>`
        default:
          return `<Text ${props} hasAnimation={${text.hasAnimation}}>${text.content}</Text>`
      }
    }

    if (text.hasAnimation && textRef.current) {
      textRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }

    const content = parseTextToMdx()

    console.log(text)

    setContent(content)
  }, [text, mdxRef.current?.isLoaded])

  return {
    content,
    textRef,
    mdxRef,
  }
}
