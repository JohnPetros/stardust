import { Entity } from '#global/domain/abstracts/index'
import {
  IdsList,
  Integer,
  type Logical,
  Name,
  OrdinalNumber,
  Slug,
  Text,
} from '#global/domain/structures/index'
import { GalaxyStatus } from '../structures/GalaxyStatus'
import type { GalaxyDto } from './dtos'

type GalaxyProps = {
  slug: Slug
  name: Name
  description: Text
  animation: Text
  position: OrdinalNumber
  status: GalaxyStatus
  planetsIds: IdsList
}

export class Galaxy extends Entity<GalaxyProps> {
  static create(dto: GalaxyDto): Galaxy {
    return new Galaxy(
      {
        slug: Slug.create(dto.slug, 'Slug da galáxia'),
        name: Name.create(dto.name, 'Nome da galáxia'),
        description: Text.create(dto.description, 'Descrição da galáxia'),
        animation: Text.create(dto.animation, 'Animação da galáxia'),
        position: OrdinalNumber.create(dto.position, 'Posição da galáxia'),
        status: GalaxyStatus.create(dto.status),
        planetsIds: IdsList.create(dto.planetsIds),
      },
      dto.id,
    )
  }

  countCompletedPlanets(completedPlanetsIds: IdsList): Integer {
    const completedCount = this.planetsIds.ids.filter(
      (planetId) => completedPlanetsIds.includes(planetId).isTrue,
    ).length
    return Integer.create(completedCount)
  }

  get slug(): Slug {
    return this.props.slug
  }

  get name(): Name {
    return this.props.name
  }

  get description(): Text {
    return this.props.description
  }

  get animation(): Text {
    return this.props.animation
  }

  get position(): OrdinalNumber {
    return this.props.position
  }

  get status(): GalaxyStatus {
    return this.props.status
  }

  get planetsIds(): IdsList {
    return this.props.planetsIds
  }

  get planetsCount(): Integer {
    return this.planetsIds.count
  }

  get isVisible(): Logical {
    return this.status.isVisible
  }

  get canBeEntered(): Logical {
    return this.status.isPublished
  }

  get dto(): GalaxyDto {
    return {
      id: this.id.value,
      slug: this.slug.value,
      name: this.name.value,
      description: this.description.value,
      animation: this.animation.value,
      position: this.position.value,
      status: this.status.value,
      planetsIds: this.planetsIds.dto,
    }
  }
}
