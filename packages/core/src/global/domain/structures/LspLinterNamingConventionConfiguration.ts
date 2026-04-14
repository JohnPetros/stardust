import type { LspLinterNamingConventionConfigurationDto } from './dtos'
import { Logical } from './Logical'
import { NamingConvention } from './NamingConvention'

export class LspLinterNamingConventionConfiguration {
  private constructor(
    readonly isEnabled: Logical,
    readonly variableNaming: NamingConvention,
    readonly constantNaming: NamingConvention,
    readonly functionNaming: NamingConvention,
  ) {}

  static create(
    dto: LspLinterNamingConventionConfigurationDto,
  ): LspLinterNamingConventionConfiguration {
    return new LspLinterNamingConventionConfiguration(
      Logical.create(dto.isEnabled),
      NamingConvention.create(dto.variable),
      NamingConvention.create(dto.constant),
      NamingConvention.create(dto.function),
    )
  }

  get dto(): LspLinterNamingConventionConfigurationDto {
    return {
      isEnabled: this.isEnabled.value,
      variable: this.variableNaming.value,
      constant: this.constantNaming.value,
      function: this.functionNaming.value,
    }
  }
}
