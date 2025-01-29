import { SectionTitle } from '../SectionTitle'
import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedSpiral } from './AnimatedSpiral'

export function ShopSection() {
  return (
    <section id='shop'>
      <SectionTitle>Conquiste tudo</SectionTitle>
      <AnimatedSpiral>
        <AnimatedReveal>
          Adquira emplemas e recompensas alcançando feitos incríveis no espaço. Seja
          completando <strong className='text-green-600 font-medium'>planetas</strong>,
          resolvendo{' '}
          <strong className='text-green-600 font-medium'>desafios de código</strong> ou
          mantendo sua{' '}
          <strong className='text-green-600 font-medium'>sequencia espacial</strong>.
        </AnimatedReveal>
      </AnimatedSpiral>
    </section>
  )
}
