import type { RankingDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'
import { Image, Integer, Name, OrdinalNumber } from '../structs'

type RankingProps = {
  id?: string
  name: Name
  image: Image
  position: OrdinalNumber
  reward: Integer
}

export class Ranking extends BaseEntity {
  private props: RankingProps

  private constructor(props: RankingProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: RankingDTO): Ranking {
    console.log('dto.image', dto.image)
    return new Ranking({
      name: Name.create(dto.name),
      position: OrdinalNumber.create('ranking position', dto.position),
      reward: Integer.create('ranking reward', dto.reward),
      image: Image.create(dto.image),
      id: dto?.id,
    })
  }

  get dto(): RankingDTO {
    return {
      id: this.id,
      name: this.name.value,
      position: this.position.value,
      reward: this.reward.value,
      image: this.image.value,
    }
  }

  get name() {
    return this.props.name
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
