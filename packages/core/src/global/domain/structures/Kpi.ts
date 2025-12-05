import { Percentage } from './Percentage'
import { Integer } from './Integer'
import type { Logical } from './Logical'
import type { KpiDto } from './dtos'

export class Kpi {
  private constructor(
    readonly value: Integer,
    readonly currentMonthValue: Integer,
    readonly previousMonthValue: Integer,
  ) {}

  static create(dto: KpiDto) {
    return new Kpi(
      Integer.create(dto.value),
      Integer.create(dto.currentMonthValue),
      Integer.create(dto.previousMonthValue),
    )
  }

  get trendPercentage(): Percentage {
    if (this.currentMonthValue.isEqualTo(this.previousMonthValue).isTrue) {
      return Percentage.create(0, 0)
    }

    if (this.currentMonthValue.isGreaterThan(this.previousMonthValue).isTrue) {
      return Percentage.create(
        this.previousMonthValue.value,
        this.currentMonthValue.value,
      )
    }
    return Percentage.create(this.currentMonthValue.value, this.previousMonthValue.value)
  }

  get isTrendingUp(): Logical {
    return this.currentMonthValue.isGreaterThan(this.previousMonthValue)
  }

  get isTrendingDown(): Logical {
    return this.currentMonthValue.isLessThan(this.previousMonthValue)
  }

  get dto(): KpiDto {
    return {
      value: this.value.value,
      currentMonthValue: this.currentMonthValue.value,
      previousMonthValue: this.previousMonthValue.value,
    }
  }
}
