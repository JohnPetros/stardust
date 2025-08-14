import type { QuestionType } from '@stardust/core/lesson/types'

import { SelectionQuestionEditor } from './SelectionQuestionEditor'

type Props = {
  selectedQuestionType: QuestionType
}

export const QuestionEditorView = ({ selectedQuestionType }: Props) => {
  return (
    <div className='border border-zinc-700 rounded-md p-10'>
      {selectedQuestionType === 'selection' && <SelectionQuestionEditor />}
    </div>
  )
}
