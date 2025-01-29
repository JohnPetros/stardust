import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedSection } from './AnimatedSection'
import { Paragraph } from '../Paragraph'

export function AchievementsSection() {
  return (
    <AnimatedSection title='Conquiste tudo'>
      <AnimatedReveal>
        <Paragraph className='text-2xl'>
          Adquira emplemas e recompensas alcançando feitos incríveis no espaço. Seja
          completando <strong className='text-green-600 font-medium'>planetas</strong>,
          resolvendo{' '}
          <strong className='text-green-600 font-medium'>desafios de código</strong> ou
          mantendo sua{' '}
          <strong className='text-green-600 font-medium'>sequencia espacial</strong>.
        </Paragraph>
      </AnimatedReveal>
    </AnimatedSection>
  )
}
