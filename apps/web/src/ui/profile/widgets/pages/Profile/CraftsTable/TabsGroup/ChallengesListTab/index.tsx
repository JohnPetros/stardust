import { useRest } from '@/ui/global/hooks/useRest'
import { ChallengesListTabView } from './ChallengesListTabView'
import { useChallengesListTab } from './useChallengesListTab'
import type { TabListSorter } from '../../TabListSorter'

type Props = {
  userId: string
  tabListSorter: TabListSorter
}

export const ChallengesListTab = ({ userId, tabListSorter }: Props) => {
  const { challengingService } = useRest()
  const { challenges, isLoading, isRecheadedEnd, nextPage } = useChallengesListTab(
    challengingService,
    tabListSorter,
    userId,
  )
  return (
    <ChallengesListTabView
      challenges={challenges}
      isLoading={isLoading}
      isRecheadedEnd={isRecheadedEnd}
      onShowMore={nextPage}
    />
  )
}
