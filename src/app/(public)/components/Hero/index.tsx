'use client'

import Image from 'next/image'

import { useHero } from './useHero'

import { TypeWriter } from '@/app/components/TypeWriter'

export function Hero() {
  const { handleDeleteQuoteChar, quote } = useHero()

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
