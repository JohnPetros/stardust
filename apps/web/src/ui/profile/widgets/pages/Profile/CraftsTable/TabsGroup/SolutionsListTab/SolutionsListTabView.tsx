import { Datetime } from '@stardust/core/global/libs'
import type { Solution } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { NoRowsMessage } from '../NoRowsMessage'
import { RowsSkeleton } from '../RowsSkeleton'
import * as Row from '../Row'
import * as CraftMetrics from '../CraftMetrics'

type Props = {
  isLoading: boolean
  solutions: Solution[]
  isRecheadedEnd: boolean
  onShowMore: () => void
}

export const SolutionsListTabView = ({
  isLoading,
  solutions,
  isRecheadedEnd,
  onShowMore,
}: Props) => {
  if (isLoading) {
    return <RowsSkeleton />
  }
  if (!solutions.length) {
    return <NoRowsMessage>Você ainda não criou nenhuma solução ainda.</NoRowsMessage>
  }
  return (
    <ul>
      {solutions.map((solution, index) => (
        <Row.Container
          key={solution.id.value}
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
        <ShowMoreButton isLoading={isLoading} onClick={onShowMore} className='mt-3' />
      )}
    </ul>
  )
}
