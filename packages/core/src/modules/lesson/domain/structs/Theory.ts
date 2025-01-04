import type { TextBlockDto } from '#global/dtos'
import { Integer, TextBlock } from '#global/structs'

type TheoryProps = {
  currentTextBlockIndex: Integer
  textBlocks: TextBlock[]
}

export class Theory {
  readonly currentTextBlockIndex: Integer
  readonly textBlocks: TextBlock[]

  private constructor(props: TheoryProps) {
    this.currentTextBlockIndex = props.currentTextBlockIndex
    this.textBlocks = props.textBlocks
  }

  static create(textsBlocksDto: TextBlockDto[]): Theory {
    const textBlocks = textsBlocksDto.map((dto) => {
      let textBlock = TextBlock.create(dto.type, dto.content)

      if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
      if (dto.title) textBlock = textBlock.setTitle(dto.title)
      if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)

      return textBlock
    })

    return new Theory({
      currentTextBlockIndex: Integer.create(1, 'Índice do texto atual'),
      textBlocks,
    })
  }

  nextTextBlock(): Theory {
    return this.clone({
      currentTextBlockIndex: this.currentTextBlockIndex.increment(1),
    })
  }

  addTextBlock(textBlock: TextBlock) {
    this.textBlocks.push(textBlock)
  }

  get currentTextBlock() {
    return this.textBlocks[this.currentTextBlockIndex.value]
  }

  get hasNextTextBlock() {
    return this.currentTextBlockIndex.value < this.textBlocks.length
  }

  get textsBlockCount() {
    return this.textBlocks.length
  }

  get readTextBlocksCount() {
    return this.readTextBlocks.length
  }

  get readTextBlocks() {
    return this.textBlocks.slice(0, this.currentTextBlockIndex.value)
  }

  get progress() {
    return this.readTextBlocksCount / this.textsBlockCount
  }

  get hasTextsBlocks() {
    return this.textBlocks.length > 0
  }

  private clone(props?: Partial<TheoryProps>): Theory {
    return new Theory({
      currentTextBlockIndex: this.currentTextBlockIndex,
      textBlocks: this.textBlocks,
      ...props,
    })
  }
}
