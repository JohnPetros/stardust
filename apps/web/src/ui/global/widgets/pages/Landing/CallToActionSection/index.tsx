import { ROUTES } from '@/constants'
import { AnimatedBackground } from './AnimatedBackground'
import { AnimatedBorder } from '../../../components/AnimatedBorder'

export function CallToActionSection() {
  return (
    <section id='call-to-action' className='relative'>
      <AnimatedBackground>
        <h2>Pronto para a viagem?</h2>
        <AnimatedBorder>
          <a href={ROUTES.auth.signUp} className='text-gray-50 p-2'>
            Crie sua conta agora mesmo
          </a>
        </AnimatedBorder>
      </AnimatedBackground>
    </section>
  )
}
