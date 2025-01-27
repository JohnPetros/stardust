import { AnimatedAuroraBackground } from './AnimatedAuroraBackground'

export const Hero = () => {
  return (
    <AnimatedAuroraBackground>
      <div className='relative z-10 flex flex-col items-center'>
        <span className='mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm'>
          Beta
        </span>
        <h1 className='max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight'>
          <span className='text-green-400'>Star</span>
          <span className='text-green-700'>Dust</span>
        </h1>
        <p className='my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed'>
          Aprenda programação explorando o espaço.
        </p>
      </div>
    </AnimatedAuroraBackground>
  )
}
