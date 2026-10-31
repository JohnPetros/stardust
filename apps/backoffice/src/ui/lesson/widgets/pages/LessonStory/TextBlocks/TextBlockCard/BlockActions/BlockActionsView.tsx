import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

import { Button } from '@/ui/shadcn/components/button'
import { AlertMessageComponent } from '@/ui/shadcn/components/alert-message-dialog'

type Props = {
  isExpanded: boolean
  hasPicture: boolean
  onExpand: () => void
  onRemove: () => void
}

export const BlockActionsView = ({ isExpanded, onExpand, onRemove }: Props) => {
  return (
    <div className='flex items-center gap-2'>
      <Button type='button' variant='ghost' size='icon' onClick={onExpand}>
        {isExpanded ? (
          <ChevronUp className='h-4 w-4' />
        ) : (
          <ChevronDown className='h-4 w-4' />
        )}
      </Button>
      <AlertMessageComponent
        message='Você tem certeza que deseja remover este bloco?'
        onConfirm={onRemove}
      >
        <Button type='button' variant='ghost' size='icon'>
          <Trash2 className='h-4 w-4 text-red-400' />
        </Button>
      </AlertMessageComponent>
    </div>
  )
}
