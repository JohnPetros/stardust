import { List } from './List'
import { Text } from './Text'

export class Embedding {
  private constructor(
    readonly text: Text,
    readonly vector: List<number>,
  ) {}

  static create(text: string, vector: number[]): Embedding {
    return new Embedding(Text.create(text), List.create(vector))
  }
}
