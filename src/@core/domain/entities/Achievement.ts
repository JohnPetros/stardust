import type { AchievementDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts/BaseEntity'
import type { AchievementMetric } from '../types'

type AchievementProps = {
  id?: string
  name: string
  icon: string
  description: string
  reward: number
  metric: AchievementMetric
  requiredCount: number
  position: number
}

export class Achievement extends BaseEntity {
  private props: AchievementProps

  private constructor(props: AchievementProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: AchievementDTO) {
    return new Achievement(dto)
  }

  get dto(): AchievementDTO {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      description: this.description,
      reward: this.reward,
      requiredCount: this.requiredCount,
      position: this.position,
      metric: this.metric,
    }
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
}
