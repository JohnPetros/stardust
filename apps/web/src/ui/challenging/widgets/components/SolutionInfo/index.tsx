import { Info } from '@/ui/global/widgets/components/Info'
import { Datetime } from '@stardust/core/libs'

type SolutionInfo = {
  upvotesCount?: number
  viewsCount: number
  commentsCount: number
  createdAt: Date
}

export function SolutionInfo({
  upvotesCount,
  viewsCount,
  commentsCount,
  createdAt,
}: SolutionInfo) {
  const date = new Datetime(createdAt).format('MMM D, YYYY')

  return (
    <ul className='flex items-center gap-3 border-b border-gray-700'>
      {upvotesCount && (
        <li>
          <Info
            icon='upvote'
            label={upvotesCount}
            tooltipText='Número de usuários que deram upvote'
          />
        </li>
      )}
      <li>
        <Info icon='eye' label={viewsCount} tooltipText='Número de visualizações' />
      </li>
      <li>
        <Info
          icon='comment'
          label={commentsCount}
          tooltipText={'Número de comentários'}
        />
      </li>
      <li>
        <Info
          icon='calendar'
          label={commentsCount}
          tooltipText={`Data de postagem - ${date}`}
        />
      </li>
    </ul>
  )
}
