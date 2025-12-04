import { Percentage } from './Percentage'
import { Integer } from './Integer'
import type { Logical } from './Logical'
import type { KpiDto } from './dtos'

export class Kpi {
  private constructor(
    readonly currentValue: Integer,
    readonly previousValue: Integer,
  ) {}

  static create(currentValue: number, previousValue: number) {
    return new Kpi(Integer.create(currentValue), Integer.create(previousValue))
  }

  get trendPercentage(): Percentage {
    if (this.currentValue.isEqualTo(this.previousValue).isTrue) {
      return Percentage.create(0, 0)
    }

    if (this.currentValue.isGreaterThan(this.previousValue).isTrue) {
      return Percentage.create(this.previousValue.value, this.currentValue.value)
    }
    return Percentage.create(this.currentValue.value, this.previousValue.value)
  }

  get isTrendingUp(): Logical {
    return this.currentValue.isGreaterThan(this.previousValue)
  }

  get isTrendingDown(): Logical {
    return this.currentValue.isLessThan(this.previousValue)
  }

  get dto(): KpiDto {
    return {
      currentValue: this.currentValue.value,
      previousValue: this.previousValue.value,
    }
  }
}
