---
description: Implementar no codebase um plano de implementacao derivado de uma spec tecnica, seguindo a arquitetura e diretrizes do Stardust.
---

# Prompt: Implementar Plano

**Objetivo principal:** Implementar no codebase um plano de implementacao derivado de uma spec tecnica, seguindo a arquitetura e diretrizes do Stardust, **respeitando rigorosamente a ordem de fases e tarefas definidas no plano para maximizar a paralelizacao e evitar retrabalho.**

## Entrada

- Plano ativo em `documentation/plan.md` — esse e o ponto de entrada padrao.
- Se um caminho alternativo for fornecido explicitamente, use-o no lugar de `documentation/plan.md`.

---

## REGRA MESTRA (NAO IGNORE)

Antes de implementar qualquer camada, execute este algoritmo:

1. **Classificar:** Qual e a natureza da tarefa? (ex: `core`, `ui`, `rpc`, `rest`, `queue`, `database`, `provision`).
2. **Consultar o indice:** Leia `documentation/rules/rules.md` para identificar qual arquivo de regra corresponde a camada.
3. **Verificar contexto:** O arquivo de regra especifico esta carregado no contexto atual?
   - **[SIM]** → Prossiga e cite explicitamente qual regra esta aplicando.
   - **[NAO]** → PARE IMEDIATAMENTE. Solicite ao usuario: *"Por favor, adicione o arquivo `[caminho]` ao contexto para que eu possa seguir as regras de `[Camada]`."*

> ⚠️ **Proibicoes**
> - NUNCA assuma padroes genericos (ex: Clean Arch padrao, MVC padrao) sem ler o arquivo de regra especifico.
> - NUNCA gere codigo baseado apenas no resumo do indice — leia o arquivo completo da camada.
> - NUNCA implemente uma camada consumidora (ex: UI) antes de implementar a camada que ela consome (ex: RPC/Core).

## Diretrizes de execucao

### 1. Pre-check (obrigatorio)

**1.1 Leitura do plano**

Leia o plano na integra antes de escrever qualquer linha de codigo. Identifique: escopo, fases, mapa de paralelizacao, gargalos, criterios de aceite, riscos e pendencias. Se o documento estiver incompleto, nao invente: crie uma secao `Pendencias` e avance apenas com defaults seguros.

**1.2 Leitura da codebase existente**

Use **Serena** para localizar implementacoes similares nas mesmas camadas impactadas — use-as como referencia de padrao e nomenclatura.

> Nao assuma que um arquivo existe ou tem determinada assinatura sem verificar na codebase. Implementar com base em suposicoes gera conflitos e retrabalho.

**1.3 Leitura das regras das camadas impactadas**

Antes de implementar qualquer camada, leia as regras correspondentes consultando o indice em `documentation/rules/rules.md`. Em geral, as mais comuns no Stardust sao:

- `documentation/rules/core-package-rules.md` — DTOs, Entidades, Interfaces e Use Cases
- `documentation/rules/database-rules.md` — Repositories, Mappers e persistencia
- `documentation/rules/rpc-layer-rules.md` — Actions e integracao com use cases
- `documentation/rules/rest-layer-rules.md` — Services e Controllers REST
- `documentation/rules/queue-layer-rules.md` — Jobs e processamento assincrono
- `documentation/rules/provision-layer-rules.md` — Providers e integracoes externas
- `documentation/rules/ui-layer-rules.md` — Widgets e paginas (padrao Widget: View + Hook + Index)
- `documentation/rules/web-application-rules.md` — Convencoes especificas do app `web`
- `documentation/rules/server-application-rules.md` — Convencoes especificas do app `server`
- `documentation/rules/studio-appllication-rules.md` — Convencoes especificas do app `studio`
- `documentation/rules/code-conventions-rules.md` — Nomenclatura e organizacao geral

> Leia apenas as regras das camadas que serao tocadas nesta execucao. Nao pule esta etapa — padroes existentes devem ser preservados.

---

### 2. Ordem de execucao (bottom-up, obrigatoria)

Implemente as tarefas seguindo rigorosamente esta hierarquia:

1. **Core** — DTOs, Entidades e Interfaces.
2. **Drivers/Infra** — implementacoes de Repositories e Gateways (ex: `Supabase`, `Inngest`).
3. **API layer** — Actions (`RPC`) ou Controllers (`REST`).
4. **UI** — Widgets e Paginas.

> ⚠️ **Regra** Nunca implemente um componente consumidor antes de implementar a logica/dados que ele consome.

