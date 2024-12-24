import { useRef, useState } from 'react'

import { List } from '@stardust/core/global/structs'

import { QUOTES } from './quotes'

export function useHero(charactersDeletingDelay: number) {
  const [quote, setQuote] = useState(List.create(QUOTES).random)
  const deletedCharactersCount = useRef(0)
  const canDelete = useRef(true)

  async function handleDeleteQuoteChar() {
    if (canDelete.current)
      deletedCharactersCount.current = deletedCharactersCount.current + 1

    if (deletedCharactersCount.current === quote.length && canDelete.current) {
      canDelete.current = false

      await new Promise((resolve) => {
        setTimeout(() => {
          setQuote(List.create(QUOTES).random)
          deletedCharactersCount.current = 0
          canDelete.current = true
          resolve(true)
        }, quote.length * charactersDeletingDelay)
      })
    }
  }

  return {
    handleDeleteQuoteChar,
    quote,
  }
}
