import { useState } from 'react'

import { QUOTES } from '@/utils/constants'
import { getRandomItem } from '@/utils/helpers/getRandomItem'

let deletedCharactersAmount = 0

export function useHero() {
  const [quote, setQuote] = useState(getRandomItem<string>(QUOTES))

  function handleDeleteQuoteChar() {
    deletedCharactersAmount += 1

    if (deletedCharactersAmount === quote.length) {
      deletedCharactersAmount = 0
      setQuote(getRandomItem<string>(QUOTES))
    }
  }

  return {
    handleDeleteQuoteChar,
    quote,
  }
}
