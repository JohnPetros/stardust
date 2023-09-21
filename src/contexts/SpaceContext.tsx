import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'
import { getImage } from '@/utils/functions'
import { useMotionValueEvent, useScroll } from 'framer-motion'
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

export type StarViewPortPosition = 'above' | 'in' | 'bellow'

interface SpaceContextValue {
  spaceRocket: SpaceRocket
  lastUnlockedStarRef: RefObject<HTMLLIElement>
  lastUnlockedStarPosition: StarViewPortPosition
  scrollIntoLastUnlockedStar: () => void
  setLastUnlockedStarPosition: (position: StarViewPortPosition) => void
}

interface SpaceContextProps {
  children: ReactNode
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children }: SpaceContextProps) {
  const { user } = useAuth()
  const { rocket } = useRocket(user?.rocket_id)
  const [spaceRocket, setSpaceRocket] = useState<SpaceRocket>({} as SpaceRocket)
  const [lastUnlockedStarPosition, setLastUnlockedStarPosition] =
    useState<StarViewPortPosition>('above')
  const lastUnlockedStarRef = useRef<HTMLLIElement>(null)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const starRect = lastUnlockedStarRef.current?.getBoundingClientRect()

    const starHeight = starRect?.height

    const starYPosition = starRect?.top

    if (!starYPosition || !starHeight) return

    if (starYPosition > window.innerHeight) setLastUnlockedStarPosition('above')

    if (starYPosition + starHeight < 0) setLastUnlockedStarPosition('bellow')

   
    console.log('Page scroll: ', latest)
  })

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
      value={{
        spaceRocket,
        lastUnlockedStarRef,
        lastUnlockedStarPosition,
        scrollIntoLastUnlockedStar,
        setLastUnlockedStarPosition,
      }}
    >
      {children}
    </SpaceContext.Provider>
  )
}
