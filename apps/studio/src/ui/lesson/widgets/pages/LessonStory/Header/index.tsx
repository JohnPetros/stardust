import { useLoaderData } from 'react-router'
import { HeaderView } from './Headerview'
import type { clientLoader } from '@/app/routes/LessonStoryRoute'

export const Header = () => {
  const { starName, starNumber } = useLoaderData<typeof clientLoader>()

  return <HeaderView starName={starName} starNumber={starNumber} />
}
