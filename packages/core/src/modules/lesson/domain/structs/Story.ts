import { Integer } from '#global/structs'

type StoryProps = {
  currentChunkIndex: Integer
  chunks: string[]
}

export class Story {
  readonly currentChunkIndex: Integer
  readonly chunks: string[]

  private constructor(props: StoryProps) {
    this.currentChunkIndex = props.currentChunkIndex
    this.chunks = props.chunks
  }

  static create(chunks: string[]): Story {
    return new Story({
      currentChunkIndex: Integer.create(1, 'Índice do pedaço atual'),
      chunks,
    })
  }

  static areChunks(chunks: unknown[]): chunks is string[] {
    return typeof chunks[0] === 'string'
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

    return this.chunks[this.currentChunkIndex.value]
  }

  get hasNextTextBlock() {
    if (this.chunks.length) {
      return this.currentChunkIndex.value < this.chunks.length
    }

    return this.currentChunkIndex.value < this.chunks.length
  }

  get chunksCount() {
    if (this.chunks.length) {
      return this.chunks.length
    }

    return this.chunks.length
  }

  get readChunksCount() {
    return this.readChunks.length
  }

  get readChunks() {
    if (this.chunks.length) {
      return this.chunks.slice(0, this.currentChunkIndex.value)
    }

    return this.chunks.slice(0, this.currentChunkIndex.value)
  }

  get progress() {
    return this.readChunksCount / this.chunksCount
  }

  get hasTextsBlocks() {
    return this.chunks.length > 0
  }

  private clone(props?: Partial<StoryProps>): Story {
    return new Story({
      currentChunkIndex: this.currentChunkIndex,
      chunks: this.chunks,
      ...props,
    })
  }
}
