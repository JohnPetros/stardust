import type { SelectionQuestion } from '@stardust/core/lesson/entities'

import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import { useSelectionQuestionEditor } from '@/ui/lesson/widgets/pages/LessonQuizPage/QuestionEditor/SelectionQuestionEditor/useSelectionQuestionEditor'
import { SelectionQuestionEditorView } from '@/ui/lesson/widgets/pages/LessonQuizPage/QuestionEditor/SelectionQuestionEditor/SelectionQuestionEditorView'

export const SelectionQuestionEditor = () => {
  const { selectedQuestion, replaceSelectedQuestion } = useQuizContext()
  const question = selectedQuestion?.data as SelectionQuestion
  const {
    handleAnswerInputChange,
    handleOptionAdd,
    handleOptionRemove,
    handleOptionInputChange,
    handleStemInputChange,
    handlePictureInputChange,
    handleCodeInputChange,
    handleCodeInputDisabled,
    handleCodeInputEnable,
  } = useSelectionQuestionEditor(question, replaceSelectedQuestion)

  return (
    <SelectionQuestionEditorView
      stem={question.stem.value}
      picture={question.picture}
      options={question.options}
      answer={question.answer}
      code={question.code}
      onCodeChange={handleCodeInputChange}
      onCodeInputEnable={handleCodeInputEnable}
      onCodeInputDisabled={handleCodeInputDisabled}
      onStemChange={handleStemInputChange}
      onPictureChange={handlePictureInputChange}
      onOptionRemove={handleOptionRemove}
      onAnswerChange={handleAnswerInputChange}
      onOptionAdd={handleOptionAdd}
      onOptionInputChange={handleOptionInputChange}
    />
  )
}
