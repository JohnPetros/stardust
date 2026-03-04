import { Entity } from '#global/domain/abstracts/index'
import { Id } from '#global/domain/structures/Id'
import { Name } from '#global/domain/structures/Name'
import { Slug } from '#global/domain/structures/Slug'
import { Url } from '#global/domain/structures/Url'
import type { ChallengeSourceDto } from './dtos'
import { Logical } from '#global/domain/structures/Logical'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type ChallengeSourceChallenge = {
  id: Id
  title: Name
  slug: Slug
}

type ChallengeSourceProps = {
  isUsed: Logical
  url: Url
  position: OrdinalNumber
  challenge: ChallengeSourceChallenge | null
}

export class ChallengeSource extends Entity<ChallengeSourceProps> {
  static create(dto: ChallengeSourceDto): ChallengeSource {
    return new ChallengeSource(
      {
        isUsed: Logical.create(dto.isUsed),
        url: Url.create(dto.url),
        position: OrdinalNumber.create(dto.position),
        challenge: {
          id: Id.create(dto.challenge.id),
          title: Name.create(dto.challenge.title),
          slug: Slug.create(dto.challenge.slug),
        },
      },
      dto.id,
    )
  }

  get isUsed(): Logical {
    return this.props.isUsed
  }

  get url(): Url {
    return this.props.url
  }

  get position(): OrdinalNumber {
    return this.props.position
  }

  set position(position: OrdinalNumber) {
    this.props.position = position
  }

  get challenge(): ChallengeSourceChallenge | null {
    return this.props.challenge
  }

  get dto(): ChallengeSourceDto {
    return {
      id: this.id.value,
      url: this.url.value,
      isUsed: this.isUsed.value,
      position: this.position.value,
      challenge: {
        id: this.challenge?.id.value ?? '',
        title: this.challenge?.title.value ?? '',
        slug: this.challenge?.slug.value ?? '',
      },
    }
  }
}
