import { Button } from '@/ui/shadcn/components/button'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  onClick: () => void
}

export const UndoQuestionChangeButtonView = ({ onClick }: Props) => {
  return (
    <Tooltip content='Desfazer alterações'>
      <Button variant='outline' size='icon' className='ml-auto' onClick={onClick}>
        <Icon name='reload' />
      </Button>
    </Tooltip>
  )
}
