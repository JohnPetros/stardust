import type { Question } from '@stardust/core/lesson/abstracts'
import {
  CheckboxQuestion,
  OpenQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
  DragAndDropListQuestion,
} from '@stardust/core/lesson/entities'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import { AppError } from '@stardust/core/global/errors'

export class DrizzleQuestionMapper {
  static toEntity(dto: QuestionDto): Question {
    if (dto.type === 'open') return OpenQuestion.create(dto)
    const question =
      DrizzleQuestionMapper.choice(dto) ?? DrizzleQuestionMapper.arrangement(dto)
    if (question) return question
    throw new AppError('Invalid question type')
  }
  private static choice(dto: QuestionDto): Question | null {
    if (dto.type === 'selection') return SelectionQuestion.create(dto)
    if (dto.type === 'checkbox') return CheckboxQuestion.create(dto)
    return null
  }
  private static arrangement(dto: QuestionDto): Question | null {
    if (dto.type === 'drag-and-drop') return DragAndDropQuestion.create(dto)
    if (dto.type === 'drag-and-drop-list') return DragAndDropListQuestion.create(dto)
    return null
  }
}
