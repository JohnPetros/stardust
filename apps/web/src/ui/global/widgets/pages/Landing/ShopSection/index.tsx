import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedSection } from './AnimatedSection'
import { Paragraph } from '../Paragraph'

export function ShopSection() {
  return (
    <AnimatedSection title='Conquiste tudo'>
      <AnimatedReveal>
        <Paragraph className='text-xl'>Adquire moedas e compre itens na loja</Paragraph>
      </AnimatedReveal>
    </AnimatedSection>
  )
}
