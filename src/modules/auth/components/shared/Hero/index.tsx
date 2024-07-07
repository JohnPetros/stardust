'use client'

import Image from 'next/image'

import { TypeWriter } from '@/global/components/TypeWriter'
import { useHero } from './useHero'

const CHARACTERS_DELETING_DELAY = 40 // miliseconds

export function Hero() {
  const { handleDeleteQuoteChar, quote } = useHero(CHARACTERS_DELETING_DELAY)

  return (
    <div className='w-[20rem] space-y-6'>
      <Image src='/images/logo.svg' width={280} height={280} priority alt='Estar Dâsti' />
      <p key={quote} className='h-8 max-w-[18rem] text-center text-base text-gray-100'>
        <TypeWriter
          text={quote}
          delay={100}
          deleteDelay={CHARACTERS_DELETING_DELAY}
          hasLoop={true}
          onDeleteChar={handleDeleteQuoteChar}
        />
      </p>
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
