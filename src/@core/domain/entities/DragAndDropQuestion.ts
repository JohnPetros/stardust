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
  Integer,
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
        correctItemIndexesSequence: List.create(dto.correctItemsIndexesSequence),
        dragAndDrop: DragAndDrop.create(dto.items),
      },
    )
  }

  static canBeCreatedBy(question: QuestionDTO): question is DragAndDropQuestionDTO {
    return question.type === 'drag-and-drop'
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersDraggableItemsIndexesSequence = List.create(userAnswer.value as number[])

    return usersDraggableItemsIndexesSequence.isEqualTo(
      this.props.correctItemIndexesSequence,
    )
  }

  get dropZonesCount(): Integer {
    let count = 0

    for (const codeLine of this.codeLines) {
      for (const text of codeLine.texts) {
        if (text !== 'dropZone') count++
      }
    }

    return Integer.create('Drag and drop question drop zones count', count)
  }

  get dragAndDrop(): DragAndDrop {
    return this.props.dragAndDrop
  }

  get codeLines(): QuestionCodeLine[] {
    return this.props.codeLines
  }

  get correctItemIndexesSequence(): List<number> {
    return this.props.correctItemIndexesSequence
  }
}
