import { Button } from '../Button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../Dialog'
import { useStudyTimeDialog } from './useStudyTimeDialog'

type StudyTimeDialogProps = {
  onSelectTime: (time: string) => void
}

export function StudyTimeDialog({ onSelectTime }: StudyTimeDialogProps) {
  const { handleTimeChange } = useStudyTimeDialog()

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Escolha o seu melhor horário de estudos</DialogHeader>
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
      </DialogContent>
      <DialogTrigger>
        <Button className='w-72'>Ir para a página principal</Button>
      </DialogTrigger>
    </Dialog>
  )
}
