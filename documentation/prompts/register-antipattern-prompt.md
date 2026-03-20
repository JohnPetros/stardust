---
description: Registra um anti-padrão cometido durante a implementação no doc de rules da camada correspondente, para evitar reincidência nas próximas sessões.
---

# Prompt: Registrar Anti-padrão

**Objetivo:** Documentar um erro de implementação cometido pela IA no arquivo
de regras da camada correspondente, de forma clara e acionável — para que o
mesmo anti-padrão não se repita em sessões futuras.

> Antes de registrar o anti-padrão, leia:
> - `documentation/overview.md`
> - `documentation/architecture.md`
> - `documentation/rules/rules.md`

---

## Entrada

- **Descrição do anti-padrão:** o que foi feito de errado e em qual contexto
  (texto livre, trecho de código, descrição do comportamento incorreto).
- **Camada afetada** (opcional): se já souber, informe a camada
  (`core`, `database`, `rest`, `rpc`, `queue`, `ui`, `realtime`,
  `provision`, `testing`, `code-conventions`, `web`, `server`, `studio`). Se
  não souber, o prompt identifica automaticamente.

---

## Diretrizes de Execução

### 1. Identificar o doc de rules correto

Leia `documentation/rules/rules.md` e, com base na descrição do anti-padrão,
identifique o arquivo de regras da camada afetada:

| Camada | Arquivo |
|---|---|
| Regra de negócio / domínio | `documentation/rules/core-package-rules.md` |
| Persistência / repositórios / mappers | `documentation/rules/database-rules.md` |
| Comunicação HTTP / `RestClient` / services REST | `documentation/rules/rest-layer-rules.md` |
| Actions / contrato `Call` / RPC | `documentation/rules/rpc-layer-rules.md` |
| Jobs assíncronos / Inngest / broker | `documentation/rules/queue-layer-rules.md` |
| Widgets / hooks / views / stores | `documentation/rules/ui-layer-rules.md` |
| Canais em tempo real / listeners | `documentation/rules/realtime-rules.md` |
| Providers / gateways de terceiros | `documentation/rules/provision-layer-rules.md` |
| Convenções de código / nomeação / factories | `documentation/rules/code-conventions-rules.md` |
| Regras da app web | `documentation/rules/web-application-rules.md` |
| Regras da app server | `documentation/rules/server-application-rules.md` |
| Regras da app studio | `documentation/rules/studio-appllication-rules.md` |
| Testes de handlers | `documentation/rules/handlers-testing-rules.md` |
| Testes de use cases | `documentation/rules/use-cases-testing-rules.md` |
| Testes de widgets | `documentation/rules/widget-tests-rules.md` |
| Testes de objetos de domínio | `documentation/rules/domain-objects-testing-rules.md` |

Se o anti-padrão cruzar mais de uma camada, registre em todos os docs
relevantes.

> Use os nomes e paths reais do projeto. Não invente arquivos de rules.

### 2. Formatar a entrada do anti-padrão

Estruture o registro no seguinte formato antes de inserir no doc de rules:

```markdown
### Anti-padrão: <Título curto e descritivo>

**O que foi feito:**
<Descrição objetiva do erro cometido, com trecho de código se disponível.>

**Por que está errado:**
<Explicação do impacto arquitetural, violação de princípio ou risco gerado.>

**O que deve ser feito:**
<Descrição da abordagem correta, com trecho de código se possível.>
```

### 3. Inserir no doc de rules

Abra o arquivo de rules identificado no passo 1 e insira o registro:

- Localize a seção mais apropriada do doc para registrar o anti-padrão.
  Prioridade de encaixe:
  1. seção de proibições/antipadrões existente;
  2. seção `## Regras` ou `## Padroes` quando ela já concentra alertas;
  3. seção `## Notas`, se o documento for mais antigo e não possuir bloco
     claro para proibições.
- Se o documento não tiver uma subseção apropriada, crie uma subseção H3 curta
  e objetiva, sem reestruturar o resto do arquivo.
- Acrescente o novo anti-padrão ao final da seção escolhida, sem remover
  entradas existentes.
- Mantenha o estilo e a linguagem do documento original.
- Preserve a consistência com a arquitetura do StarDust: `packages/core`
  agnóstico a frameworks, apps como adapters, uso de Factory Functions quando
  aplicável e direção de dependência apontando para dentro.

### 4. Confirmar

Após inserir, exiba o trecho adicionado e confirme o caminho do arquivo
atualizado.

---

## Saída Esperada

- Doc de rules da camada atualizado com o novo anti-padrão registrado na seção
  mais apropriada do documento.
- Exibição do trecho inserido para confirmação visual.

---

## Restrições

- **Não remova nem reescreva** entradas existentes no doc de rules.
- **Não generalize** o anti-padrão além do que foi descrito — registre exatamente
  o erro cometido, sem inferir problemas não observados.
- **Não invente** seções fixas que não existem no documento atual. Adapte a
  inserção à estrutura real do arquivo de rules.
- Se o anti-padrão envolver violação arquitetural, explicite o limite quebrado
  (ex: `core` importando app, lógica de negócio fora de `packages/core`,
  `RestClient` instanciado dentro de `service`, `job` acoplado ao SDK do
  Inngest, widget acessando infraestrutura diretamente).
- Se faltar contexto suficiente para identificar a camada ou descrever o
  "O que deve ser feito", use a tool `question` antes de escrever.
