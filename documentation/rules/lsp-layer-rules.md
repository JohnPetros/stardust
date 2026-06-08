# Regras da Camada LSP

## Visao Geral

A camada **LSP** concentra os recursos de linguagem de Delegua consumidos por editores e superfices de code editing. No estado atual do projeto, essa camada nao implementa um servidor LSP completo; ela entrega um provider com execucao, analise, traducao de codigo, configuracao do Monaco e catalogos auxiliares de snippets/documentacao.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Expor capacidades de linguagem de Delegua para ferramentas de edicao e execucao assistida. |
| **Responsabilidades** | Executar codigo Delegua; gerar diagnosticos sintaticos e semanticos; traduzir entre JavaScript e Delegua; fornecer configuracao de linguagem para Monaco; publicar regex, tokens, snippets e documentacoes. |
| **Nao faz** | Implementar transporte/protocolo LSP em rede; definir contratos base da plataforma; acoplar UI diretamente ao parser/interpretador da lib externa. |

## Estrutura de Diretorios

| Caminho | Finalidade |
| --- | --- |
| `packages/lsp/src/DeleguaLsp.ts` | Provider principal que implementa `LspProvider` de `@stardust/core`. |
| `packages/lsp/src/DeleguaInterpretador.ts` | Extensao do interpretador da Delegua usada para capturar resultados de execucao. |
| `packages/lsp/src/DeleguaConfiguracaoParaEditorMonaco.ts` | Definicao de tokens Monarch e configuracao de linguagem do Monaco. |
| `packages/lsp/src/constants/` | Regex, tokens, snippets, exemplos e documentacoes da linguagem. |
| `packages/lsp/src/main.ts` | API publica do pacote. |
| `packages/lsp/types/DeleguaErro.ts` | Uniao de tipos de erro retornados pelo lexer, parser e interpretador. |

## API Publica

O arquivo `packages/lsp/src/main.ts` expoe:

- `DeleguaLsp`
- `DeleguaConfiguracaoParaEditorMonaco`
- `DELEGUA_DOCUMENTACOES`
- reexports de `./constants`

`DeleguaInterpretador` e os tipos internos de erro ficam como detalhe de implementacao e nao fazem parte da API publica principal.

## Responsabilidades do `DeleguaLsp`

A classe `DeleguaLsp` e o ponto central do pacote. Ela usa `@designliquido/delegua` para lexer, parser, analise semantica, interpretacao e traducao.

### Capacidades implementadas

- **Execucao**: `run(code)` interpreta codigo Delegua, coleta `outputs` e normaliza o valor final retornado.
- **Analise sintatica**: `performSyntaxAnalysis(code)` converte erros do parser em `LspError`/`LspResponse`.
- **Analise semantica**: `performSemanticAnalysis(code)` executa o analisador semantico e retorna diagnosticos padronizados.
- **Manipulacao de codigo**: `getInput`, `getInputsCount`, `addInputs`, `getFunctionName`, `getFunctionParamsNames`, `buildFunction` e `addFunctionCall` ajudam fluxos de edicao assistida.
- **Traducao**: `translateToLsp` converte valores/codigo JavaScript para sintaxe Delegua e `translateToJs` faz o caminho inverso.
- **Tratamento de erro**: `trateErro` adapta erros heterogeneos da lib externa para `LspResponse` consistente.

### Dependencias de contrato

- `LspProvider`, `CodeInput`, `LspResponse` e `LspError` vem de `@stardust/core`.
- A camada LSP depende do core para contratos; o core nao deve depender de `@stardust/lsp`.

## Monaco

`DeleguaConfiguracaoParaEditorMonaco` encapsula duas responsabilidades:

- `obterDefinicaoDeLinguagem()`: retorna a linguagem Monarch com keywords, operadores, comentarios, numeros, strings e regex de Delegua.
- `obterConfiguracaoDeLinguagem()`: retorna brackets, pares de fechamento automatico, regras de enter e identacao.

Essa classe deve permanecer focada em definicao de linguagem para editor. Logica de execucao, analise ou regras de negocio nao devem ser adicionadas aqui.

## Constantes e Catalogos

O diretorio `packages/lsp/src/constants/` agrupa dados estaticos usados pela experiencia de edicao:

