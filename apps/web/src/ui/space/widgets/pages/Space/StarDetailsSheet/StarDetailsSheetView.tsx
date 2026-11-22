import { Drawer } from 'vaul'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { StarDetails } from '../StarDetails'

export type Props = {
  isOpen: boolean
  onClose: () => void
}

export function StarDetailsSheetView({ isOpen, onClose }: Props) {
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(isDrawerOpen) => {
        if (!isDrawerOpen) onClose()
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 z-[500] bg-gray-950/70' />
        <Drawer.Content className='fixed inset-x-0 bottom-0 z-[500] rounded-t-theme border-t border-theme-border-quiet bg-theme-surface outline-none'>
          <Drawer.Title className='sr-only'>Detalhes da estrela</Drawer.Title>
          <Drawer.Description className='sr-only'>
            Informações e ação da estrela selecionada
          </Drawer.Description>
          <button
            type='button'
            aria-label='Fechar detalhes da estrela'
            onClick={onClose}
            className='absolute right-4 top-4 grid h-11 w-11 place-content-center rounded-theme border border-theme-border-quiet bg-theme-background text-theme-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme-action'
          >
            <Icon name='close' size={20} />
          </button>
          <StarDetails variant='flat' />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
