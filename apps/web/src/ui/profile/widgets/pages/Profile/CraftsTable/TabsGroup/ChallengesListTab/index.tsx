import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengesListTabView } from './ChallengesListTabView'
import { useChallengesListTab } from './useChallengesListTab'
import type { TabListSorter } from '../../TabListSorter'

type Props = {
  userId: string
  tabListSorter: TabListSorter
}

export const ChallengesListTab = ({ userId, tabListSorter }: Props) => {
  const { challengingService } = useRestContext()
  const { challenges, isLoading, isReachedEnd, nextPage } = useChallengesListTab(
    challengingService,
    tabListSorter,
    userId,
  )
  return (
    <ChallengesListTabView
      challenges={challenges}
      isLoading={isLoading}
      isReachedEnd={isReachedEnd}
      onShowMore={nextPage}
    />
  )
}
