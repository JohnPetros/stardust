import { ExecutorDeCodigoDelegua } from '@/code-runner/delegua/ExecutorDeCodigoDelegua'
import {
  obtenhaConfiguracaoDeLinguagemDeleguaParaEditorMonaco,
  obtenhaTokenizadorDeleguaParaEditorMonaco,
} from '@/code-runner/delegua/utils'

export function useCodeRunner() {
  return {
    language: 'delegua',
    getMonacoTokensProvider: obtenhaTokenizadorDeleguaParaEditorMonaco,
    getMonacoLanguageConfiguration: obtenhaConfiguracaoDeLinguagemDeleguaParaEditorMonaco,
    provider: ExecutorDeCodigoDelegua(),
  }
}
