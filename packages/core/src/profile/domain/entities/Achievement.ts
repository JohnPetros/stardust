import { Entity } from '../../../global/domain/abstracts'
import { Image, Integer, Name, OrdinalNumber } from '#global/structs'
import { AchievementMetric } from '../structs'
import type { AchievementDto } from '../../dtos'

type AchievementProps = {
  name: Name
  icon: Image
  description: string
  reward: Integer
  metric: AchievementMetric
  requiredCount: Integer
  position: OrdinalNumber
}

export class Achievement extends Entity<AchievementProps> {
  static create(dto: AchievementDto) {
    return new Achievement(
      {
        name: Name.create(dto.name),
        metric: AchievementMetric.create(dto.metric),
        requiredCount: Integer.create(
          dto.requiredCount,
          'Contamge mínimia exigida pela conquista',
        ),
        reward: Integer.create(dto.reward, 'Recompensa da conquista'),
        position: OrdinalNumber.create(dto.position, 'Posição da conquitas'),
        icon: Image.create(dto.icon),
        description: dto.description,
      },
      dto?.id,
    )
  }

  get metric() {
    return this.props.metric
  }

  get reward() {
    return this.props.reward
  }

  get name() {
    return this.props.name
  }

  get icon() {
    return this.props.icon
  }

  get description() {
    return this.props.description
  }

  get requiredCount() {
    return this.props.requiredCount
  }

  get position() {
    return this.props.position
  }

  get dto(): AchievementDto {
    return {
      id: this.id,
      name: this.name.value,
      icon: this.icon.value,
      reward: this.reward.value,
      requiredCount: this.requiredCount.value,
      position: this.position.value,
      description: this.description,
      metric: String(this.metric.value),
    }
  }
}
