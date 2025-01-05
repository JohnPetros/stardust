import { Info } from '@/ui/global/widgets/components/Info'

type SolutionInfo = {
  upvotesCount: number
  viewsCount: number
  commentsCount: number
}

export function SolutionInfo({ upvotesCount, viewsCount, commentsCount }: SolutionInfo) {
  return (
    <ul className='flex items-center gap-3 border-b border-gray-700'>
      <li>
        <Info
          icon='upvote'
          label={upvotesCount}
          tooltipText='Número de usuários que deram upvote'
        />
      </li>
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
    </ul>
  )
}
