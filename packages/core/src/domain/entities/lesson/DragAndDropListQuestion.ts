import { AppError } from '@/@core/errors/global/AppError'
import type { DragAndDropListQuestionDto, QuestionDto } from '#dtos'
import type { QuestionProps } from '../../types'
import { Question } from '#domain/abstracts'
import {
  Image,
  OrdinalNumber,
  Logical,
  SortableList,
  Text,
  type QuestionAnswer,
} from '#domain/structs'

type DragAndDropListQuestionProps = {
  sortableList: SortableList
}

export class DragAndDropListQuestion extends Question {
  private props: DragAndDropListQuestionProps

  private constructor(questionProps: QuestionProps, props: DragAndDropListQuestionProps) {
    super({
      id: questionProps.id,
      picture: questionProps.picture,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.props = props
  }

  static create(dto: DragAndDropListQuestionDto): DragAndDropListQuestion {
    return new DragAndDropListQuestion(
      {
        id: dto.id,
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        type: 'drag-and-drop-list',
      },
      {
        sortableList: SortableList.create(
          dto.items.map((item) => ({
            originalPosition: OrdinalNumber.create(
              `${item.position}º Drag and drop list question item original position`,
              item.position,
            ),
            label: item.label,
          })),
        ),
      },
    )
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
