import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { QuestionType } from '@stardust/core/lesson/types'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Sortable } from '@/ui/global/widgets/components/Sortable'
import { Button } from '@/ui/shadcn/components/button'
import { cn } from '@/ui/shadcn/utils'
import { ConfirmDialog } from '@/ui/global/widgets/components/ConfirmDialog'

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  selection: 'Seleção',
  open: 'Aberta',
  checkbox: 'Checkbox',
  'drag-and-drop-list': 'Arrastar e soltar',
  'drag-and-drop': 'Arrastar e soltar',
}

type Props = {
  questions: QuestionDto[]
  selectedQuestionIndex: number
  onSelectQuestion: (questionIndex: number) => void
  onRemoveQuestion: (questionIndex: number) => void
  onDragEnd: (originItemIndex: number, targetItemIndex: number) => void
}

export const QuizArrangerView = ({
  questions,
  selectedQuestionIndex,
  onSelectQuestion,
  onRemoveQuestion,
  onDragEnd,
}: Props) => {
  return (
    <div className='space-y-2'>
      <p className='text-zinc-100'>
        Clique no tipo de questão para editá-lo ou defina a ordem em que as questões
        aparecem.
      </p>

      <Sortable.Container
        key={questions.length}
        itemCount={questions.length}
        onDragEnd={onDragEnd}
      >
        {(items) =>
          items.map((item, index) => {
            const questionIndex = item
            const isSelected = selectedQuestionIndex === questionIndex
            return (
              <Sortable.Item key={item} id={item.toString()}>
                <button
                  type='button'
                  onClick={() => onSelectQuestion(questionIndex)}
                  className={cn(
                    'flex h-10 w-full items-center rounded-md px-3 border border-zinc-700 bg-zinc-800',
                    'text-zinc-100',
                    isSelected && 'border-primary',
                  )}
                >
                  <span className='w-full'>
                    {QUESTION_TYPE_LABELS[questions[questionIndex].type as QuestionType]}
                  </span>
                  <div className='flex items-center'>
                    <ConfirmDialog
                      title='Remover questão'
                      description='Tem certeza que deseja remover a questão?'
                      onConfirm={() => onRemoveQuestion(questionIndex)}
                    >
                      <Button
                        variant='ghost'
                        size='icon'
                        className={cn(
                          'opacity-0 pointer-events-none',
                          isSelected && 'opacity-100 pointer-events-auto',
                        )}
                      >
                        <Icon name='trash' />
                      </Button>
                    </ConfirmDialog>
                    <span>{index + 1}</span>
                  </div>
                </button>
              </Sortable.Item>
            )
          })
        }
      </Sortable.Container>
    </div>
  )
}
