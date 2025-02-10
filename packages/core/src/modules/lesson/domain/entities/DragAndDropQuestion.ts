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
  dropZoneSlotsIndexes: Record<string, number>
}

export class DragAndDropQuestion extends Question<DragAndDropQuestionProps> {
  static create(dto: DragAndDropQuestionDto) {
    let dropZoneSlotsIndexes: Record<string, number> = {}
    let dropZoneIndex = 1
    const codeLines: QuestionCodeLine[] = []
    for (const line of dto.lines) {
      const codeLine = QuestionCodeLine.create(line)
      codeLines.push(codeLine)
      line.texts.forEach((_, textIndex) => {
        const key = DragAndDropQuestion.getDropZoneSlotKey(codeLine, textIndex)
        if (key) {
          dropZoneSlotsIndexes = {
            ...dropZoneSlotsIndexes,
            [key]: dropZoneIndex,
          }
          dropZoneIndex += 1
        }
      })
    }
    return new DragAndDropQuestion(
      {
        type: 'drag-and-drop',
        picture: Image.create(dto.picture),
        stem: Text.create(dto.stem),
        correctItems: List.create(dto.correctItems),
        dragAndDrop: DragAndDrop.create(dto.items),
        codeLines: codeLines,
        dropZoneSlotsIndexes,
      },
      dto.id,
    )
  }

  static getDropZoneSlotKey(line: QuestionCodeLine, textIndex: number) {
    const text = line.texts[textIndex]
    if (text === 'dropZone') {
      const key = `${textIndex}-${line.number.value}`
      return key
    }
  }

  static canBeCreatedBy(question: QuestionDto): question is DragAndDropQuestionDto {
    return question.type === 'drag-and-drop'
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    const userItems = List.create(userAnswer.value as string[])
    return userItems.isStrictlyEqualTo(this.props.correctItems)
  }

  get dropZoneSlotsCount(): Integer {
    let count = 0

    for (const codeLine of this.codeLines) {
      for (const text of codeLine.texts) {
        if (text === 'dropZone') count++
      }
    }

    return Integer.create(count)
  }

  get dragAndDrop(): DragAndDrop {
    return this.props.dragAndDrop
  }

  get dropZoneSlotsIndexes(): Record<string, number> {
    return this.props.dropZoneSlotsIndexes
  }

  get codeLines(): QuestionCodeLine[] {
    return this.props.codeLines
  }

  get correctItems(): List<string> {
    return this.props.correctItems
  }
}
