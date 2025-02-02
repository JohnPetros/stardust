import { SectionTitle } from '../SectionTitle'
import { AnimatedReveal } from '../AnimatedReveal'
import { AnimatedSpiral } from './AnimatedSpiral'
import { Paragraph } from '../Paragraph'
import { Animation } from '../../../components/Animation'

export function AchievementsSection() {
  return (
    <section id='shop' className='max-w-6xl mx-auto'>
      <SectionTitle>Conquiste tudo</SectionTitle>
      <AnimatedSpiral>
        <AnimatedReveal>
          <Paragraph>
            Adquira emblemas e recompensas alcançando feitos incríveis no espaço. Seja
            completando <strong className='text-green-600 font-medium'>estrelas</strong>,
            resolvendo{' '}
            <strong className='text-green-600 font-medium'>desafios de código</strong> ou
            mantendo sua{' '}
            <strong className='text-green-600 font-medium'>sequência espacial</strong>.
          </Paragraph>
        </AnimatedReveal>
      </AnimatedSpiral>
    </section>
  )
}
