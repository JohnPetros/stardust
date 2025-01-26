'use client'

import type { Options } from 'typewriter-effect'
import type { TypeWriterProps } from '.'
import { SPECIAL_CHARACTERS } from '@/constants'

export function useTypeWriter({
  content,
  delay,
  deleteDelay,
  hasLoop,
  onDeleteChar,
}: Omit<TypeWriterProps, 'isEnable'>) {
  function formatSpecialCharacters(content: string | string[]) {
    let formattedContent = Array.isArray(content) ? content.join(' ') : content

    for (const [character, code] of Object.entries(SPECIAL_CHARACTERS)) {
      if (formattedContent.includes(code)) {
        formattedContent = formattedContent.replaceAll(code, `<span>${character}<span>`)
      }
    }

    return formattedContent
  }

  function handleDeleteChar() {
    if (onDeleteChar && hasLoop) {
      onDeleteChar()
    }
  }

  let options: Options = {
    delay,
    deleteSpeed: deleteDelay,
    skipAddStyles: true,
    loop: hasLoop,
  }

  if (onDeleteChar && hasLoop) {
    options = {
      ...options,
      onRemoveNode: () => handleDeleteChar(),
    }
  }

  return {
    options,
    formattedContent: formatSpecialCharacters(content),
  }
}
