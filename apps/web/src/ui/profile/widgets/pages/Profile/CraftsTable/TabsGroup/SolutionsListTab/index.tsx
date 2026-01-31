import { useRestContext } from '@/ui/global/hooks/useRestContext'
import type { TabListSorter } from '../../TabListSorter'
import { useSolutionsListTab } from './useSolutionsListTab'
import { SolutionsListTabView } from './SolutionsListTabView'

type Props = {
  userId: string
  tabListSorter: TabListSorter
}

export function SolutionsListTab({ tabListSorter, userId }: Props) {
  const { challengingService } = useRestContext()
  const { solutions, isReachedEnd, isLoading, nextPage } = useSolutionsListTab(
    challengingService,
    tabListSorter,
    userId,
  )
  return (
    <SolutionsListTabView
      isLoading={isLoading}
      solutions={solutions}
      isReachedEnd={isReachedEnd}
      onShowMore={nextPage}
    />
  )
}
