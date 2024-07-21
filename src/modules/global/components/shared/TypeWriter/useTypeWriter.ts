'use client'

import type { Options } from 'typewriter-effect'
import type { TypeWriterProps } from '.'
import { SPECIAL_CHARACTERS } from '@/modules/global/constants'

export function useTypeWriter({
  text,
  delay,
  deleteDelay,
  hasLoop,
  onDeleteChar,
}: Omit<TypeWriterProps, 'isEnable'>) {
  function formatSpecialCharacters(text: string) {
    let formattedText = text

    for (const [character, code] of Object.entries(SPECIAL_CHARACTERS)) {
      if (formattedText.includes(code)) {
        formattedText = formattedText.replaceAll(code, `<span>${character}<span>`)
      }
    }

    return formattedText
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
    options = { ...options, onRemoveNode: () => handleDeleteChar() }
  }

  return {
    options,
    formattedText: formatSpecialCharacters(text),
  }
}
