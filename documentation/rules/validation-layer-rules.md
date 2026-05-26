# Regras da Camada de Validation

## Visao Geral

A camada **Validation** centraliza os schemas Zod compartilhados entre as apps do monorepo. Ela define contratos de entrada na borda da aplicacao e padroniza validacoes reutilizaveis sem carregar regra de negocio do dominio.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Validar e normalizar dados de entrada com Zod antes que cheguem ao core ou aos adapters. |
| **Responsabilidades** | Declarar schemas reutilizaveis, compor schemas por modulo e traduzir erros do Zod para `ValidationError`. |
| **Nao faz** | Implementar regra de negocio de dominio; acessar banco; chamar servicos externos; depender de `apps/**`. |

## Estrutura de Diretorios

| Caminho | Finalidade |
| --- | --- |
| `packages/validation/src/main.ts` | Barrel principal do pacote. |
| `packages/validation/src/factories/` | Fabrica/utilitarios da camada, como traducao de `ZodError`. |
| `packages/validation/src/modules/global/schemas/` | Primitivos e schemas base reutilizaveis entre modulos. |
| `packages/validation/src/modules/<modulo>/` | Schemas especificos de cada contexto de dominio. |
| `packages/validation/src/modules/<modulo>/schemas/index.ts` | Barrel do modulo quando ele expoe schemas. |

## Regras

- **Zod como padrao**: toda validacao compartilhada deve ser implementada com `zod`.
- **Composicao primeiro**: prefira compor schemas a partir de bases reutilizaveis como `stringSchema`, `idSchema`, `nameSchema` e similares.
- **Mensagens no proprio schema**: mensagens de erro devem ser definidas inline no schema, em PT-BR, proximas da regra que as dispara.
- **Sem catalogo global de mensagens**: nao criar constantes genericas como `GLOBAL_ERROR_MESSAGES` para centralizar textos de validacao.
- **Schemas globais em `global/schemas`**: validacoes transversais e primitivas reutilizaveis devem ficar no modulo `global`.
- **Schemas de dominio por modulo**: validacoes especificas de um contexto devem ficar dentro do proprio modulo (`auth`, `challenging`, `lesson`, etc.).
- **Arquivos pequenos e focados**: cada arquivo deve exportar um schema principal.
- **Exports por barrel**: todo schema novo deve ser exposto no `index.ts` do modulo e, quando aplicavel, no `src/main.ts`.
- **Transformacoes explicitas**: use `.transform()` apenas quando a camada realmente precisar normalizar entrada, como query params ou listas.
- **Sem dependencia de app**: o pacote pode depender de `@stardust/core`, mas nunca de `apps/web`, `apps/server` ou `apps/studio`.

## Padroes

### Schemas base reutilizaveis

Schemas de baixo nivel devem capturar a regra mais comum daquele tipo e servir como bloco de construcao para outros schemas.

Exemplo real:

```ts
import { z } from 'zod'

export const stringSchema = z.string({ required_error: 'Campo obrigatório' })
```

### Extensao e composicao

Quando um schema representa uma estrutura maior, ele deve reaproveitar schemas existentes em vez de reescrever as mesmas regras.

Exemplo real:

```ts
export const nameSchema = stringSchema
  .min(3, 'Nome deve conter pelo menos 3 caracteres')
  .max(100, 'Nome deve conter no máximo 100 caracteres')
```

Exemplo de composicao entre modulos:

```ts
export const challengeFormSchema = challengeSchema.extend({
  title: titleSchema,
  description: contentSchema,
  author: z.object({
    id: idSchema,
  }),
  difficultyLevel: challengeDifficultyLevelSchema,
})
```

### Normalizacao de entrada

Transformacoes sao permitidas quando a camada precisa converter formatos de transporte em tipos mais convenientes para consumo posterior.

Exemplo real:

```ts
export const queryParamBooleanSchema = z
  .enum(['true', 'false'])
  .transform((val) => val === 'true')
```

## Tratamento de Erros

Erros do Zod devem ser convertidos para o formato padrao do projeto via `ZodValidationErrorFactory`.

Responsabilidades da factory:

- Agrupar mensagens por campo a partir de `zodError.issues`.
- Produzir uma instancia de `ValidationError` do core.
- Manter a traducao de erro fora dos schemas, preservando os schemas focados apenas em validar e transformar dados.

## Anti-padroes

### Anti-padrao: centralizar todas as mensagens em um objeto global

**O que evitar:**
Criar arquivos como `GLOBAL_ERROR_MESSAGES` e referenciar as mensagens por chave em todos os schemas.

**Por que esta errado:**
Afasta a mensagem da regra que a utiliza, piora a legibilidade do schema, aumenta acoplamento desnecessario e dificulta manutencao localizada.

**Como fazer:**
Defina a mensagem diretamente na chamada do metodo do schema.

Exemplo correto:

```ts
export const passwordSchema = stringSchema.min(
  6,
  'Sua senha deve conter pelo menos 6 caracteres',
)
```

### Anti-padrao: reescrever validacoes base em schemas de dominio

**O que evitar:**
Declarar `z.string()` com as mesmas regras em varios modulos quando ja existe um schema global equivalente.

**Como fazer:**
Reutilize o schema base e acrescente apenas as restricoes especificas daquele caso.

## Integracao com Outras Camadas

- **Core**: pode importar tipos/erros do core, como `ValidationError`.
- **Apps**: `web`, `server` e `studio` consomem os schemas deste pacote, mas o pacote nao importa nada delas.
- **Borda**: controllers, actions, routes, tools e formularios devem usar estes schemas para validar input.
- **Direcao de dependencia**: `apps/** -> packages/validation -> @stardust/core`.

## Checklist (antes do PR)

- O schema novo esta no modulo correto.
- A mensagem de erro esta no proprio schema e em PT-BR.
- O schema reutiliza bases globais quando fizer sentido.
- O arquivo exporta um unico schema principal com nome claro.
- O `index.ts` do modulo foi atualizado.
- O `src/main.ts` foi atualizado quando o modulo faz parte da API publica do pacote.
- Nenhuma dependencia de `apps/**` foi introduzida.

## Notas

- O pacote expoe seus contratos publicos por `packages/validation/src/main.ts` e por subpaths definidos em `packages/validation/package.json`.
- `global/schemas` deve permanecer como a fonte principal de primitives compartilhadas.
