import type { TextBlockDTO } from '@/@core/dtos'
import { Integer } from './Integer'
import { TextBlock } from './TextBlock'

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

  static create(textsBlocksDTO: TextBlockDTO[]): Theory {
    const textBlocks = textsBlocksDTO.map((dto) => {
      let textBlock = TextBlock.create(dto.type, dto.content)

      if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
      if (dto.title) textBlock = textBlock.setTitle(dto.title)
      if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)

      return textBlock
    })

    return new Theory({
      currentTextBlockIndex: Integer.create('Theory current text index', 1),
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
    return this.textBlocks[this.currentTextBlockIndex.value]
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
