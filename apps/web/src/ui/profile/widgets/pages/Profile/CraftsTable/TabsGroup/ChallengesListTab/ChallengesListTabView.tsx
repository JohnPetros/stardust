import { Datetime } from '@stardust/core/global/libs'
import type { Challenge } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { RowsSkeleton } from '../RowsSkeleton'
import { NoRowsMessage } from '../NoRowsMessage'
import * as Row from '../Row'
import * as CraftMetrics from '../CraftMetrics'

type Props = {
  isRecheadedEnd: boolean
  challenges: Challenge[]
  isLoading: boolean
  onShowMore: () => void
}

export const ChallengesListTabView = ({
  challenges,
  isRecheadedEnd,
  isLoading,
  onShowMore,
}: Props) => {
  if (isLoading) {
    return <RowsSkeleton />
  }
  if (!challenges.length) {
    return <NoRowsMessage>Você ainda não criou nenhum desafio ainda.</NoRowsMessage>
  }
  return (
    <ul>
      {challenges.map((challenge, index) => (
        <Row.Container
          key={challenge.id.value}
          index={index}
          href={ROUTES.challenging.challenges.challenge(challenge.slug.value)}
          className='flex flex-col gap-2'
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
        <ShowMoreButton isLoading={isLoading} onClick={onShowMore} className='mt-6' />
      )}
    </ul>
  )
}
