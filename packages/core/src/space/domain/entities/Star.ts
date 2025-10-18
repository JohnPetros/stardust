import { Entity } from '#global/domain/abstracts/Entity'
import { Slug, OrdinalNumber, Name, Logical } from '#global/domain/structures/index'
import type { StarDto } from './dtos'

type StarsProps = {
  slug: Slug
  name: Name
  number: OrdinalNumber
  isAvailable: Logical
  isChallenge: Logical
}

export class Star extends Entity<StarsProps> {
  static create(dto: StarDto): Star {
    return new Star(
      {
        slug: Slug.create(dto.slug),
        name: Name.create(dto.name),
        number: OrdinalNumber.create(dto.number, 'Número da estrela'),
        isAvailable: Logical.create(
          dto.isAvailable,
          'A estrela está disponível para os usuários?',
        ),
        isChallenge: Logical.create(
          dto.isChallenge,
          'A estrela é um desafio?',
        ),
      },
      dto?.id,
    )
  }

  get name(): Name {
    return this.props.name
  }

  set name(name: Name) {
    if (this.props.name.isEqualTo(name).isTrue) {
      this.props.name = name.deduplicate()
      this.props.slug = name.slug
      return
    }
    this.props.name = name
    this.props.slug = name.slug
  }

  get number(): OrdinalNumber {
    return this.props.number
  }

  set number(number: OrdinalNumber) {
    this.props.number = number
  }

  get slug(): Slug {
    return this.props.slug
  }

  get isChallenge(): Logical {
    return this.props.isChallenge
  }

  set isChallenge(isChallenge: Logical) {
    this.props.isChallenge = isChallenge
  }

  get isAvailable(): Logical {
    return this.props.isAvailable
  }

  set isAvailable(isAvailable: Logical) {
    this.props.isAvailable = isAvailable
  }

  get dto(): StarDto {
    return {
      id: this.id.value,
      name: this.name.value,
      number: this.number.value,
      slug: this.slug.value,
      isChallenge: this.isChallenge.value,
      isAvailable: this.isAvailable.value,
    }
  }
}
