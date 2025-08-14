import type { QuestionType } from '@stardust/core/lesson/types'

import { SelectionQuestionEditor } from './SelectionQuestionEditor'
import { CheckboxQuestionEditor } from '../CheckboxEditor'

type Props = {
  selectedQuestionType: QuestionType
}

export const QuestionEditorView = ({ selectedQuestionType }: Props) => {
  return (
    <div className='border border-zinc-700 rounded-md px-10 py-6'>
      {selectedQuestionType === 'selection' && <SelectionQuestionEditor />}
      {selectedQuestionType === 'checkbox' && <CheckboxQuestionEditor />}
    </div>
  )
}