### 3. Ciclo de implementacao por tarefa

Para cada tarefa do plano:

- Consulte a Regra Mestra antes de escrever codigo (etapa obrigatoria acima).
- Localize codigo existente semelhante antes de criar algo novo.
- Implemente a mudanca minima que entrega o **resultado observavel** definido na tarefa do plano.
- Evite acoplamento entre camadas e chamadas de API na UI.

### 4. Verificacao (obrigatoria) apos cada tarefa

Ao finalizar cada tarefa, execute **antes de avancar para a proxima**:

- **Lint e formatacao:** `npm run codecheck` no diretorio do pacote/app correspondente.
- **Typecheck:** `npm run typecheck` no diretorio do pacote/app correspondente.
- **Testes:** `npm run test` no diretorio do pacote/app correspondente.

> ⚠️ **Criterio de aceite:** Nao avance com codigo que apresente erros de lint, typecheck ou testes falhando. Corrija imediatamente antes de seguir.

> 💡 **Contexto de monorepo:** Execute os comandos dentro do diretorio da aplicacao ou pacote especifico (onde reside o `package.json`, ex: `apps/web`, `apps/server`, `packages/core`), nao na raiz do workspace.

### 5. Execucao paralela com subagentes (quando aplicavel)

Quando o plano indicar tarefas que **podem rodar em paralelo** (coluna "Pode rodar em paralelo com" da tabela de dependencias), utilize subagentes para executa-las simultaneamente.

#### Quando acionar subagentes

- Apenas quando duas ou mais tarefas nao tiverem dependencia entre si dentro da mesma fase ou entre fases distintas.
- Nao acione subagentes para tarefas sequenciais — o custo de orquestracao nao compensa.

#### Como despachar cada subagente

Cada subagente deve receber **somente o contexto minimo necessario** para sua tarefa:

1. A tarefa especifica a executar (ID, nome, camada e resultado observavel esperado).
2. Os arquivos de regra da camada correspondente (`documentation/rules/`).
3. Trechos de codigo relevantes da codebase (implementacoes similares, interfaces que a tarefa depende).
4. As convencoes do projeto (`documentation/rules/code-conventions-rules.md`).

> ⚠️ **Nao envie o plano completo para o subagente.** Contexto excessivo aumenta o risco de o subagente implementar alem do escopo da tarefa.

#### Responsabilidade do orquestrador

- Despachar os subagentes e **aguardar todos concluirem** antes de avancar para a proxima fase.
- Apos recepcao dos resultados de todos os subagentes, executar a **verificacao obrigatoria**:
  - `npm run codecheck` — lint e formatacao.
  - `npm run typecheck` — tipagem.
  - `npm run test` — testes.
- Se houver falha, identificar qual tarefa/subagente gerou o problema e corrigir antes de avancar.
- Registrar no checklist quais tarefas foram executadas por subagentes e o status de cada uma.

#### Formato de despacho (instrucao ao subagente)

```
Tarefa: <ID e nome da tarefa>
Camada: <camada>
Resultado esperado: <resultado observavel definido no plano>

Contexto necessario:
- Regras da camada: <caminho do arquivo de regras>
- Interfaces/contratos que esta tarefa consome: <paths relevantes>
- Implementacoes similares para referencia: <paths relevantes>

Instrucoes:
1. Siga rigorosamente as regras da camada indicada.
2. Implemente apenas o escopo desta tarefa — nada alem.
3. Ao concluir, reporte: arquivos criados/alterados e o resultado observavel atingido.
```

### 7. Ferramentas auxiliares

- **MCP Serena:** utilize para buscar arquivos e implementacoes similares no projeto antes de criar algo novo.
- **MCP Context7:** utilize quando houver duvida sobre como usar uma biblioteca especifica (ex: `shadcn/ui`, `radix-ui`, `inngest`, `supabase`, `hono`, `zod`).

### 8. Progresso e reporte

- Atualize o checklist de tarefas conforme implementa (marque `[x]` nas tarefas concluidas).
- Ao final de cada fase, reporte: o que foi implementado, arquivos tocados e pendencias.
- Ao final do plano completo, entregue o reporte final (veja Saida esperada).

## Saida esperada

- Implementacao completa (ou parcial, se bloqueada) do plano/spec no codebase.
- Checklist atualizado com tarefas `[x] concluida` e `[ ] pendente`, com justificativa para bloqueios.
- Referencias a paths reais de arquivos alterados/criados.
- Lista de pendencias e proximos passos, se houver.
