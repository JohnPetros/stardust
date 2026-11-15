import { ValidationError } from '#global/domain/errors/ValidationError'
import { Logical } from '#global/domain/structures/Logical'

export type GalaxyStatusValue = 'published' | 'announced' | 'unpublished'

export class GalaxyStatus {
  private constructor(readonly value: GalaxyStatusValue) {}

  static create(value: string): GalaxyStatus {
    if (!GalaxyStatus.isGalaxyStatusValue(value)) {
      throw new ValidationError([
        { name: 'galaxy status', messages: ['Não é um estado de galáxia válido'] },
      ])
    }

    return new GalaxyStatus(value)
  }

  static createAsPublished(): GalaxyStatus {
    return new GalaxyStatus('published')
  }

  static createAsAnnounced(): GalaxyStatus {
    return new GalaxyStatus('announced')
  }

  static createAsUnpublished(): GalaxyStatus {
    return new GalaxyStatus('unpublished')
  }

  static isGalaxyStatusValue(value: string): value is GalaxyStatusValue {
    return ['published', 'announced', 'unpublished'].includes(value)
  }

  get isPublished(): Logical {
    return Logical.create(this.value === 'published')
  }

  get isAnnounced(): Logical {
    return Logical.create(this.value === 'announced')
  }

  get isVisible(): Logical {
    return this.isPublished.or(this.isAnnounced)
  }
}
