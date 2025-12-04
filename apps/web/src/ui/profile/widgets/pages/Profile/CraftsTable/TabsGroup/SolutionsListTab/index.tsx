import { useRest } from '@/ui/global/hooks/useRest'
import type { TabListSorter } from '../../TabListSorter'
import { useSolutionsListTab } from './useSolutionsListTab'
import { SolutionsListTabView } from './SolutionsListTabView'

type Props = {
  userId: string
  tabListSorter: TabListSorter
}

export function SolutionsListTab({ tabListSorter, userId }: Props) {
  const { challengingService } = useRest()
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
