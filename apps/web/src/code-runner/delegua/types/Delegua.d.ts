declare module '@designliquido/delegua/umd/delegua.js' {
  export class AvaliadorSintatico {
    analisar(resultadoLexador: any, indice: number): any
  }

  export class Lexador {
    mapear(linhas: string[], indice: number): any
  }

  export class TradutorJavaScript {
    traduzir(declaracoes: any[]): string
  }

  export class TradutorReversoJavaScript {
    traduzir(declaracoes: any[]): string
  }

  export class AvaliadorSintaticoJavaScript {
    analisar(resultadoLexico: any, indice: number): any
  }

  export class LexadorJavaScript {
    mapear(linhas: string[], indice: number): any
  }

  export * from '@designliquido/delegua'
}
