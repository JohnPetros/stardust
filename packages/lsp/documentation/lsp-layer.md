# Camada LSP - Language Server Protocol para Delegua

A camada LSP (Language Server Protocol) é responsável por fornecer recursos específicos da linguagem para a linguagem **Delegua**. Ela habilita recursos como autocompletar, diagnósticos e informações de hover em editores de código que suportam o LSP.

## Estrutura

A camada LSP está localizada no diretório `./packages/lsp`.

```
packages/lsp/
└── src/
    ├── constants/
    ├── DeleguaConfiguracaoParaEditorMonaco.ts
    ├── DeleguaInterpretador.ts
    ├── DeleguaLsp.ts
    └── main.ts
```

- **`DeleguaLsp.ts`**: O núcleo da implementação do LSP para a linguagem Delegua.
- **`DeleguaInterpretador.ts`**: Um interpretador para a linguagem Delegua.
- **`DeleguaConfiguracaoParaEditorMonaco.ts`**: Configuração para o Editor Monaco para integrar com o LSP do Delegua.
- **`constants/`**: Constantes relacionadas à implementação do LSP.
- **`main.ts`**: O ponto de entrada do pacote.

## DeleguaLsp

A classe `DeleguaLsp` é o coração da camada LSP. Ela implementa a interface `LspProvider` do pacote `core` e fornece os seguintes recursos:

- **Execução de Código**: O método `run` executa um bloco de código Delegua e retorna o resultado.
- **Análise Sintática e Semântica**: Os métodos `performSyntaxAnalysis` e `performSemanticAnalysis` analisam o código em busca de erros e retornam diagnósticos.
- **Manipulação de Código**: Métodos como `addInputs`, `addFunctionCall` e `buildFunction` permitem a manipulação programática do código Delegua.
- **Tradução**: Os métodos `translateToLsp` e `translateToJs` traduzem o código entre Delegua e JavaScript.

**Exemplo: `DeleguaLsp.ts`**

```typescript
export class DeleguaLsp implements LspProvider {
  private readonly lexador: Lexador = new Lexador();
  private readonly avaliadorSintatico: AvaliadorSintatico =
    new AvaliadorSintatico();
  private readonly analisadorSemantico: AnalisadorSemantico =
    new AnalisadorSemantico();

  async run(code: string) {
    // ... implementação
  }

  performSyntaxAnalysis(code: string): LspResponse {
    // ... implementação
  }

  performSemanticAnalysis(code: string): LspResponse {
    // ... implementação
  }

  // ... outros métodos
}
```

## Integração com o Editor Monaco

O arquivo `DeleguaConfiguracaoParaEditorMonaco.ts` fornece a configuração necessária para integrar o LSP do Delegua com o Editor Monaco. Isso permite que a aplicação web tenha uma experiência rica de edição de código para a linguagem Delegua.

## Interpretador

O arquivo `DeleguaInterpretador.ts` contém um interpretador para a linguagem Delegua. Isso é usado pelo método `run` na classe `DeleguaLsp` para executar o código.