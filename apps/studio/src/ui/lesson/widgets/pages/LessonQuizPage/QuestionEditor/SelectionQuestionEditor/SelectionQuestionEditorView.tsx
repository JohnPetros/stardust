import type { Image, Text } from '@stardust/core/global/structures'

import { RadioGroup, RadioGroupItem } from '@/ui/shadcn/components/radio-group'
import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { QuestionHeaderInput } from '../QuestionHeaderInput'

type Props = {
  stem: string
  picture: Image
  answer: string
  options: string[]
  onStemChange: (stem: Text) => void
  onPictureChange: (picture: Image) => void
  onOptionRemove: (optionIndex: number) => void
  onAnswerChange: (answer: string) => void
  onOptionAdd: () => void
  onOptionInputChange: (optionIndex: number, option: string) => void
}

export const SelectionQuestionEditorView = ({
  stem,
  picture,
  answer,
  options,
  onStemChange,
  onPictureChange,
  onOptionRemove,
  onAnswerChange,
  onOptionAdd,
  onOptionInputChange,
}: Props) => {
  return (
    <div>
      <QuestionHeaderInput
        stem={stem}
        picture={picture}
        onPictureChange={onPictureChange}
        onStemChange={onStemChange}
      />

      <div className='mt-6 space-y-3 w-full'>
        <h3>Opções</h3>

        <p className='w-max ml-auto text-sm text-zinc-400'>Resposta correta?</p>

        <RadioGroup value={answer} onValueChange={onAnswerChange}>
          {options.map((option, index) => (
            <div
              key={option}
              className='flex items-center gap-2 rounded-md w-full px-4 py-1 bg-purple-700'
            >
              <input
                defaultValue={option}
                onBlur={(event) => onOptionInputChange(index, event.target.value)}
                className='w-full text-sm text-zinc-100 bg-transparent border-none ring-0 outline-none'
              />

              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='icon' onClick={() => onOptionRemove(index)}>
                  <Icon name='trash' className='w-4 h-4' />
                </Button>
                <RadioGroupItem
                  value={option}
                  className='bg-transparent text-zinc-700'
                  checked={option.toLocaleLowerCase() === answer.toLocaleLowerCase()}
                />
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className='w-max mx-auto'>
          <Button variant='ghost' onClick={onOptionAdd}>
            <Icon
              name='plus'
              className='w-4 h-4 rounded-md bg-green-400 text-green-900'
            />
            Adicionar opção
          </Button>
        </div>
      </div>
    </div>
  )
}
