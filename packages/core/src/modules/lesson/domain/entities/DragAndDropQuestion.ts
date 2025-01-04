import {
  Image,
  Text,
  List,
  type Logical,
  type UserAnswer,
  Integer,
} from '#global/structs'
import type { DragAndDropQuestionDto, QuestionDto } from '#lesson/dtos'
import { DragAndDrop, QuestionCodeLine } from '#lesson/structs'
import { Question } from '#lesson/abstracts'

type DragAndDropQuestionProps = {
  codeLines: QuestionCodeLine[]
  correctItemIndexesSequence: List<number>
  dragAndDrop: DragAndDrop
}

export class DragAndDropQuestion extends Question<DragAndDropQuestionProps> {
  static create(dto: DragAndDropQuestionDto) {
    return new DragAndDropQuestion(
      {
        type: 'drag-and-drop',
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        codeLines: dto.lines.map(QuestionCodeLine.create),
        correctItemIndexesSequence: List.create(dto.correctItemsIndexesSequence),
        dragAndDrop: DragAndDrop.create(dto.items),
      },
      dto.id,
    )
  }

  static canBeCreatedBy(question: QuestionDto): question is DragAndDropQuestionDto {
    return question.type === 'drag-and-drop'
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
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

    return Integer.create(count)
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
