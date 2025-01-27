import { AnimatedOpacity } from '../../../components/AnimatedOpacity'
import { AnimatedAuroraBackground } from './AnimatedAuroraBackground'

export const HeroSection = () => {
  return (
    <AnimatedAuroraBackground>
      <div className='relative z-10 flex flex-col items-center'>
        <AnimatedOpacity delay={1}>
          <span className='inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm'>
            Beta
          </span>
        </AnimatedOpacity>
        <AnimatedOpacity delay={1}>
          <h1 className='max-w-3xl mt-1 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight'>
            <span className='text-green-400'>Star</span>
            <span className='text-green-700'>Dust</span>
          </h1>
        </AnimatedOpacity>
        <AnimatedOpacity delay={1.5}>
          <p className='max-w-xl mt-3 text-center text-base leading-relaxed md:text-lg md:leading-relaxed'>
            Aprenda programação explorando o espaço.
          </p>
        </AnimatedOpacity>
      </div>
    </AnimatedAuroraBackground>
  )
}
