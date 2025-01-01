import { Entity } from '#global/abstracts'
import { Image, Name, Slug } from '#global/structs'
import type { AuthorDto } from '#forum/dtos'

type AuthorProps = {
  name: Name
  slug: Slug
  avatar: {
    image: Image
    name: Name
  }
}

export class Author extends Entity<AuthorProps> {
  static create(dto: AuthorDto) {
    console.log(dto)
    return new Author(
      {
        name: Name.create(dto.name),
        slug: Slug.create(dto.slug),
        avatar: {
          image: Image.create(dto.avatar.image),
          name: Name.create(dto.avatar.name),
        },
      },
      dto.id,
    )
  }

  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get avatar() {
    return this.props.avatar
  }

  get dto(): AuthorDto {
    return {
      id: this.id,
      name: this.props.name.value,
      slug: this.props.slug.value,
      avatar: {
        name: this.avatar.name.value,
        image: this.avatar.image.value,
      },
    }
  }
}
