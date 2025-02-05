import type { TextBlockDto } from '#global/dtos'
import { Integer, TextBlock } from '#global/structs'

type StoryProps = {
  currentChunkIndex: Integer
  textBlocks: TextBlock[]
  chunks: string[]
}

export class Story {
  readonly currentChunkIndex: Integer
  readonly textBlocks: TextBlock[]
  readonly chunks: string[]

  private constructor(props: StoryProps) {
    this.currentChunkIndex = props.currentChunkIndex
    this.textBlocks = props.textBlocks
    this.chunks = props.chunks
  }

  static create(chunks: TextBlockDto[] | string[]): Story {
    if (Story.areChunks(chunks)) {
      return new Story({
        currentChunkIndex: Integer.create(0, 'Índice do pedaço atual'),
        textBlocks: [],
        chunks,
      })
    }

    const textBlocks = chunks.map((dto) => {
      let textBlock = TextBlock.create(dto.type, dto.content)

      if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
      if (dto.title) textBlock = textBlock.setTitle(dto.title)
      if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)

      return textBlock
    })

    return new Story({
      currentChunkIndex: Integer.create(0, 'Índice do pedaço atual'),
      textBlocks,
      chunks: [],
    })
  }

  static areChunks(chunks: unknown[]): chunks is string[] {
    return typeof chunks[0] === 'string'
  }

  static isTextBlock(textBlock: string | TextBlock): textBlock is TextBlock {
    return typeof textBlock === 'object' && 'content' in textBlock
  }

  nextChunk(): Story {
    return this.clone({
      currentChunkIndex: this.currentChunkIndex.increment(1),
    })
  }

  get currentTextBlock() {
    if (this.chunks.length) {
      return this.chunks[this.currentChunkIndex.value]
    }

    return this.textBlocks[this.currentChunkIndex.value]
  }

  get hasNextTextBlock() {
    if (this.chunks.length) {
      return this.currentChunkIndex.value < this.chunks.length
    }

    return this.currentChunkIndex.value < this.textBlocks.length
  }

  get chunksCount() {
    if (this.chunks.length) {
      return this.chunks.length
    }

    return this.textBlocks.length
  }

  get readChunksCount() {
    return this.readChunks.length
  }

  get readChunks() {
    if (this.chunks.length) {
      return this.chunks.slice(0, this.currentChunkIndex.value)
    }

    return this.textBlocks.slice(0, this.currentChunkIndex.value)
  }

  get progress() {
    return this.readChunksCount / this.chunksCount
  }

  get hasTextsBlocks() {
    return this.textBlocks.length > 0
  }

  private clone(props?: Partial<StoryProps>): Story {
    return new Story({
      currentChunkIndex: this.currentChunkIndex,
      textBlocks: this.textBlocks,
      chunks: this.chunks,
      ...props,
    })
  }
}
