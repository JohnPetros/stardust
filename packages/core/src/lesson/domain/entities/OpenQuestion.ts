import {
  Image,
  List,
  Text,
  type Logical,
  type UserAnswer,
} from '#global/domain/structures/index'
import { Question } from '../abstracts'
import { QuestionCodeLine } from '../structures'
import type { OpenQuestionDto, QuestionDto } from './dtos'

type OpenQuestionProps = {
  answers: List<string>
  code?: string
  codeLines: QuestionCodeLine[]
}

export class OpenQuestion extends Question<OpenQuestionProps> {
  static create(dto: OpenQuestionDto): OpenQuestion {
    return new OpenQuestion(
      {
        type: 'open',
        picture: Image.create(dto.picture),
        stem: Text.create(dto.stem),
        answers: List.create(dto.answers),
        codeLines: dto.lines.map(QuestionCodeLine.create),
        code: dto.code,
      },
      dto.id,
    )
  }

  static canBeCreatedBy(question: QuestionDto): question is OpenQuestionDto {
    return question.type === 'open'
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    const usersAnswers = List.create(userAnswer.value as string[])

    return this.answers.isStrictlyEqualTo(usersAnswers)
  }

  addCodeLine() {
    const codelineNumber = this.codeLines.length + 1

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
    const answerIndexesToRemove: number[] = []

    let answerIndex = 0

    for (const line of this.codeLines) {
      for (const text of line.texts) {
        if (text.startsWith('input')) {
          if (line.number.value === codelineNumber) {
            answerIndexesToRemove.push(answerIndex)
          }
          answerIndex++
        }
      }
    }

    this.props.answers = this.props.answers.filter(
      (_, index) => !answerIndexesToRemove.includes(index),
    )

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

  changeAnswer(answer: string, index: number) {
    this.props.answers = this.answers.changeItem(answer, index)
  }

  addCodeLineText(codelineNumber: number, codeLineTextIndex: number) {
    this.props.codeLines = this.codeLines.map((line) => {
      if (line.number.value === codelineNumber) {
        return line.addText('texto', codeLineTextIndex)
      }
      return line
    })
  }

  addCodeLineInput(codelineNumber: number, codeLineInputIndex: number) {
    const answerIndex = this.getAnswerIndex(codelineNumber, codeLineInputIndex)
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === codelineNumber
        ? line.addText('input', codeLineInputIndex)
        : line,
    )
    this.props.answers = this.answers.addAt('', answerIndex)
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
        ? line.replaceText('input', codeLineInputIndex)
        : line,
    )
    this.props.answers = this.answers.addAt('', answerIndex)
  }

  private getAnswerIndex(codelineNumber: number, codeLineInputIndex: number): number {
    let answerIndex = 0
    let targetCodeLineInputIndex = 0

    for (const line of this.codeLines) {
      for (const text of line.texts) {
        if (line.number.value === codelineNumber) {
          if (targetCodeLineInputIndex === codeLineInputIndex) {
            return answerIndex
          }
          targetCodeLineInputIndex++
        }
        if (text.startsWith('input')) {
          answerIndex++
        }
        if (targetCodeLineInputIndex >= line.texts.length) {
          return answerIndex
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

  removeCode(): void {
    this.props.code = undefined
  }

  get answers(): List<string> {
    return this.props.answers
  }

  get codeLines(): QuestionCodeLine[] {
    let inputIndex = 1
    const codeLines = this.props.codeLines.map((line) => {
      const texts = line.texts.map((text) => {
        if (text.startsWith('input')) {
          const inputValue = `input-${inputIndex}`
          inputIndex++
          return inputValue
        }
        return text
      })
      return line.setTexts(texts)
    })
    return codeLines
  }

  set codeLines(codeLines: QuestionCodeLine[]) {
    this.props.codeLines = codeLines
  }

  get code(): string | undefined {
    return this.props.code
  }

  set code(code: string) {
    this.props.code = code
  }

  get dto(): OpenQuestionDto {
    return {
      id: this.id.value,
      type: 'open',
      picture: this.picture.value,
      stem: this.stem.value,
      answers: this.answers.items,
      code: this.code,
      lines: this.codeLines.map((line) => ({
        number: line.number.value,
        texts: line.texts,
        indentation: line.indentation.value,
      })),
    }
  }
}
