import type {
  Declaracao,
  ResultadoParcialInterpretadorInterface,
} from '@designliquido/delegua'
import { Interpretador } from '@designliquido/delegua/interpretador'

export class DeleguaInterpretador extends Interpretador {
  override async executar(declaracao: Declaracao): Promise<any> {
    const resultado = await super.executar(declaracao)

    if (resultado) {
      this.resultadoInterpretador.push(
        this.paraTexto(resultado) as unknown as ResultadoParcialInterpretadorInterface,
      )
    }

    return resultado
  }
}
