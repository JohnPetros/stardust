import { Icon } from '@/ui/global/widgets/components/Icon'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/components/dialog'

import { GuideForm } from '../GuideForm'

type Props = {
  isFormOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (title: string) => void
}

export const CreateGuideCardView = ({ isFormOpen, onOpenChange, onCreate }: Props) => {
  return (
    <>
      <button
        type='button'
        onClick={() => onOpenChange(true)}
        className='flex items-center justify-center gap-2 h-full rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-4 transition-colors hover:border-primary hover:bg-zinc-800/50 group cursor-pointer'
      >
        <div className='flex items-center justify-center size-8 rounded-full bg-zinc-800 group-hover:bg-primary/10 transition-colors'>
          <Icon
            name='plus'
            className='size-4 text-zinc-400 group-hover:text-primary transition-colors'
          />
        </div>
        <span className='text-sm font-medium text-zinc-400 group-hover:text-primary transition-colors'>
          Criar guia
        </span>
      </button>

      <Dialog open={isFormOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar novo guia</DialogTitle>
          </DialogHeader>
          <GuideForm
            onSubmit={(title) => {
              onCreate(title)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
