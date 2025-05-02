import {
  Image,
  List,
  ShuffledList,
  Text,
  type Logical,
  type UserAnswer,
} from '#global/domain/structures/index'
import { Question } from '../abstracts'

import type { CheckboxQuestionDto, QuestionDto } from './dtos'

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
    const l = usersOptions.isEqualTo(this.props.correctOptions)
    console.log(l)
    return l
  }

  get options() {
    return this.props.options.items
  }

  get code() {
    return this.props.code ?? null
  }
}
