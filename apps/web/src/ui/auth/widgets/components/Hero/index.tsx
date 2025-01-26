import Image from 'next/image'

import { TypeWriter } from '@/ui/global/widgets/components/TypeWriter'
import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { QUOTES } from './quotes'

export function Hero() {
  return (
    <div className='w-[20rem] space-y-6'>
      <Image src='/images/logo.svg' width={280} height={280} priority alt='Estar Dâsti' />
      <AnimatedOpacity
        delay={0.5}
        className='h-12 max-w-[18rem] text-center text-base text-gray-100'
      >
        <p>
          <TypeWriter content={QUOTES} delay={100} deleteDelay={50} hasLoop={true} />
        </p>
      </AnimatedOpacity>
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
