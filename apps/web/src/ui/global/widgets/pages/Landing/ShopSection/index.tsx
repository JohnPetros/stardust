import { SectionTitle } from '../SectionTitle'
import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedOpacity } from '../../../components/AnimatedOpacity'
import { Animation } from '../../../components/Animation'
import { AnimatedSpiral } from './AnimatedSpiral'

export function ShopSection() {
  return (
    <section id='shop'>
      <AnimatedOpacity delay={0.5} className='h-full w-full'>
        <Animation name='spiral' size='full' hasLoop={true} />
      </AnimatedOpacity>

      <SectionTitle>Adquire moedas e compre na loja</SectionTitle>

      <AnimatedSpiral>
        <AnimatedReveal>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quidem, alias
          ducimus voluptatum commodi distinctio nisi minima suscipit ipsa ex, illo quos in
          nobis itaque rerum, sint asperiores necessitatibus dolores.
        </AnimatedReveal>
      </AnimatedSpiral>
    </section>
  )
}
