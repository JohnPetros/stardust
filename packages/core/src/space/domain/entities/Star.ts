import { Entity } from '#global/domain/abstracts/Entity'
import { Slug, OrdinalNumber, Name } from '#global/domain/structures/index'
import type { StarDto } from './dtos'

type StarsProps = {
  slug: Slug
  name: Name
  number: OrdinalNumber
}

export class Star extends Entity<StarsProps> {
  static create(dto: StarDto): Star {
    return new Star(
      {
        slug: Slug.create(dto.slug),
        name: Name.create(dto.name),
        number: OrdinalNumber.create(dto.number, 'Número da estrela'),
      },
      dto?.id,
    )
  }

  get name(): Name {
    return this.props.name
  }

  get number(): OrdinalNumber {
    return this.props.number
  }

  get slug(): Slug {
    return this.props.slug
  }

  get dto(): StarDto {
    return {
      id: this.id.value,
      name: this.name.value,
      number: this.number.value,
      slug: this.slug.value,
    }
  }
}
