import { useEffect, useState } from 'react'

export function useParticles() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function initializeParticles() {
      const [{ initParticlesEngine }, { loadBasic }] = await Promise.all([
        import('@tsparticles/react'),
        import('@tsparticles/basic'),
      ])

      await initParticlesEngine(async (engine) => {
        await loadBasic(engine)
      })

      setIsLoaded(true)
    }

    void initializeParticles()
  }, [])

  return {
    isLoaded,
  }
}
