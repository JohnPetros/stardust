import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'
import { getImage } from '@/utils/functions'
import { ReactNode, createContext } from 'react'

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
  const rocketImage = rocket?.image ? getImage('rockets', rocket.image) : ''
  const rocketName = rocket?.name ?? ''

  return (
    <SpaceContext.Provider value={{ rocketImage, rocketName }}>
      {children}
    </SpaceContext.Provider>
  )
}
