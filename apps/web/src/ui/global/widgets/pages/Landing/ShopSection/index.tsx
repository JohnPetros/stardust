import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedSection } from './AnimatedSection'
import { Paragraph } from '../Paragraph'

export function ShopSection() {
  return (
    <div>
      <AnimatedSection title='Conquiste tudo'>
        <AnimatedReveal>
          <Paragraph className='lg:text-xl text-lg'>
            Adquire moedas e compre itens na loja{' '}
            <span className='text-green-400 text-3xl'>.</span>
          </Paragraph>
        </AnimatedReveal>
      </AnimatedSection>
    </div>
  )
}
