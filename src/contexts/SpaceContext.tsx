import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'
import { getImage } from '@/utils/functions'
import {
  ReactNode,
  RefObject,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type SpaceRocket = {
  name: string
  image: string
}

interface SpaceContextValue {
  spaceRocket: SpaceRocket
  scrollIntoLastUnlockedStar: () => void
  lastUnlockedStarRef: RefObject<HTMLLIElement>
}

interface SpaceContextProps {
  children: ReactNode
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children }: SpaceContextProps) {
  const { user } = useAuth()
  const { rocket } = useRocket(user?.rocket_id)
  const [spaceRocket, setSpaceRocket] = useState<SpaceRocket>({} as SpaceRocket)
  const [isLastUnlockedStarAboveLayout, setIsLastUnlockedStarAboveLayout] =
    useState(false)
  const lastUnlockedStarRef = useRef<HTMLLIElement>(null)

  function scrollIntoLastUnlockedStar() {
    const starOffsetHeight = lastUnlockedStarRef.current?.offsetHeight
    const starTopPosition =
      lastUnlockedStarRef.current?.getBoundingClientRect().top

    if (starTopPosition && starOffsetHeight) {
      const starPosition =
        starTopPosition - (window.innerHeight - starOffsetHeight) / 2

      window.scrollTo({
        top: starPosition,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    if (rocket?.image && rocket?.name) {
      const rocketImage = getImage('rockets', rocket.image)

      setSpaceRocket({ image: rocketImage, name: rocket.name })
    }
  }, [rocket, user])

  return (
    <SpaceContext.Provider
      value={{ spaceRocket, lastUnlockedStarRef, scrollIntoLastUnlockedStar }}
    >
      {children}
    </SpaceContext.Provider>
  )
}
