# LSP Layer - Language Server Protocol for Delegua

The LSP (Language Server Protocol) layer is responsible for providing language-specific features for the **Delegua** language. It enables features like code completion, diagnostics, and hover information in code editors that support the LSP.

## Structure

The LSP layer is located in the `/home/petros/stardust/packages/lsp` directory.

```
packages/lsp/
└── src/
    ├── constants/
    ├── DeleguaConfiguracaoParaEditorMonaco.ts
    ├── DeleguaInterpretador.ts
    ├── DeleguaLsp.ts
    └── main.ts
```

- **`DeleguaLsp.ts`**: The core of the LSP implementation for the Delegua language.
- **`DeleguaInterpretador.ts`**: An interpreter for the Delegua language.
- **`DeleguaConfiguracaoParaEditorMonaco.ts`**: Configuration for the Monaco Editor to integrate with the Delegua LSP.
- **`constants/`**: Constants related to the LSP implementation.
- **`main.ts`**: The entry point of the package.

## DeleguaLsp

The `DeleguaLsp` class is the heart of the LSP layer. It implements the `LspProvider` interface from the `core` package and provides the following features:

- **Code Execution**: The `run` method executes a block of Delegua code and returns the result.
- **Syntax and Semantic Analysis**: The `performSyntaxAnalysis` and `performSemanticAnalysis` methods analyze the code for errors and return diagnostics.
- **Code Manipulation**: Methods like `addInputs`, `addFunctionCall`, and `buildFunction` allow for programmatic manipulation of the Delegua code.
- **Translation**: The `translateToLsp` and `translateToJs` methods translate code between Delegua and JavaScript.

**Example: `DeleguaLsp.ts`**

```typescript
export class DeleguaLsp implements LspProvider {
  private readonly lexador: Lexador = new Lexador()
  private readonly avaliadorSintatico: AvaliadorSintatico = new AvaliadorSintatico()
  private readonly analisadorSemantico: AnalisadorSemantico = new AnalisadorSemantico()

  async run(code: string) {
    // ... implementation
  }

  performSyntaxAnalysis(code: string): LspResponse {
    // ... implementation
  }

  performSemanticAnalysis(code: string): LspResponse {
    // ... implementation
  }

  // ... other methods
}
```

## Monaco Editor Integration

The `DeleguaConfiguracaoParaEditorMonaco.ts` file provides the necessary configuration to integrate the Delegua LSP with the Monaco Editor. This allows the web application to have a rich code editing experience for the Delegua language.

## Interpreter

The `DeleguaInterpretador.ts` file contains an interpreter for the Delegua language. This is used by the `run` method in the `DeleguaLsp` class to execute the code.