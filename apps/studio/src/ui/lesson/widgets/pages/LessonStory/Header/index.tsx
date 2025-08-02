import { useLoaderData } from 'react-router'
import { HeaderView } from './Headerview'
import type { clientLoader } from '@/app/routes/LessonStoryRoute'
import type { PropsWithChildren } from 'react'

export const Header = ({ children }: PropsWithChildren) => {
  const { starName, starNumber } = useLoaderData<typeof clientLoader>()

  return (
    <HeaderView starName={starName} starNumber={starNumber}>
      {children}
    </HeaderView>
  )
}
