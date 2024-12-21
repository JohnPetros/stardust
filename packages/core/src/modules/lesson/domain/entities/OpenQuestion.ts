import type { OpenQuestionDto, QuestionDto } from '#dtos'
import { Question } from '#domain/abstracts'
import type { QuestionProps } from '#domain/types'
import {
  List,
  Image,
  QuestionCodeLine,
  Text,
  type Logical,
  type QuestionAnswer,
} from '#domain/structs'

type OpenQuestionProps = {
  answers: List<string>
  code?: string
  codeLines: QuestionCodeLine[]
}

export class OpenQuestion extends Question {
  private questionProps: OpenQuestionProps

  private constructor(questionProps: QuestionProps, props: OpenQuestionProps) {
    super({
      id: questionProps.id,
      picture: questionProps.picture,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.questionProps = props
  }

  static create(dto: OpenQuestionDto): OpenQuestion {
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

  static canBeCreatedBy(question: QuestionDto): question is OpenQuestionDto {
    return question.type === 'open'
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersAnswers = List.create(userAnswer.value as string[])

    return this.answers.isEqualTo(usersAnswers)
  }

  get answers(): List<string> {
    return this.questionProps.answers
  }

  get codeLines(): QuestionCodeLine[] {
    return this.questionProps.codeLines
  }

  get code(): string | null {
    return this.questionProps.code ?? null
  }
}
