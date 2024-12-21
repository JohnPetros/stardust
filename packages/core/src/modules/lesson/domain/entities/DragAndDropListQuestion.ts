import { AppError } from '#global/errors'
import { Image, OrdinalNumber, Logical, SortableList, Text } from '#global/structs'
import type { DragAndDropListQuestionDto, QuestionDto } from '#lesson/dtos'
import { Question } from '#lesson/abstracts'
import type { QuestionAnswer } from '#lesson/structs'

type DragAndDropListQuestionProps = {
  sortableList: SortableList
}

export class DragAndDropListQuestion extends Question<DragAndDropListQuestionProps> {
  static create(dto: DragAndDropListQuestionDto): DragAndDropListQuestion {
    return new DragAndDropListQuestion({
      id: dto.id,
      picture: Image.create(dto.picture),
      statement: Text.create(dto.statement),
      type: 'drag-and-drop-list',
      sortableList: SortableList.create(
        dto.items.map((item) => ({
          originalPosition: OrdinalNumber.create(
            `${item.position}º Drag and drop list question item original position`,
            item.position,
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

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    if (!SortableList.isSoratableList(userAnswer.value)) {
      throw new AppError(
        'User answer for drag and drop list question must be a sortable list.',
      )
    }

    return Logical.create(
      'Is user answer for drag and drop list question correct?',
      this.sortableList.isEqualTo(userAnswer.value).value,
    )
  }

  get sortableList(): SortableList {
    return this.props.sortableList
  }
}
