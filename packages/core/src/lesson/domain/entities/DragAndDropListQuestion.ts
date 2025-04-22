import type { UserAnswer } from '#global/structs'
import { AppError } from '#global/errors'
import { Image, OrdinalNumber, Logical, SortableList, Text } from '#global/structs'
import { Question } from '../abstracts'
import type { DragAndDropListQuestionDto, QuestionDto } from '../../dtos'

type DragAndDropListQuestionProps = {
  sortableList: SortableList
}

export class DragAndDropListQuestion extends Question<DragAndDropListQuestionProps> {
  static create(dto: DragAndDropListQuestionDto): DragAndDropListQuestion {
    return new DragAndDropListQuestion({
      id: dto.id,
      picture: Image.create(dto.picture),
      stem: Text.create(dto.stem),
      type: 'drag-and-drop-list',
      sortableList: SortableList.create(
        dto.items.map((item) => ({
          originalPosition: OrdinalNumber.create(
            item.position,
            `${item.position}º Drag and drop list question item original position`,
          ),
          label: item.label,
        })),
      ),
    })
  }

  static canBeCreatedBy(question: QuestionDto): question is DragAndDropListQuestionDto {
    return question.type === 'drag-and-drop-list'
  }

  static isDragAndDropListQuestion(
    question: Question,
  ): question is DragAndDropListQuestion {
    return question instanceof DragAndDropListQuestion
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    if (!SortableList.isSoratableList(userAnswer.value)) {
      throw new AppError(
        'A resposta do usuário para um pergunta de drag and drop deve ser uma lista ordenável.',
      )
    }

    return Logical.create(this.sortableList.isEqualTo(userAnswer.value).value)
  }

  get sortableList(): SortableList {
    return this.props.sortableList
  }
}
