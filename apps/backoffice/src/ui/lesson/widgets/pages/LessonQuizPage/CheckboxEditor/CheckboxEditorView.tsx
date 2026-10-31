import type { Image, Text } from '@stardust/core/global/structures'

import { Checkbox } from '@/ui/shadcn/components/checkbox'
import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { QuestionHeaderInput } from '../QuestionEditor/QuestionHeaderInput'
import { AddItemButton } from '../../../components/AddItemButton'
import { CodeInput } from '../QuestionEditor/CodeInput'

type Props = {
  stem: string
  picture: Image
  options: string[]
  correctOptions: string[]
  code?: string
  onStemChange: (stem: Text) => void
  onPictureChange: (picture: Image) => void
  onOptionRemove: (optionIndex: number) => void
  onCorrectOptionChange: (option: string) => void
  onOptionAdd: () => void
  onOptionInputChange: (optionIndex: number, option: string) => void
  onUndoQuestionChangeButtonClick: () => void
  onCodeChange: (code: string) => void
  onCodeInputEnable: (defaultCode: string) => void
  onCodeInputDisable: () => void
}

export const CheckboxQuestionEditorView = ({
  stem,
  picture,
  options,
  correctOptions,
  code,
  onStemChange,
  onPictureChange,
  onOptionRemove,
  onCorrectOptionChange,
  onOptionAdd,
  onOptionInputChange,
  onCodeChange,
  onCodeInputDisable,
  onCodeInputEnable,
}: Props) => {
  return (
    <div className='space-y-8'>
      <QuestionHeaderInput
        stem={stem}
        picture={picture}
        onPictureChange={onPictureChange}
        onStemChange={onStemChange}
      />

      <CodeInput
        value={code}
        onChange={onCodeChange}
        onDisable={onCodeInputDisable}
        onEnable={onCodeInputEnable}
      />

      <div className='mt-6'>
        <h3>Opções</h3>

        <p className='w-max ml-auto text-sm text-zinc-400'>Resposta correta?</p>

        {options.map((option, index) => (
          <div
            key={option}
            className='flex items-center gap-2 rounded-md w-full mt-3 px-4 py-1 bg-purple-700'
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
              <Checkbox
                checked={correctOptions.includes(option)}
                onCheckedChange={() => onCorrectOptionChange(option)}
              />
            </div>
          </div>
        ))}

        <div className='w-max mx-auto mt-3'>
          <AddItemButton onClick={onOptionAdd}>Adicionar opção</AddItemButton>
        </div>
      </div>
    </div>
  )
}
