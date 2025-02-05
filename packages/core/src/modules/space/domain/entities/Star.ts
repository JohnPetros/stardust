import { Entity } from '#global/abstracts'
import { OrdinalNumber, Slug, Name } from '#global/structs'
import type { StarDto } from '#space/dtos'

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

  get dto(): StarDto {
    return {
      id: this.id,
      name: this.name.value,
      number: this.number.value,
      slug: this.slug.value,
    }
  }

  get name() {
    return this.props.name
  }

  get number() {
    return this.props.number
  }

  get slug() {
    return this.props.slug
  }
}
