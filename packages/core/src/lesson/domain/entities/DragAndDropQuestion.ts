import {
  Image,
  Integer,
  List,
  Text,
  type Logical,
  type UserAnswer,
} from '#global/domain/structures/index'
import type { DragAndDropQuestionDto, QuestionDto } from './dtos'
import { DragAndDrop, QuestionCodeLine } from '../structures'
import { Question } from '../abstracts'

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

  addCodeLine() {
    const codelineNumber = this.codeLines.length

    this.props.codeLines = [
      ...this.codeLines,
      QuestionCodeLine.create({
        number: codelineNumber,
        indentation: 0,
        texts: [`linha ${codelineNumber}`],
      }),
    ]
  }

  removeCodeLine(codelineNumber: number) {
    this.props.codeLines = this.codeLines.filter(
      (line) => line.number.value !== codelineNumber,
    )
  }

  changeCodeLineText(codelineNumber: number, text: string, textIndex: number): void {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber ? line.changeText(text, textIndex) : line,
    )
  }

  changeCodeLineIndentation(codelineNumber: number, indentation: number) {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber ? line.changeIndentation(indentation) : line,
    )
  }

  changeCorrectItem(correctItem: string, itemIndex: number) {
    this.props.correctItems = this.correctItems.changeItem(correctItem, itemIndex)
  }

  addCodeLineText(codelineNumber: number, codeLineTextIndex: number) {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber
        ? line.addText('texto', codeLineTextIndex)
        : line,
    )
  }

  addCodeLineInput(codelineNumber: number, codeLineInputIndex: number) {
    const answerIndex = this.getAnswerIndex(codelineNumber, codeLineInputIndex)
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber
        ? line.addText('dropZone', codeLineInputIndex)
        : line,
    )
    this.props.correctItems = this.correctItems.addAt('', answerIndex)
  }

  replaceCodeLineBlockWithText(codelineNumber: number, codeLineTextIndex: number) {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber
        ? line.replaceText('texto', codeLineTextIndex)
        : line,
    )
  }

  replaceCodeLineBlockWithInput(codelineNumber: number, codeLineInputIndex: number) {
    const answerIndex = this.getAnswerIndex(codelineNumber, codeLineInputIndex)
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber
        ? line.replaceText('dropZone', codeLineInputIndex)
        : line,
    )
    this.props.correctItems = this.correctItems.addAt('', answerIndex)
  }

  private getAnswerIndex(codelineNumber: number, codeLineInputIndex: number): number {
    let answerIndex = 0
    const codeLines = this.codeLines.slice(0, codelineNumber + 1)

    for (let codeLineIndex = 0; codeLineIndex < codeLines.length; codeLineIndex++) {
      const line = this.codeLines[codeLineIndex]
      const texts =
        codeLineIndex === codelineNumber
          ? line.texts.slice(0, codeLineInputIndex)
          : line.texts

      for (const text of texts) {
        if (text === 'dropZone') {
          answerIndex++
        }
      }
    }

    return answerIndex
  }

  removeCodeLineBlock(codelineNumber: number, blockIndex: number) {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber ? line.removeBlock(blockIndex) : line,
    )
  }

  addDragDropItem() {
    this.props.dragAndDrop = this.dragAndDrop.addItem()
  }

  removeDragDropItem(index: number) {
    this.props.dragAndDrop = this.dragAndDrop.removeItem(index)
  }

  changeDragDropItem(index: number, label: string) {
    this.props.dragAndDrop = this.dragAndDrop.changeItem(index, label)
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

  set codeLines(codeLines: QuestionCodeLine[]) {
    this.props.codeLines = codeLines
  }

  get correctItems(): List<string> {
    return this.props.correctItems
  }

  set correctItems(correctItems: List<string>) {
    this.props.correctItems = correctItems
  }

  get dto(): DragAndDropQuestionDto {
    return {
      id: this.id.value,
      type: 'drag-and-drop',
      picture: this.picture.value,
      stem: this.stem.value,
      lines: this.codeLines.map((line) => ({
        number: line.number.value,
        texts: line.texts,
        indentation: line.indentation.value,
      })),
      items: this.dragAndDrop.items.map((item) => ({
        index: item.index.value,
        label: item.label.value,
      })),
      correctItems: this.correctItems.items,
    }
  }
}