- `DELEGUA_REGEX`: regex utilitarias para `leia`, `escreva` e assinaturas de funcao.
- `DELEGUA_TOKENS`: tokens auxiliares da linguagem.
- `DELEGUA_SNIPPETS`: agregacao de snippets por dominio (`globais`, `texto`, `lista`, `dicionarios`).
- `DELEGUA_EXAMPLE_SNIPPETS`: exemplos de codigo.
- `DELEGUA_DOCUMENTACOES`: agregacao de documentacoes usadas em hover/autocomplete.

Quando adicionar novos snippets ou documentacoes, prefira manter a segmentacao por dominio e agregar no arquivo-raiz correspondente.

## Regras

- **Contrato primeiro**: a implementacao concreta deve continuar aderente a `LspProvider` do core.
- **Adaptacao na borda**: erros da biblioteca `@designliquido/delegua` devem ser convertidos para tipos do core antes de sair da camada.
- **Sem transporte aqui**: qualquer servidor/protocolo LSP, websocket ou RPC deve viver fora deste pacote e consumir `DeleguaLsp` como dependencia.
- **Editor separado de runtime**: configuracao do Monaco nao deve importar o interpretador nem executar analises.
- **Dados estaticos isolados**: snippets, docs, regex e tokens devem ficar em `constants/`, evitando literals espalhados em classes.
- **Exports nomeados**: manter exports explicitos em `main.ts`; evitar expor implementacoes internas sem necessidade.

## Anti-padroes

### Anti-padrao: misturar detalhes de editor com execucao

**O que evitar:**
Adicionar em `DeleguaConfiguracaoParaEditorMonaco.ts` codigo de interpretacao, traducao ou analise.

**Por que esta errado:**
Isso mistura concerns de editor com runtime, dificulta manutencao e aumenta o acoplamento com `@designliquido/delegua` em um ponto que deveria conter apenas configuracao de linguagem.

**Como fazer:**
Toda logica executavel deve permanecer em `DeleguaLsp` ou em classes auxiliares de runtime, deixando Monaco apenas como adaptador de editor.

### Anti-padrao: vazar erros brutos da biblioteca externa

**O que evitar:**
Retornar `ErroLexador`, `ErroAvaliadorSintatico` ou erros do interpretador diretamente para consumidores externos.

**Por que esta errado:**
Isso quebra o contrato estavel da plataforma e acopla as camadas consumidoras aos detalhes de `@designliquido/delegua`.

**Como fazer:**
Converter sempre para `LspError`/`LspResponse`, como ja acontece nos fluxos de `run`, `performSyntaxAnalysis` e `performSemanticAnalysis`.

## Exemplo

```ts
import { DeleguaLsp } from '@stardust/lsp'

const lsp = new DeleguaLsp()

const syntax = await lsp.performSyntaxAnalysis('funcao soma(a, b) { retorna a + b }')
const semantic = await lsp.performSemanticAnalysis('constante x = y')
const execution = await lsp.run('escreva("Ola")')
```

## Integracao com Outras Camadas

- **Permitido**
  - Depender de `@stardust/core` para contratos e responses.
  - Depender de `@designliquido/delegua` para parsing, interpretacao e traducao.
  - Ser consumida por UI, RPC, REST ou ferramentas que precisem de recursos de linguagem.
- **Proibido**
  - `@stardust/core` importar `@stardust/lsp`.
  - Adicionar acesso a banco, fila ou transporte HTTP dentro de `packages/lsp`.
  - Espalhar dados de autocomplete/hover fora de `constants/` sem necessidade real.

## Checklist (antes do PR)

- Mudanca preserva o contrato de `LspProvider`.
- Novos erros continuam adaptados para `LspError`/`LspResponse`.
- Alteracoes de editor ficaram em `DeleguaConfiguracaoParaEditorMonaco.ts`.
- Alteracoes de runtime ficaram em `DeleguaLsp.ts`/`DeleguaInterpretador.ts`.
- Novos snippets/docs/tokens foram agregados pelos arquivos-raiz de `constants/`.
- `main.ts` expoe apenas a API publica necessaria.

## Notas

- O pacote publica `build/`, mas o campo `exports` aponta para `./src/main.ts`; mantenha isso em mente ao alterar estrategia de build/publicacao.
- Scripts locais do pacote: `build`, `typecheck`, `codecheck`, `lint` e `format`.
