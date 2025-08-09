import type { PropsWithChildren } from 'react'
import { useLoaderData } from 'react-router'

import type { clientLoader } from '@/app/routes/LessonStoryRoute'
import { PageHeaderView } from './PageHeaderView'

export const PageHeader = ({ children }: PropsWithChildren) => {
  const { starName, starNumber } = useLoaderData<typeof clientLoader>()

  return (
    <PageHeaderView starName={starName} starNumber={starNumber}>
      {children}
    </PageHeaderView>
  )
}
