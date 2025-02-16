import { ROUTES } from '@/constants'
import { AnimatedBackground } from './AnimatedBackground'
import { AnimatedBorder } from '../../../components/AnimatedBorder'

export function CallToActionSection() {
  return (
    <section id='call-to-action' className='relative max-w-6xl mx-auto'>
      <AnimatedBackground>
        <h2 className='text-green-500 font-mediun text-center text-xl'>
          Pronto(a) para a viagem?
        </h2>
        <a href={ROUTES.auth.signUp} className='text-gray-50'>
          <AnimatedBorder className='p-3'>Crie sua conta agora mesmo</AnimatedBorder>
        </a>
      </AnimatedBackground>
    </section>
  )
}
