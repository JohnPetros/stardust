import type { RankingDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'
import { Name } from '../structs'

type RankingProps = {
  id?: string
  name: Name
  image: string
  position: number
  reward: number
}

export class Ranking extends BaseEntity {
  private props: RankingProps

  private constructor(props: RankingProps) {
    super(props.id)
    this.props = props
  }

  static create(dto: RankingDTO): Ranking {
    return new Ranking({
      id: dto.id,
      name: Name.create(dto.name),
      position: dto.position,
      image: dto.image,
      reward: dto.reward,
    })
  }

  get dto(): RankingDTO {
    return {
      id: this.id,
      image: this.image,
      name: this.name,
      position: this.position,
      reward: this.reward,
    }
  }

  get name() {
    return this.props.name.value
  }

  get image() {
    return this.props.image
  }

  get reward() {
    return this.props.reward
  }

  get position() {
    return this.props.position
  }
}
