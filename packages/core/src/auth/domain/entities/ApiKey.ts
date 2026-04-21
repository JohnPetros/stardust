import { Entity } from '#global/domain/abstracts/Entity'
import { Id, Logical, Name } from '#global/domain/structures/index'
import type { ApiKeyDto } from './dtos'

type ApiKeyProps = {
  name: Name
  keyHash: string
  keyPreview: string
  userId: Id
  createdAt: Date
  revokedAt?: Date
}

export class ApiKey extends Entity<ApiKeyProps> {
  private constructor(props: ApiKeyProps, id?: string) {
    super(props, id)
  }

  static create(dto: ApiKeyDto): ApiKey {
    return new ApiKey(
      {
        name: Name.create(dto.name),
        keyHash: dto.keyHash,
        keyPreview: dto.keyPreview,
        userId: Id.create(dto.userId),
        createdAt: dto.createdAt,
        revokedAt: dto.revokedAt,
      },
      dto.id,
    )
  }

  rename(name: string): void {
    this.props.name = Name.create(name)
  }

  revoke(revokedAt: Date): void {
    this.props.revokedAt = revokedAt
  }

  belongsToUser(userId: Id): Logical {
    return Logical.create(this.userId.value === userId.value)
  }

  get name(): Name {
    return this.props.name
  }

  get keyHash(): string {
    return this.props.keyHash
  }

  get keyPreview(): string {
    return this.props.keyPreview
  }

  get userId(): Id {
    return this.props.userId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt
  }

  get isRevoked(): Logical {
    return Logical.create(this.revokedAt !== undefined)
  }

  get dto(): ApiKeyDto {
    return {
      id: this.id.value,
      name: this.name.value,
      keyHash: this.keyHash,
      keyPreview: this.keyPreview,
      userId: this.userId.value,
      createdAt: this.createdAt,
      revokedAt: this.revokedAt,
    }
  }
}
