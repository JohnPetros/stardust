import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'

type Props = {
  isDisabled: boolean
  onClick: () => Promise<void>
}

export const QuizActionButtonView = ({ isDisabled, onClick }: Props) => {
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: 'salvar?',
    executing: 'salvando...',
    default: 'salvar',
    success: 'salvo',
    failure: 'erro',
  }
  return (
    <ActionButton
      type='button'
      titles={ACTION_BUTTON_TITLES}
      isDisabled={isDisabled}
      onExecute={onClick}
      icon='edition'
      className='w-28'
    />
  )
}
