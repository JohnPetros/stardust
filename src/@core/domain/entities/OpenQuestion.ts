import type { OpenQuestionDTO, QuestionDTO } from '@/@core/dtos'
import { Question } from '../abstracts'
import type { QuestionProps } from '../types'
import {
  List,
  Image,
  Logical,
  QuestionCodeLine,
  Text,
  type QuestionAnswer,
} from '../structs'

type OpenQuestionProps = {
  answers: List<string>
  code?: string
  codeLines: QuestionCodeLine[]
}

export class OpenQuestion extends Question {
  private props: OpenQuestionProps

  private constructor(questionProps: QuestionProps, props: OpenQuestionProps) {
    super({
      id: questionProps.id,
      picture: questionProps.picture,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.props = props
  }

  static create(dto: OpenQuestionDTO): OpenQuestion {
    return new OpenQuestion(
      {
        id: dto.id,
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        type: 'open',
      },
      {
        answers: List.create(dto.answers),
        codeLines: dto.lines.map(QuestionCodeLine.create),
        code: dto.code,
      },
    )
  }

  static canBeCreatedBy(question: QuestionDTO): question is OpenQuestionDTO {
    return question.type === 'open'
  }

  static isOpenQuestion(question: Question): question is OpenQuestion {
    return question instanceof OpenQuestion
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersAnswers = List.create(userAnswer.value as string[])

    return Logical.create(
      'Is user answer for open question correct?',
      this.answers.isEqualTo(usersAnswers).value,
    )
  }

  get answers(): List<string> {
    return this.props.answers
  }

  get codeLines(): QuestionCodeLine[] {
    return this.props.codeLines
  }

  get code(): string | null {
    return this.props.code ?? null
  }
}
