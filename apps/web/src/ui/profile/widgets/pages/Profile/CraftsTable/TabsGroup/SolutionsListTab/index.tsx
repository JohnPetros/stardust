import { Datetime } from '@stardust/core/libs'

import { ROUTES } from '@/constants'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import type { TabListSorter } from '../../TabListSorter'
import { useSolutionsListTab } from './useSolutionsListTab'
import { Metric } from '../CraftMetrics'
import { Row } from '../Row'
import * as CraftMetrics from '../CraftMetrics'

type ChallengesListProps = {
  userId: string
  tabListSorter: TabListSorter
}

export function SolutionsListTab({ tabListSorter, userId }: ChallengesListProps) {
  const { solutions, isRecheadedEnd, isLoading, nextPage } = useSolutionsListTab(
    tabListSorter,
    userId,
  )

  return (
    <ul>
      {solutions.map((solution, index) => (
        <Row
          key={solution.id}
          index={index}
          href={ROUTES.challenging.challenges.solution(solution.slug.value)}
        >
          <strong className='text-gray-900 font-semibold'>{solution.title.value}</strong>
          <CraftMetrics.Container>
            <CraftMetrics.Metric icon='calendar'>
              {new Datetime(solution.postedAt).getRelativeTime()}
            </CraftMetrics.Metric>
            <CraftMetrics.Metric icon='upvote'>
              {solution.upvotesCount.value}
            </CraftMetrics.Metric>
            <CraftMetrics.Metric icon='upvote'>
              {solution.viewsCount.value}
            </CraftMetrics.Metric>
          </CraftMetrics.Container>
        </Row>
      ))}
      {isRecheadedEnd && (
        <ShowMoreButton isLoading={isLoading} onClick={nextPage} className='mt-3' />
      )}
    </ul>
  )
}
