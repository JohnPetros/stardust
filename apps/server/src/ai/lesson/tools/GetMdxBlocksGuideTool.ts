import type { Mcp, Tool } from '@stardust/core/global/interfaces'

const documentationComponentsGuide = `## Guia de Componentes de Documentação

Este guia define as regras de formatação para escrever documentações na plataforma.

---

## Regras

### 1. Use texto markdown simples para explicações
Parágrafos, listas e títulos devem ser escritos em markdown puro, sem componentes.

### 2. Use \`Code\` apenas para blocos de código com múltiplas linhas
\`Code\` é o único componente permitido. Nunca use \`Text\`, \`Alert\` ou \`Quote\`.

### 3. Não coloque texto explicativo dentro de \`Code\`
O bloco \`Code\` deve conter apenas código. Explicações ficam fora, em markdown simples.

### 4. Não use \`Code\` para trechos de uma linha
Para referenciar código em linha, use crases simples: \`variavel\`, \`funcao()\`.

### 5. Não aninhe blocos \`Code\`
É proibido colocar um \`Code\` dentro de outro \`Code\`.

### 6. Não use negrito dentro de \`Code\`
É proibido usar \`**...**\` dentro de um bloco \`Code\`.
---

## Exemplos

Declaração de variável e saída:

<Code>
var nome = 'Ítalo'
escreva("Olá, \${nome}!")
</Code>

Operadores de comparação:

<Code>
nome == 'Ítalo'
nome != 'João'
</Code>

Laço com passo:

<Code>
para (var i = 0; i < 3; i++) {
  escreva(i)
}
</Code>

Leitura de entrada do usuário:

<Code>
var entrada = leia()
var numero = numero(entrada)
</Code>`
export class GetMdxBlocksGuideTool implements Tool {
  async handle(_: Mcp) {
    return {
      guide: documentationComponentsGuide,
    }
  }
}
