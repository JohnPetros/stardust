import { useRef, useState } from 'react'

import { QUOTES } from './quotes'

import { getRandomItem } from '@/utils/getRandomItem'

export function useHero(charactersDeletingDelay: number) {
  const [quote, setQuote] = useState(getRandomItem<string>(QUOTES))
  const deletedCharactersCount = useRef(0)
  const canDelete = useRef(true)

  async function handleDeleteQuoteChar() {
    if (canDelete.current)
      deletedCharactersCount.current = deletedCharactersCount.current + 1

    if (deletedCharactersCount.current === quote.length && canDelete.current) {
      canDelete.current = false

      await new Promise((resolve) => {
        setTimeout(() => {
          setQuote(getRandomItem<string>(QUOTES))
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
