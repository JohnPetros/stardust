import { Entity } from '#global/domain/abstracts/index'
import { Id } from '#global/domain/structures/Id'
import { Name } from '#global/domain/structures/Name'
import { Slug } from '#global/domain/structures/Slug'
import { Url } from '#global/domain/structures/Url'
import type { ChallengeSourceDto } from './dtos'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type ChallengeSourceChallenge = {
  id: Id
  title: Name
  slug: Slug
}

type ChallengeSourceProps = {
  url: Url
  position: OrdinalNumber
  challenge: ChallengeSourceChallenge | null
}

export class ChallengeSource extends Entity<ChallengeSourceProps> {
  static create(dto: ChallengeSourceDto): ChallengeSource {
    return new ChallengeSource(
      {
        url: Url.create(dto.url),
        position: OrdinalNumber.create(dto.position),
        challenge: dto.challenge
          ? {
              id: Id.create(dto.challenge.id),
              title: Name.create(dto.challenge.title),
              slug: Slug.create(dto.challenge.slug),
            }
          : null,
      },
      dto.id,
    )
  }

  linkToChallenge(challenge: ChallengeSourceChallenge): void {
    this.props.challenge = challenge
  }

  get url(): Url {
    return this.props.url
  }

  set url(url: Url) {
    this.props.url = url
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

  set challenge(challenge: ChallengeSourceChallenge | null) {
    this.props.challenge = challenge
  }

  get dto(): ChallengeSourceDto {
    return {
      id: this.id.value,
      url: this.url.value,
      position: this.position.value,
      challenge: this.challenge
        ? {
            id: this.challenge.id.value,
            title: this.challenge.title.value,
            slug: this.challenge.slug.value,
          }
        : null,
    }
  }
}
