'use client'

import { useState } from 'react'
import Image from 'next/image'

import { TypeWriter } from '@/app/components/Text/TypeWriter'
import { QUOTES } from '@/utils/constants'
import { getRandomItem } from '@/utils/constants/getRandom'

let deletedCharactersAmount = 0

export function Hero() {
  const [quote, setQuote] = useState(getRandomItem<string>(QUOTES))

  function handleDeleteQuoteChar() {
    deletedCharactersAmount += 1

    if (deletedCharactersAmount === quote.length) {
      deletedCharactersAmount = 0
      setQuote(getRandomItem<string>(QUOTES))
    }
  }

  return (
    <div className="w-[20rem] space-y-6">
      <Image
        src="/images/logo.svg"
        width={280}
        height={280}
        priority
        alt="Estar Dâsti"
      />
      <p
        key={quote}
        className="h-8 max-w-[18rem] text-center text-base text-gray-100"
      >
        <TypeWriter
          text={quote}
          delay={100}
          deleteDelay={40}
          hasLoop={true}
          onDeleteChar={handleDeleteQuoteChar}
        />
      </p>
      <Image
        src="/images/rocket.svg"
        width={280}
        height={280}
        priority
        alt="Rocket"
      />
    </div>
  )
}
