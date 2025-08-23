import { Integer } from '../../../global/domain/structures'
import type { QuestionCodeLineDto } from '../entities/dtos'

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
      number: Integer.create(dto.number, 'Número da questão'),
      indentation: Integer.create(dto.indentation, 'identação da questão'),
      texts: dto.texts,
    })
  }

  changeIndentation(indentation: number): QuestionCodeLine {
    return new QuestionCodeLine({
      indentation: Integer.create(indentation),
      number: this.number,
      texts: this.texts,
    })
  }

  addText(text: string, index: number): QuestionCodeLine {
    this.texts.splice(index, 0, text)
    return new QuestionCodeLine({
      number: this.number,
      indentation: this.indentation,
      texts: this.texts,
    })
  }

  replaceText(text: string, index: number): QuestionCodeLine {
    this.texts[index] = text
    return new QuestionCodeLine({
      number: this.number,
      indentation: this.indentation,
      texts: this.texts,
    })
  }

  changeText(text: string, textIndex: number): QuestionCodeLine {
    this.texts[textIndex] = text
    return new QuestionCodeLine({
      number: this.number,
      indentation: this.indentation,
      texts: this.texts,
    })
  }

  setTexts(texts: string[]): QuestionCodeLine {
    return new QuestionCodeLine({
      number: this.number,
      indentation: this.indentation,
      texts,
    })
  }

  changeNumber(number: number): QuestionCodeLine {
    return new QuestionCodeLine({
      number: Integer.create(number),
      indentation: this.indentation,
      texts: this.texts,
    })
  }

  removeBlock(blockIndex: number): QuestionCodeLine {
    this.texts.splice(blockIndex, 1)
    return new QuestionCodeLine({
      number: this.number,
      indentation: this.indentation,
      texts: this.texts,
    })
  }
}
