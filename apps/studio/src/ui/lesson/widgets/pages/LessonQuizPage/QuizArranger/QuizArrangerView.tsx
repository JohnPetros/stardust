import type { QuestionType } from '@stardust/core/lesson/types'
import type { Question } from '@stardust/core/lesson/abstracts'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Sortable } from '@/ui/global/widgets/components/Sortable'
import { Button } from '@/ui/shadcn/components/button'
import { cn } from '@/ui/shadcn/utils'
import { ConfirmDialog } from '@/ui/global/widgets/components/ConfirmDialog'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  selection: 'Seleção',
  open: 'Aberta',
  checkbox: 'Checkbox',
  'drag-and-drop-list': 'Ordenação',
  'drag-and-drop': 'Arrastar e soltar',
}

type Props = {
  questions: SortableItem<Question>[]
  selectedQuestionIndex: number
  onSelectQuestion: (questionIndex: number) => void
  onRemoveQuestion: (questionIndex: number) => void
  onDragEnd: (
    questions: SortableItem<Question>[],
    originQuestionIndex: number,
    targetQuestionIndex: number,
  ) => void
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

      <Sortable.Container items={questions} onDragEnd={onDragEnd}>
        {(items) =>
          items.map((item, position) => {
            const questionIndex = item.index
            const isSelected = selectedQuestionIndex === questionIndex
            const questionType = item.value.type
            return (
              <Sortable.Item key={item.index} id={item.index.toString()}>
                <button
                  type='button'
                  onClick={() => onSelectQuestion(questionIndex)}
                  className={cn(
                    'flex h-10 w-full items-center rounded-md px-3 border border-zinc-700 bg-zinc-800',
                    'text-zinc-100',
                    isSelected && 'border-primary',
                  )}
                >
                  <span className='w-full'>{QUESTION_TYPE_LABELS[questionType]}</span>
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
                    <span>{position + 1}</span>
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
