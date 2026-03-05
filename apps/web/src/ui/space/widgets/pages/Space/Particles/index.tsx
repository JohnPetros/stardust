import dynamic from 'next/dynamic'

import { useParticles } from './useParticles'
import { options } from './options'
import { memo } from 'react'

const TsParticles = dynamic(
  () => import('@tsparticles/react').then((module) => module.default),
  {
    ssr: false,
  },
)

const ParticlesComponent = () => {
  const { isLoaded } = useParticles()

  // @ts-expect-error
  return isLoaded && <TsParticles options={options} />
}

export const Particles = memo(ParticlesComponent)
