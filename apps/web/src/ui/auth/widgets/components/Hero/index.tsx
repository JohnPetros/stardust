'use client'

import Image from 'next/image'

import { useHero } from './useHero'
import { TypeWriter } from '@/ui/global/widgets/components/TypeWriter'
import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'

const CHARACTERS_DELETING_DELAY = 40 // miliseconds

export function Hero() {
  const { handleDeleteQuoteChar, quotes, activeQuoteIndex } = useHero()

  return (
    <div className='w-[20rem] space-y-6'>
      <Image src='/images/logo.svg' width={280} height={280} priority alt='Estar Dâsti' />
      {quotes.map((quote, quoteIndex) => (
        <AnimatedOpacity
          key={quote}
          isVisible={activeQuoteIndex === quoteIndex}
          delay={0.5}
        >
          <p
            key={quote}
            className='h-8 max-w-[18rem] text-center text-base text-gray-100'
          >
            <TypeWriter
              text={quote}
              delay={100}
              deleteDelay={CHARACTERS_DELETING_DELAY}
              hasLoop={true}
              onDeleteChar={handleDeleteQuoteChar}
            />
          </p>
        </AnimatedOpacity>
      ))}
      <Image
        src='/images/rocket.svg'
        width={280}
        height={280}
        priority
        alt='Foguete com tons esverdeados rodeado de estrelas flututando para cima e para baixo repetidamente.'
      />
    </div>
  )
}
