import type { Mcp, Tool } from '@stardust/core/global/interfaces'

const documentationComponentsGuide = `## Guia de Componentes de Documentação

Este guia descreve os componentes disponíveis para escrever documentações
na plataforma, com exemplos de uso e boas práticas.

---

## ⛔ Regras Globais — Leia antes de escrever qualquer documentação

### 1. Nunca aninhe blocos de texto
É estritamente proibido colocar um componente de bloco de texto dentro de
outro. Nunca coloque \`Text\`, \`Alert\`, \`Quote\` ou \`Code\` dentro de
outro \`Text\`, \`Alert\`, \`Quote\` ou \`Code\`.

### 2. Nunca use negrito com **...**
É estritamente proibido usar \`**...**\` dentro de qualquer componente de
bloco de texto (\`Text\`, \`Alert\`, \`Quote\`). Isso inclui qualquer
tentativa de dar ênfase a termos, títulos ou palavras-chave dentro desses
blocos. Para destacar um termo dentro de um bloco, use code inline com
crases simples \`\`.

\`\`\`mdx
<Text>
  O valor retornado é sempre do tipo **texto**.  ❌ ERRADO
</Text>

<Text>
  O valor retornado é sempre do tipo \`texto\`.   ✅ CORRETO
</Text>
\`\`\`

### 3. Nunca use Code para referências curtas
Para referenciar código dentro de um parágrafo de texto, use a notação de
code inline com crases simples \`\` em vez do componente \`Code\`.

---

### Text

<Text>
  O componente \`Text\` é o bloco principal para escrever parágrafos e
  descrições. Use-o para introduzir conceitos, explicar comportamentos e
  contextualizar exemplos.
</Text>

**Quando usar:**
- Introduções e explicações gerais
- Descrições de conceitos e comportamentos
- Contexto antes ou depois de exemplos de código

**Exemplo:**

\`\`\`mdx
<Text>
  Variáveis são estruturas que armazenam um valor em memória e podem ter
  esse valor alterado ao longo do programa.
</Text>
\`\`\`

**Exemplo do que NÃO fazer:**

\`\`\`mdx
<Text>
  Explicação sobre variáveis.
  <Alert>
    Isso é inválido!        ❌ bloco dentro de bloco
  </Alert>
</Text>

<Text>
  O valor retornado é sempre do tipo **texto**.  ❌ negrito proibido
</Text>
\`\`\`

---

### Alert

<Text>
  O componente \`Alert\` é usado para destacar informações importantes,
  advertências ou observações que o leitor não deve ignorar.
</Text>

**Quando usar:**
- Avisos sobre comportamentos inesperados
- Restrições ou limitações de um recurso
- Observações críticas sobre o uso correto de um recurso

**Exemplo:**

\`\`\`mdx
<Alert>
  O valor retornado por \`leia()\` é sempre do tipo \`texto\`. Para
  utilizá-lo como número, use as funções de conversão.
</Alert>
\`\`\`

---

### Quote

<Text>
  O componente \`Quote\` é usado para destacar definições, regras, dicas
  ou citações relevantes ao conteúdo.
</Text>

**Quando usar:**
- Definições curtas e diretas
- Regras e convenções da linguagem
- Dicas e boas práticas
- Resumos de comportamento

**Exemplo:**

\`\`\`mdx
<Quote>
  \`==\` → Igual a
</Quote>

<Quote>
  \`!=\` → Diferente de
</Quote>
\`\`\`

---

### Code

<Text>
  O componente \`Code\` é usado para exibir blocos de código.
</Text>

**Quando usar:**
- Exemplos de sintaxe
- Declarações e expressões da linguagem
- Ilustração de comportamentos e resultados

**Exemplo:**

\`\`\`mdx
<Code>
var nome = 'Ítalo'
escreva("Olá, \${nome}!")
// Resultado: Olá, Ítalo!
</Code>
\`\`\`

---

### Combinando os componentes

<Text>
  Os componentes devem ser combinados de forma a criar um fluxo de leitura
  natural: apresente o conceito com \`Text\`, destaque regras com \`Quote\` ou
  \`Alert\`, e ilustre com \`Code\`.
</Text>

**Exemplo de estrutura recomendada:**

\`\`\`mdx
<Text>
  O laço \`para\` percorre uma sequência com base em três expressões:
  inicializador, condição e passo.
</Text>

<Alert>
  Qualquer uma das três partes pode ficar em branco.
</Alert>

<Quote>
  Se a condição for omitida, o laço será infinito.
</Quote>

<Code>
para (var i = 0; i < 3; i++) {
  escreva(i)
}
// Resultado:
// 0
// 1
// 2
</Code>
\`\`\`

---

### Resumo rápido

| Componente | Uso principal                                  |
|---|---|
| \`Text\`     | Parágrafos, explicações e contexto           |
| \`Alert\`    | Avisos, restrições e observações importantes |
| \`Quote\`    | Definições, regras, dicas e boas práticas    |
| \`Code\`     | Exemplos de código                           |`

export class GetMdxBlocksGuideTool implements Tool {
  async handle(_: Mcp) {
    return {
      guide: documentationComponentsGuide,
    }
  }
}
