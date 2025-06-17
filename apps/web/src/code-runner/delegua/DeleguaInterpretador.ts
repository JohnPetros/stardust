import type { Declaracao } from '@designliquido/delegua'
import { Interpretador } from '@designliquido/delegua/interpretador'

export class DeleguaInterpretador extends Interpretador {
  override async executar(
    declaracao: Declaracao,
    mostrarResultado = false,
  ): Promise<any> {
    const resultado = await super.executar(declaracao)

    if (resultado) {
      this.resultadoInterpretador.push(this.paraTexto(resultado))
    }

    return resultado
  }
}
