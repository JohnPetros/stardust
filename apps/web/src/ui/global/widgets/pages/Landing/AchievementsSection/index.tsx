import Image from 'next/image'

import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedSection } from './AnimatedSection'

export function AchievementsSection() {
  return (
    <AnimatedSection title='Conquiste tudo'>
      <AnimatedReveal>
        Adquira emplemas e recompensas alcançando feitos incríveis no espaço. Seja
        completando <strong className='text-green-600'>planetas</strong>, resolvendo
        <strong className='text-green-600'>desafios de código</strong> ou mantendo sua{' '}
        <strong className='text-green-600'>sequencia espacial</strong>.
      </AnimatedReveal>
      <div className='w-full'>
        <Image src='/images/mountains.png' fill alt='Montanhas' />
      </div>
    </AnimatedSection>
  )
}
