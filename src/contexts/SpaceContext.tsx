import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'
import { getImage } from '@/utils/functions'
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react'

type SpaceRocket = {
  name: string
  image: string
}

interface SpaceContextValue {
  spaceRocket: SpaceRocket
}

interface SpaceContextProps {
  children: ReactNode
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children }: SpaceContextProps) {
  const { user } = useAuth()
  const { rocket } = useRocket(user?.rocket_id)
  const [spaceRocket, setSpaceRocket] = useState<SpaceRocket>({} as SpaceRocket)

  useEffect(() => {
    if (rocket?.image && rocket?.name) {
      const rocketImage = getImage('rockets', rocket.image)

      setSpaceRocket({ image: rocketImage, name: rocket.name })
    }
  }, [rocket, user])

  return (
    <SpaceContext.Provider value={{ spaceRocket }}>
      {children}
    </SpaceContext.Provider>
  )
}
