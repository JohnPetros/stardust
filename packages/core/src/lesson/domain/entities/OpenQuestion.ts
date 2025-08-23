import {
  Image,
  List,
  Text,
  type Logical,
  type UserAnswer,
} from '#global/domain/structures/index'
import { Question } from '../abstracts'
import type { OpenQuestionDto, QuestionDto } from './dtos'
import { QuestionCodeLine } from '../structures'

type OpenQuestionProps = {
  answers: List<string>
  code?: string
  codeLines: QuestionCodeLine[]
}

export class OpenQuestion extends Question<OpenQuestionProps> {
  static create(dto: OpenQuestionDto): OpenQuestion {
    return new OpenQuestion(
      {
        picture: Image.create(dto.picture),
        stem: Text.create(dto.stem),
        type: 'open',
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
    const lineNumber = this.codeLines.length

    this.props.codeLines = [
      ...this.codeLines,
      QuestionCodeLine.create({
        number: lineNumber,
        indentation: 0,
        texts: [`linha ${lineNumber}`],
      }),
    ]
  }

  removeCodeLine(lineNumber: number) {
    this.props.codeLines = this.codeLines.filter(
      (line) => line.number.value !== lineNumber,
    )
  }

  changeCodeLineText(lineNumber: number, text: string, textIndex: number): void {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === lineNumber ? line.changeText(text, textIndex) : line,
    )
  }

  changeCodeLineIndentation(lineNumber: number, indentation: number) {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === lineNumber ? line.changeIndentation(indentation) : line,
    )
  }

  changeAnswer(answer: string, index: number) {
    this.props.answers = this.answers.changeItem(answer, index)
  }

  addCodeLineText(lineNumber: number, index: number) {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === lineNumber ? line.addText('texto', index) : line,
    )
  }

  addCodeLineInput(lineNumber: number, index: number) {
    this.props.codeLines = this.codeLines.map((line) =>
      line.number.value === lineNumber ? line.addText('input', index) : line,
    )
  }

  removeCode(): void {
    this.props.code = undefined
  }

  get answers(): List<string> {
    return this.props.answers
  }

  get codeLines(): QuestionCodeLine[] {
    return this.props.codeLines
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
      lines: this.codeLines.map((line) => ({
        number: line.number.value,
        texts: line.texts,
        indentation: line.indentation.value,
      })),
    }
  }
}
