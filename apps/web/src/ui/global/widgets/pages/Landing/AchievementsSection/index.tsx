import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedSection } from './AnimatedSection'
import { Paragraph } from '../Paragraph'

export function AchievementsSection() {
  return (
    <AnimatedSection title='Conquiste tudo'>
      <AnimatedReveal>
        <Paragraph className='text-2xl'>Adquire moedas e compre itens na loja</Paragraph>
      </AnimatedReveal>
    </AnimatedSection>
  )
}
