import { Question } from '#domain/abstracts/lesson'
import {
  Image,
  List,
  ShuffledList,
  Text,
  type Logical,
} from '../../../modules/global/domain/structs'
import type { QuestionAnswer } from '#domain/structs/lesson'
import type { QuestionProps } from '#domain/types'
import type { CheckboxQuestionDto, QuestionDto } from '../../../modules/lesson/dtos'

type CheckboxQuestionProps = {
  options: ShuffledList<string>
  correctOptions: List<string>
  code?: string
}

export class CheckboxQuestion extends Question {
  private readonly questionProps: CheckboxQuestionProps

  private constructor(questionProps: QuestionProps, props: CheckboxQuestionProps) {
    super({
      id: questionProps.id,
      picture: questionProps.picture,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.questionProps = props
  }

  static create(dto: CheckboxQuestionDto) {
    return new CheckboxQuestion(
      {
        id: dto.id,
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        type: dto.type,
      },
      {
        code: dto.code,
        correctOptions: List.create(dto.correctOptions),
        options: ShuffledList.create(dto.options),
      },
    )
  }

  static canBeCreatedBy(question: QuestionDto): question is CheckboxQuestionDto {
    return question.type === 'checkbox'
  }

  static isCheckboxQuestion(question: Question): question is CheckboxQuestion {
    return question instanceof CheckboxQuestion
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersOptions = List.create(userAnswer.value as string[])
    return usersOptions.includesList(this.questionProps.correctOptions)
  }

  get options() {
    return this.questionProps.options.items
  }

  get code() {
    return this.questionProps.code ?? null
  }
}
