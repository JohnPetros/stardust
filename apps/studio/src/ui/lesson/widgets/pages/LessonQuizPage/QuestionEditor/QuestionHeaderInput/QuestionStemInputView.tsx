import type { Image } from '@stardust/core/global/structures'
import { Text } from '@stardust/core/global/structures'

import { PictureInput } from '@/ui/lesson/widgets/components/PictureInput'
import { Input } from '@/ui/shadcn/components/input'
import { Label } from '@/ui/shadcn/components/label'

type Props = {
  stem: string
  picture: Image
  onPictureChange: (picture: Image) => void
  onStemChange: (text: Text) => void
}

export const QuestionHeaderInputView = ({
  stem,
  picture,
  onPictureChange,
  onStemChange,
}: Props) => {
  return (
    <div className='flex flex-col gap-4'>
      <Label htmlFor='question-stem-input'>Comando da questão</Label>
      <div className='flex items-center gap-4'>
        <PictureInput onChange={onPictureChange} defaultPicture={picture} />
        <Input
          id='question-stem-input'
          placeholder='Enunciado da questão'
          value={stem}
          onChange={(event) => onStemChange(Text.create(event.target.value))}
        />
      </div>
    </div>
  )
}
