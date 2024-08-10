import type { OpenQuestionDTO, QuestionDTO } from '@/@core/dtos'
import { Question } from '../abstracts'
import type { QuestionProps } from '../types'
import {
  List,
  Image,
  QuestionCodeLine,
  Text,
  type Logical,
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

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersAnswers = List.create(userAnswer.value as string[])

    return this.answers.isEqualTo(usersAnswers)
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
