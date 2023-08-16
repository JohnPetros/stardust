import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'
import { getImage } from '@/utils/functions'
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react'

interface SpaceContextValue {
  rocketImage: string
  rocketName: string
}

interface SpaceContextProps {
  children: ReactNode
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children }: SpaceContextProps) {
  const { user } = useAuth()
  const { rocket } = useRocket(user?.rocket_id)
  const [value, setValue] = useState({} as SpaceContextValue)

  useEffect(() => {
    
    if (rocket?.image && rocket?.name) {
      const rocketImage = getImage('rockets', rocket.image)

      setValue({ rocketImage, rocketName: rocket.name })
    }
  }, [rocket, user])

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}
