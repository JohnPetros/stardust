import TsParticles from '@tsparticles/react'

import { useParticles } from './useParticles'
import { options } from './options'

export function Particles() {
  const { isLoaded } = useParticles()

  // @ts-ignore
  return isLoaded && <TsParticles options={options} />
}
