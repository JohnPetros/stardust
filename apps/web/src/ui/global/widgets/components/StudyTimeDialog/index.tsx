import { Button } from '../Button'
import * as Dialog from '../Dialog'
import { useStudyTimeDialog } from './useStudyTimeDialog'

type StudyTimeDialogProps = {
  onSelectTime: (time: string) => void
}

export const StudyTimeDialog = ({ onSelectTime }: StudyTimeDialogProps) => {
  const { handleTimeChange } = useStudyTimeDialog()

  return (
    <Dialog.Container>
      <Dialog.Content>
        <Dialog.Header>Escolha o seu melhor horário de estudos</Dialog.Header>
        <div className='space-y-6 mt-6'>
          <div className='w-24 mx-auto p-2 rounded-md border border-gray-400 text-gray-400 focus-within:border-green-400'>
            <input
              type='time'
              onChange={handleTimeChange}
              className='outline-none w-full bg-transparent'
            />
          </div>
          <Button>Confirmar</Button>
        </div>
      </Dialog.Content>
      <Dialog.Trigger>
        <Button className='w-72'>Ir para a página principal</Button>
      </Dialog.Trigger>
    </Dialog.Container>
  )
}
