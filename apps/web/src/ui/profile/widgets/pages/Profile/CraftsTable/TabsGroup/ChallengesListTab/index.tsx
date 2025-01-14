import { Datetime } from '@stardust/core/libs'

import { ROUTES } from '@/constants'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import type { TabListSorter } from '../../TabListSorter'
import { useChallengesListTab } from './useChallengesListTab'
import { RowsSkeleton } from '../RowsSkeleton'
import * as Row from '../Row'
import * as CraftMetrics from '../CraftMetrics'
import { NoRowsMessage } from '../NoRowsMessage'

type ChallengesListProps = {
  userId: string
  tabListSorter: TabListSorter
}

export function ChallengesListTab({ tabListSorter, userId }: ChallengesListProps) {
  const { challenges, isRecheadedEnd, isLoading, nextPage } = useChallengesListTab(
    tabListSorter,
    userId,
  )

  if (isLoading) {
    return <RowsSkeleton />
  }

  if (!challenges.length) {
    return <NoRowsMessage />
  }

  return (
    <ul>
      {challenges.map((challenge, index) => (
        <Row.Container
          key={challenge.id}
          index={index}
          href={ROUTES.challenging.challenges.challenge(challenge.slug.value)}
        >
          <Row.Title>{challenge.title.value}</Row.Title>
          <CraftMetrics.Container>
            <CraftMetrics.Metric icon='calendar'>
              {new Datetime(challenge.postedAt).getRelativeTime()}
            </CraftMetrics.Metric>
            <CraftMetrics.Metric icon='upvote'>
              {challenge.upvotesCount.value}
            </CraftMetrics.Metric>
          </CraftMetrics.Container>
        </Row.Container>
      ))}
      {!isRecheadedEnd && (
        <ShowMoreButton isLoading={isLoading} onClick={nextPage} className='mt-6' />
      )}
    </ul>
  )
}
