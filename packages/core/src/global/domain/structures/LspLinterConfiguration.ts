import type { LspLinterConfigurationDto } from './dtos'
import { LspLinterConsistentParadigmConfiguration } from './LspLinterConsistentParadigmConfiguration'
import { LspLinterNamingConventionConfiguration } from './LspLinterNamingConventionConfiguration'
import { Logical } from './Logical'

export class LspLinterConfiguration {
  private constructor(
    readonly isEnabled: Logical,
    readonly namingConvention: LspLinterNamingConventionConfiguration,
    readonly consistentParadigm: LspLinterConsistentParadigmConfiguration,
  ) {}

  static create(dto: LspLinterConfigurationDto): LspLinterConfiguration {
    return new LspLinterConfiguration(
      Logical.create(dto.isEnabled),
      LspLinterNamingConventionConfiguration.create(dto.namingConvention),
      LspLinterConsistentParadigmConfiguration.create(dto.consistentParadigm),
    )
  }

  get dto(): LspLinterConfigurationDto {
    return {
      isEnabled: this.isEnabled.value,
      namingConvention: this.namingConvention.dto,
      consistentParadigm: this.consistentParadigm.dto,
    }
  }
}
