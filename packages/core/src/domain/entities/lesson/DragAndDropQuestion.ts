import type { DragAndDropQuestionDto, QuestionDto } from '#dtos'
import { Question } from '#domain/abstracts'
import {
  DragAndDrop,
  Image,
  Text,
  QuestionCodeLine,
  List,
  type Logical,
  type QuestionAnswer,
  Integer,
} from '#domain/structs'
import type { QuestionProps } from '#domain/types'

type DragAndDropQuestionProps = {
  codeLines: QuestionCodeLine[]
  correctItemIndexesSequence: List<number>
  dragAndDrop: DragAndDrop
}

export class DragAndDropQuestion extends Question {
  private readonly questionProps: DragAndDropQuestionProps

  private constructor(questionProps: QuestionProps, props: DragAndDropQuestionProps) {
    super({
      type: questionProps.type,
      picture: questionProps.picture,
      statement: questionProps.statement,
    })

    this.questionProps = props
  }

  static create(dto: DragAndDropQuestionDto) {
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

  static canBeCreatedBy(question: QuestionDto): question is DragAndDropQuestionDto {
    return question.type === 'drag-and-drop'
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersDraggableItemsIndexesSequence = List.create(userAnswer.value as number[])

    return usersDraggableItemsIndexesSequence.isEqualTo(
      this.questionProps.correctItemIndexesSequence,
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
    return this.questionProps.dragAndDrop
  }

  get codeLines(): QuestionCodeLine[] {
    return this.questionProps.codeLines
  }

  get correctItemIndexesSequence(): List<number> {
    return this.questionProps.correctItemIndexesSequence
  }
}
