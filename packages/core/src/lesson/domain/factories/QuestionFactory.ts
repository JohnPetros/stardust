import type { QuestionDto } from '../entities/dtos/index'
import { SelectionQuestion } from '../entities/SelectionQuestion'
import { CheckboxQuestion } from '../entities/CheckboxQuestion'
import { DragAndDropListQuestion } from '../entities/DragAndDropListQuestion'
import { DragAndDropQuestion } from '../entities/DragAndDropQuestion'
import { InvalidQuestionTypeError } from '../errors/InvalidQuestionTypeError'
import { OpenQuestion } from '../entities/OpenQuestion'

export class QuestionFactory {
  static produce(question: QuestionDto) {
    switch (question.type) {
      case 'selection':
        return SelectionQuestion.create(question)
      case 'checkbox':
        return CheckboxQuestion.create(question)
      case 'open':
        return OpenQuestion.create(question)
      case 'drag-and-drop-list':
        return DragAndDropListQuestion.create(question)
      case 'drag-and-drop':
        return DragAndDropQuestion.create(question)
      default:
        throw new InvalidQuestionTypeError()
    }
  }
}
