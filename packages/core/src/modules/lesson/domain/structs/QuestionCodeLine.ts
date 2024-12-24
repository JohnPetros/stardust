import { Integer } from '#global/structs'
import type { QuestionCodeLineDto } from '#lesson/dtos'

type QuestionCodeLineProps = {
  number: Integer
  texts: string[]
  indentation: Integer
}

export class QuestionCodeLine {
  readonly number: Integer
  readonly texts: string[]
  readonly indentation: Integer

  private constructor(props: QuestionCodeLineProps) {
    this.number = props.number
    this.texts = props.texts
    this.indentation = props.indentation
  }

  static create(dto: QuestionCodeLineDto): QuestionCodeLine {
    return new QuestionCodeLine({
      number: Integer.create('Question code line number', dto.number),
      indentation: Integer.create('Question code line indentation', dto.indentation),
      texts: dto.texts,
    })
  }
}
