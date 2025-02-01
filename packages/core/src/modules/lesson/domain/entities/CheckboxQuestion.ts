import { Question } from '#lesson/abstracts'
import {
  Image,
  List,
  ShuffledList,
  Text,
  type UserAnswer,
  type Logical,
} from '#global/structs'
import type { CheckboxQuestionDto, QuestionDto } from '#lesson/dtos'

type CheckboxQuestionProps = {
  options: ShuffledList<string>
  correctOptions: List<string>
  code?: string
}

export class CheckboxQuestion extends Question<CheckboxQuestionProps> {
  static create(dto: CheckboxQuestionDto) {
    return new CheckboxQuestion(
      {
        type: 'checkbox',
        picture: Image.create(dto.picture),
        stem: Text.create(dto.stem),
        code: dto.code,
        correctOptions: List.create(dto.correctOptions),
        options: ShuffledList.create(dto.options),
      },
      dto.id,
    )
  }

  static canBeCreatedBy(question: QuestionDto): question is CheckboxQuestionDto {
    return question.type === 'checkbox'
  }

  static isCheckboxQuestion(question: Question): question is CheckboxQuestion {
    return question instanceof CheckboxQuestion
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    const usersOptions = List.create(userAnswer.value as string[])
    return usersOptions.includesList(this.props.correctOptions)
  }

  get options() {
    return this.props.options.items
  }

  get code() {
    return this.props.code ?? null
  }
}
