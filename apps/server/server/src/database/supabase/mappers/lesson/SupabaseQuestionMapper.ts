import type { Question } from '@stardust/core/lesson/abstracts'
import {
  CheckboxQuestion,
  OpenQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
  DragAndDropListQuestion,
} from '@stardust/core/lesson/entities'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'

export class SupabaseQuestionMapper {
  static toEntity(supabaseQuestion: QuestionDto): Question {
    console.log(supabaseQuestion)
    switch (supabaseQuestion.type) {
      case 'selection':
        return SelectionQuestion.create(supabaseQuestion)
      case 'checkbox':
        return CheckboxQuestion.create(supabaseQuestion)
      case 'open':
        return OpenQuestion.create(supabaseQuestion)
      case 'drag-and-drop':
        return DragAndDropQuestion.create(supabaseQuestion)
      case 'drag-and-drop-list':
        return DragAndDropListQuestion.create(supabaseQuestion)
      default:
        throw new Error('Invalid question type')
    }
  }
}
