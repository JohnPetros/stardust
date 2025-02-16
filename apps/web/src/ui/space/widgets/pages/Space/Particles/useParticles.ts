import { useEffect, useState } from 'react'
import { initParticlesEngine } from '@tsparticles/react'
import { loadBasic } from '@tsparticles/basic'

export function useParticles() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadBasic(engine)
    }).then(() => {
      setIsLoaded(true)
    })
  }, [])

  return {
    isLoaded,
  }
}
