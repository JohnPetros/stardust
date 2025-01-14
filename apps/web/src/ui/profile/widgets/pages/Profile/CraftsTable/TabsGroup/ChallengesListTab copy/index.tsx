import { Datetime } from '@stardust/core/libs'

import { ROUTES } from '@/constants'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import type { TabListSorter } from '../../TabListSorter'
import { useChallengesListTab } from './useChallengesListTab'
import { Metric } from '../CraftMetrics'
import { Row } from '../Row'

type ChallengesListProps = {
  tabListSorter: TabListSorter
}

export function ChallengesListTab({ tabListSorter }: ChallengesListProps) {
  const { challenges, isRecheadedEnd, isLoading, nextPage } =
    useChallengesListTab(tabListSorter)

  return (
    <ul>
      {challenges.map((challenge, index) => (
        <Row
          key={challenge.id}
          index={index}
          href={ROUTES.challenging.challenges.challenge(challenge.slug.value)}
        >
          <strong className='text-gray-900 font-semibold'>{challenge.title.value}</strong>
          <div>
            <Metric icon='calendar'>
              {new Datetime(challenge.postedAt).getRelativeTime()}
            </Metric>
            <Metric icon='upvote'>{challenge.upvotesCount.value}</Metric>
          </div>
        </Row>
      ))}
      {isRecheadedEnd && (
        <ShowMoreButton isLoading={isLoading} onClick={nextPage} className='mt-3' />
      )}
    </ul>
  )
}
