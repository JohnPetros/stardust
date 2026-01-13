import { Entity } from '#global/domain/abstracts/Entity'
import {
  Slug,
  OrdinalNumber,
  Name,
  Logical,
  Integer,
} from '#global/domain/structures/index'
import type { StarDto } from './dtos'

type StarsProps = {
  slug: Slug
  name: Name
  number: OrdinalNumber
  userCount: Integer
  unlockCount: Integer
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
        userCount: Integer.create(
          dto.userCount,
          'Quantidade de usuários que estão nessa estrela',
        ),
        unlockCount: Integer.create(
          dto.unlockCount,
          'Quantidade de usuários que completaram essa estrela',
        ),
        isChallenge: Logical.create(dto.isChallenge, 'A estrela é um desafio?'),
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

  get userCount(): Integer {
    return this.props.userCount
  }

  set userCount(userCount: Integer) {
    this.props.userCount = userCount
  }

  get unlockCount(): Integer {
    return this.props.unlockCount
  }

  set unlockCount(unlockCount: Integer) {
    this.props.unlockCount = unlockCount
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
      userCount: this.userCount.value,
      unlockCount: this.unlockCount.value,
      isChallenge: this.isChallenge.value,
      isAvailable: this.isAvailable.value,
    }
  }
}
