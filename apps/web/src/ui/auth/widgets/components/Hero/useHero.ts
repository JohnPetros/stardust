import { useRef, useState } from 'react'

import { List } from '@stardust/core/global/structs'

import { QUOTES } from './quotes'

export function useHero() {
  const listOfIndexes = List.createListOfNumbers(0, QUOTES.length - 1)
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(listOfIndexes.random)
  const deletedCharactersCount = useRef(0)

  async function handleDeleteQuoteChar() {
    deletedCharactersCount.current = deletedCharactersCount.current + 1
    const activeQuote = QUOTES[activeQuoteIndex]

    if (activeQuote && deletedCharactersCount.current === activeQuote.length) {
      setActiveQuoteIndex(listOfIndexes.random)
    }
  }

  return {
    activeQuoteIndex,
    quotes: QUOTES,
    handleDeleteQuoteChar,
  }
}
