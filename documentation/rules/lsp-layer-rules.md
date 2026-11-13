# LSP Layer - Language Server Protocol for Delegua

The LSP (Language Server Protocol) layer is responsible for providing language-specific features for the **Delegua** language. It enables features such as autocomplete, diagnostics and hover information in code editors that support the LSP.

## Structure

The LSP layer is located in the `./packages/lsp` directory.

```
packages/lsp/
└── src/
    ├── constants/
    ├── DeleguaConfiguracaoParaEditorMonaco.ts
    ├── DeleguaInterpretador.ts
    ├── DeleguaProvedorLsp.ts
    └── main.ts
```

- **`DeleguaProvedorLsp.ts`**: The core of the LSP implementation for the Delegua language.
- **`DeleguaInterpretador.ts`**: An interpreter for the Delegua language.
- **`DeleguaConfiguracaoParaEditorMonaco.ts`**: Configuration for the Monaco Editor to integrate with the Delegua LSP.
- **`constants/`**: Constants related to the LSP implementation.
- **`main.ts`**: The package entry point.

## DeleguaProvedorLsp

The `DeleguaProvedorLsp` class is the heart of the LSP layer. It implements the `LspProvider` interface of the `core` package and provides the following features:

- **Code Execution**: The `run` method executes a block of Delegua code and returns the result.
- **Syntactic and Semantic Analysis**: The `performSyntaxAnalysis` and `performSemanticAnalysis` methods analyze the code for errors and return diagnostics.
- **Autocomplete**: The `getCompletions` method exposes editor-agnostic suggestions via the `core` contract, combining static catalogs with symbols extracted from the open code.
- **Code Manipulation**: Methods such as `addInputs`, `addFunctionCall` and `buildFunction` allow programmatic manipulation of Delegua code.
- **Translation**: The `translateToLsp` and `translateToJs` methods translate code between Delegua and JavaScript.

**Example: `DeleguaProvedorLsp.ts`**

```typescript
export class DeleguaProvedorLsp implements LspProvider {
  private readonly lexador: Lexador = new Lexador();
  private readonly avaliadorSintatico: AvaliadorSintatico =
    new AvaliadorSintatico();
  private readonly analisadorSemantico: AnalisadorSemantico =
    new AnalisadorSemantico();

  async run(code: string) {
    // ... implementation
  }

  performSyntaxAnalysis(code: string): LspResponse {
    // ... implementation
  }

  performSemanticAnalysis(code: string): LspResponse {
    // ... implementation
  }

  getCompletions(code: string): LspCompletion[] {
    // ... implementation
  }

  // ... other methods
}
```

## Monaco Editor Integration

The `DeleguaConfiguracaoParaEditorMonaco.ts` file provides the configuration needed to integrate the Delegua LSP with the Monaco Editor. This gives the web application a rich code editing experience for the Delegua language.

Autocomplete suggestions must stay in the agnostic `LspCompletion` contract
of `core`; the UI only does the final adaptation to Monaco's `CompletionItem`
with `range`, `kind` and snippet rules.

## Interpreter

The `DeleguaInterpretador.ts` file contains an interpreter for the Delegua language. This is used by the `run` method in the `DeleguaProvedorLsp` class to execute the code.
