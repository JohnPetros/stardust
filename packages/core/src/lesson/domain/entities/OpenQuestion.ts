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
