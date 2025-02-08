import Image from 'next/image'
import { GoBackLink } from './GoBackLink'

export function SnippetPageHero() {
  return (
    <div className='relative flex w-max flex-col items-center gap-12'>
      <div className='absolute top-0 -left-12'>
        <GoBackLink />
      </div>
      <Image
        src='/images/rocket.svg'
        width={160}
        height={160}
        priority
        alt='Foguete com tons esverdeados rodeado de estrelas flututando para cima e para baixo repetidamente.'
      />
      <div className='flex -translate-y-3 items-center gap-3'>
        <Image
          src='/images/logo.svg'
          width={180}
          height={180}
          priority
          alt='Estar Dâsti'
        />
        <h1 className='text-xl text-green-400'>Playground</h1>
      </div>
    </div>
  )
}
