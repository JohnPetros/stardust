import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  isUserSolutionAuthor: boolean
  textStyle: string
  upvotesCount: number
  handleButtonClick: () => void
}

export const UpvoteSolutionButtonView = ({
  isUserSolutionAuthor,
  textStyle,
  upvotesCount,
  handleButtonClick,
}: Props) => {
  return (
    <div className='flex items-center justify-center gap-1'>
      <button
        type='button'
        onClick={handleButtonClick}
        disabled={isUserSolutionAuthor}
        className={
          'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
        }
      >
        <Icon name='upvote' weight='bold' size={16} className={textStyle} />
        <span className={textStyle}>{upvotesCount}</span>
      </button>
    </div>
  )
}
