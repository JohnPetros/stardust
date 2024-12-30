import TsParticles from '@tsparticles/react'

import { useParticles } from './useParticles'
import { options } from './options'
import { memo } from 'react'

const ParticlesComponent = () => {
  const { isLoaded } = useParticles()

  // @ts-ignore
  return isLoaded && <TsParticles options={options} />
}

export const Particles = memo(ParticlesComponent)
