import { ValidationError } from '#global/domain/errors/ValidationError'

type EmbeddingNamespaceValue = 'guides' | 'challenges'

export class EmbeddingNamespace {
  private constructor(readonly value: EmbeddingNamespaceValue) {}

  static create(value: string): EmbeddingNamespace {
    if (!EmbeddingNamespace.isValid(value)) {
      throw new ValidationError([
        {
          name: 'embedding-namespace',
          messages: ['Namespace deve ser "guides" ou "challenges"'],
        },
      ])
    }
    return new EmbeddingNamespace(value)
  }

  static isValid(value: string): value is EmbeddingNamespaceValue {
    return value === 'guides' || value === 'challenges'
  }

  static createAsGuides(): EmbeddingNamespace {
    return EmbeddingNamespace.create('guides')
  }

  static createAsChallenges(): EmbeddingNamespace {
    return EmbeddingNamespace.create('challenges')
  }
}
