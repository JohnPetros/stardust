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
  correctItems: List<string>
  dragAndDrop: DragAndDrop
}

export class DragAndDropQuestion extends Question<DragAndDropQuestionProps> {
  static create(dto: DragAndDropQuestionDto) {
    return new DragAndDropQuestion(
      {
        type: 'drag-and-drop',
        picture: Image.create(dto.picture),
        stem: Text.create(dto.stem),
        codeLines: dto.lines.map(QuestionCodeLine.create),
        correctItems: List.create(dto.correctItems),
        dragAndDrop: DragAndDrop.create(dto.items),
      },
      dto.id,
    )
  }

  static canBeCreatedBy(question: QuestionDto): question is DragAndDropQuestionDto {
    return question.type === 'drag-and-drop'
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    const userItems = List.create(userAnswer.value as string[])

    return userItems.isEqualTo(this.props.correctItems)
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

  get correctItems(): List<string> {
    return this.props.correctItems
  }
}
