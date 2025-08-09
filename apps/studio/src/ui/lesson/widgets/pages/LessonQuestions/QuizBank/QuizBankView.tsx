import type { QuestionType } from '@stardust/core/lesson/types'

import { Button } from '@/ui/shadcn/components/button'

type Props = {
  onSelectQuestion: (questionType: QuestionType) => void
}

export const QuizBankView = ({ onSelectQuestion }: Props) => {
  return (
    <div>
      <p>Clique em um tipo de questão abaixo para adicioná-lo.</p>
      <ul className='flex flex-col gap-2 mt-3'>
        <li>
          <Button
            className='w-full bg-zinc-800 border border-zinc-700'
            onClick={() => onSelectQuestion('selection')}
          >
            Seleção
          </Button>
        </li>
        <li>
          <Button
            className='w-full bg-zinc-800 border border-zinc-700'
            onClick={() => onSelectQuestion('open')}
          >
            Aberta
          </Button>
        </li>
        <li>
          <Button
            className='w-full bg-zinc-800 border border-zinc-700'
            onClick={() => onSelectQuestion('checkbox')}
          >
            Checkbox
          </Button>
        </li>
        <li>
          <Button
            className='w-full bg-zinc-800 border border-zinc-700'
            onClick={() => onSelectQuestion('drag-and-drop-list')}
          >
            Ordenação
          </Button>
        </li>
        <li>
          <Button
            className='w-full bg-zinc-800 border border-zinc-700'
            onClick={() => onSelectQuestion('drag-and-drop')}
          >
            Arrastar e soltar
          </Button>
        </li>
      </ul>
    </div>
  )
}
