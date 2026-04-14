import type { LspLinterConsistentParadigmConfigurationDto } from './LspLinterConsistentParadigmConfigurationDto'
import type { LspLinterNamingConventionConfigurationDto } from './LspLinterNamingConventionConfigurationDto'

export type LspLinterConfigurationDto = {
  isEnabled: boolean
  namingConvention: LspLinterNamingConventionConfigurationDto
  consistentParadigm: LspLinterConsistentParadigmConfigurationDto
}
