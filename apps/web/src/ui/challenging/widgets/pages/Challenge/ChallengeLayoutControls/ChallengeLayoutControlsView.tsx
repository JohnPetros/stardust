import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'

export type Props = {
  panelOrder: DockablePanelId[]
  onResetLayout: () => void
}

export const ChallengeLayoutControlsView = ({ panelOrder, onResetLayout }: Props) => {
  return (
    <div className='hidden md:block'>
      <Tooltip content='Restaurar layout padrão' direction='bottom'>
        <button
          type='button'
          aria-label={`Restaurar layout padrão (${panelOrder.length} painéis)`}
          onClick={onResetLayout}
          className='grid h-7 w-7 place-content-center rounded-md text-gray-300 transition-colors hover:bg-gray-800 hover:text-green-400'
        >
          <Icon name='layout' size={18} />
        </button>
      </Tooltip>
    </div>
  )
}
