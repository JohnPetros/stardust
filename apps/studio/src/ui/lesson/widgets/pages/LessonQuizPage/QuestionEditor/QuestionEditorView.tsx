import type { QuestionType } from '@stardust/core/lesson/types'

import { SelectionQuestionEditor } from './SelectionQuestionEditor'
import { CheckboxQuestionEditor } from '../CheckboxEditor'
import { DragAndDropListQuestionEditor } from './DragAndDropListQuestionEditor'

type Props = {
  selectedQuestionType: QuestionType
}

export const QuestionEditorView = ({ selectedQuestionType }: Props) => {
  return (
    <div className='border border-zinc-700 rounded-md px-10 py-6'>
      {selectedQuestionType === 'selection' && <SelectionQuestionEditor />}
      {selectedQuestionType === 'checkbox' && <CheckboxQuestionEditor />}
      {selectedQuestionType === 'drag-and-drop-list' && <DragAndDropListQuestionEditor />}
    </div>
  )
}
