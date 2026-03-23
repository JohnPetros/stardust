import { Icon } from '@/ui/global/widgets/components/Icon'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'

type Props = {
  canNavigateToPrevious: boolean
  canNavigateToNext: boolean
  onPreviousChallengeClick: () => void
  onNextChallengeClick: () => void
}

const TOOLTIP_CONTENT =
  'Navegacao sequencial pela ordem global de criacao dos desafios (ignora filtros).'

export const ChallengeNavigationView = ({
  canNavigateToPrevious,
  canNavigateToNext,
  onPreviousChallengeClick,
  onNextChallengeClick,
}: Props) => {
  return (
    <div className='flex h-10 items-center rounded-md border border-gray-700 bg-gray-950/80'>
      <div className='flex items-center gap-2 px-3'>
        <Icon name='menu' size={14} className='text-gray-500' />
        <span className='text-sm font-semibold text-blue-100'>Desafios</span>
      </div>

      <div className='h-full w-px bg-gray-700' />

      <Tooltip direction='bottom' content={TOOLTIP_CONTENT}>
        <button
          type='button'
          onClick={onPreviousChallengeClick}
          disabled={!canNavigateToPrevious}
          className='grid h-full w-10 place-content-center text-gray-300 transition-colors hover:bg-gray-900 hover:text-gray-50 disabled:cursor-not-allowed disabled:opacity-35'
          aria-label='Ir para desafio anterior'
        >
          <Icon name='simple-arrow-left' size={16} />
        </button>
      </Tooltip>

      <div className='h-full w-px bg-gray-700' />

      <Tooltip direction='bottom' content={TOOLTIP_CONTENT}>
        <button
          type='button'
          onClick={onNextChallengeClick}
          disabled={!canNavigateToNext}
          className='grid h-full w-10 place-content-center text-gray-300 transition-colors hover:bg-gray-900 hover:text-gray-50 disabled:cursor-not-allowed disabled:opacity-35'
          aria-label='Ir para proximo desafio'
        >
          <Icon name='simple-arrow-right' size={16} />
        </button>
      </Tooltip>
    </div>
  )
}
