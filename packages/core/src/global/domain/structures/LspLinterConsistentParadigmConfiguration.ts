import type { LspLinterConsistentParadigmConfigurationDto } from './dtos'
import { Logical } from './Logical'
import { LspParadigm } from './LspParadigm'

export class LspLinterConsistentParadigmConfiguration {
  private constructor(
    readonly isEnabled: Logical,
    readonly paradigm: LspParadigm,
  ) {}

  static create(
    dto: LspLinterConsistentParadigmConfigurationDto,
  ): LspLinterConsistentParadigmConfiguration {
    return new LspLinterConsistentParadigmConfiguration(
      Logical.create(dto.isEnabled),
      LspParadigm.create(dto.paradigm),
    )
  }

  get dto(): LspLinterConsistentParadigmConfigurationDto {
    return {
      isEnabled: this.isEnabled.value,
      paradigm: this.paradigm.value,
    }
  }
}
