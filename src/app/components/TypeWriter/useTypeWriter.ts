'use client'

import { Options } from 'typewriter-effect'

import { TypeWriterProps } from '.'

export function useTypeWriter({
  delay,
  deleteDelay,
  hasLoop,
  onDeleteChar,
}: Omit<TypeWriterProps, 'text' | 'isEnable'>) {
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
  }
}
