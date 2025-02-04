import { Datetime } from '@stardust/core/libs'

import { ROUTES } from '@/constants'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import type { TabListSorter } from '../../TabListSorter'
import { NoRowsMessage } from '../NoRowsMessage'
import { useSolutionsListTab } from './useSolutionsListTab'
import { RowsSkeleton } from '../RowsSkeleton'
import * as Row from '../Row'
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

  if (isLoading) {
    return <RowsSkeleton />
  }

  if (!solutions.length) {
    return <NoRowsMessage />
  }

  return (
    <ul>
      {solutions.map((solution, index) => (
        <Row.Container
          key={solution.id}
          index={index}
          href={ROUTES.api.challenging.solution(solution.slug.value)}
          className='flex flex-col gap-2'
        >
          <Row.Title>{solution.title.value}</Row.Title>
          <CraftMetrics.Container>
            <CraftMetrics.Metric icon='calendar'>
              {new Datetime(solution.postedAt).getRelativeTime()}
            </CraftMetrics.Metric>
            <CraftMetrics.Metric icon='upvote'>
              {solution.upvotesCount.value}
            </CraftMetrics.Metric>
            <CraftMetrics.Metric icon='eye'>
              {solution.viewsCount.value}
            </CraftMetrics.Metric>
          </CraftMetrics.Container>
        </Row.Container>
      ))}
      {!isRecheadedEnd && (
        <ShowMoreButton isLoading={isLoading} onClick={nextPage} className='mt-3' />
      )}
    </ul>
  )
}
