# Camada de Validação - Validação de Dados com Zod

A camada de validação é responsável por validar dados em toda a aplicação. Ela usa a biblioteca **Zod** para criar e gerenciar esquemas de validação.

## Estrutura

A camada de validação está localizada no diretório `./packages/validation`.

```
packages/validation/
└── src/
    ├── factories/
    │   └── ZodValidationErrorFactory.ts
    ├── modules/
    │   └── global/
    │       └── schemas/
    │           └── emailSchema.ts
    └── main.ts
```

- **`modules`**: Contém os esquemas de validação, organizados por domínio.
- **`factories`**: Contém fábricas para criar objetos relacionados à validação, como erros de validação.
- **`main.ts`**: O ponto de entrada do pacote.

## Esquemas

Os esquemas de validação são definidos usando **Zod** e são organizados por domínio no diretório `modules`. Isso garante que a lógica de validação esteja localizada junto com o domínio ao qual pertence.

**Exemplo: `emailSchema.ts`**

Este arquivo define um esquema Zod para validar endereços de e-mail. Ele estende um `stringSchema` base e adiciona uma regra de validação específica para e-mail.

```typescript
import { GLOBAL_ERROR_MESSAGES } from "../constants";
import { stringSchema } from "./stringSchema";

export const emailSchema = stringSchema.email(
  GLOBAL_ERROR_MESSAGES.email.regex,
);
```

## Tratamento de Erros

O arquivo `ZodValidationErrorFactory.ts` é responsável por criar objetos de erro de validação consistentes. Esta fábrica pega um erro Zod e o transforma em um objeto de erro personalizado que pode ser usado em toda a aplicação. Isso garante que os erros de validação sejam tratados de maneira uniforme.