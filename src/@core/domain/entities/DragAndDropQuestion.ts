import type { DragAndDropQuestionDTO, QuestionDTO } from '@/@core/dtos'
import type { QuestionProps } from '../types'
import { Question } from '../abstracts'
import {
  DragAndDrop,
  Image,
  Text,
  QuestionCodeLine,
  List,
  type Logical,
  type QuestionAnswer,
} from '../structs'

type DragAndDropQuestionProps = {
  codeLines: QuestionCodeLine[]
  correctItemIndexesSequence: List<number>
  dragAndDrop: DragAndDrop
}

export class DragAndDropQuestion extends Question {
  private readonly props: DragAndDropQuestionProps

  private constructor(questionProps: QuestionProps, props: DragAndDropQuestionProps) {
    super({
      type: questionProps.type,
      picture: questionProps.picture,
      statement: questionProps.statement,
    })

    this.props = props
  }

  static create(dto: DragAndDropQuestionDTO) {
    return new DragAndDropQuestion(
      {
        type: 'drag-and-drop',
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        id: dto.id,
      },
      {
        codeLines: dto.lines.map(QuestionCodeLine.create),
        correctItemIndexesSequence: List.create(dto.correctDragItemsIdsSequence),
        dragAndDrop: DragAndDrop.create(
          dto.items.map((item) => ({ index: item.id, label: item.label })),
        ),
      },
    )
  }

  static canBeCreatedBy(question: QuestionDTO): question is DragAndDropQuestionDTO {
    return question.type === 'drag-and-drop'
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersDragableItemsIndexesSequence = List.create(userAnswer.value as number[])

    return usersDragableItemsIndexesSequence.isEqualTo(
      this.props.correctItemIndexesSequence,
    )
  }

  get dragAndDrop() {
    return this.props.dragAndDrop
  }

  get codeLines() {
    return this.props.codeLines
  }

  get correctItemIndexesSequence() {
    return this.props.correctItemIndexesSequence
  }
}
