---
description: Implementar diretamente uma spec pequena no codebase, sem criar plano formal, seguindo arquitetura e regras do Stardust.
---

# Prompt: Implementar Spec

**Objetivo:** Implementar no codebase uma spec tecnica pequena ou um fix pontual descrito em spec, sem criar `plan.md` nem seguir o fluxo pesado de `implement-plan`. Este prompt serve para tarefas com baixo acoplamento, poucos arquivos impactados e ordem de execucao evidente.

Use este prompt quando a spec ja estiver clara o suficiente para implementacao direta.

Nao use este prompt quando a tarefa exigir fases, paralelizacao, dependencias entre apps/camadas, migrations complexas, contratos novos em multiplas bordas ou coordenacao de subagentes. Nesses casos, use `create-plan` + `implement-plan`.

---

## Entrada

- **Spec:** caminho do arquivo em `documentation/features/**/specs/*-spec.md`.
- **Escopo opcional:** trecho, requisito, secao ou issue especifica dentro da spec.
- **Contexto opcional:** observacoes do usuario sobre prioridade, limite de escopo ou arquivos ja alterados.

Se o caminho da spec nao for fornecido, tente descobrir automaticamente usando esta ordem:
1. spec citada ou alterada na conversa atual;
2. unico arquivo `documentation/features/**/specs/*-spec.md` relacionado ao dominio/feature mencionados;
3. spec mais recentemente modificada.

Se houver mais de um candidato plausivel, pare e peca confirmacao do caminho correto.

---

## Quando Usar

Use `implement-spec` apenas se todas as condicoes abaixo forem verdadeiras:

- A spec ja define claramente o comportamento esperado.
- A implementacao cabe em uma sequencia curta de edicoes.
- Nao ha necessidade de criar um plano por fases.
- As dependencias entre camadas sao simples e evidentes.
- A validacao pode ser feita com comandos locais de `codecheck`, `typecheck` e testes unitarios.

Se qualquer condicao falhar, interrompa antes de editar e recomende `create-plan` + `implement-plan`.

---

## Diretrizes de Execucao

### 1. Leitura Obrigatoria

Antes de editar codigo:

- Leia a spec inteira.
- Leia `documentation/rules/rules.md`.
- Identifique os apps e camadas tocados pela spec.
- Leia apenas os arquivos de rules correspondentes as camadas que serao alteradas.
- Localize no codigo os arquivos citados pela spec e implementacoes similares.

Nao implemente com base em caminhos, metodos ou contratos sem confirmar que existem na codebase, exceto quando a spec marcar explicitamente como novo arquivo.

### 2. Checagem de Escopo

Classifique a tarefa antes de editar:

- **Direta:** pode ser implementada agora com este prompt.
- **Ampla:** exige plano formal; pare e recomende `implement-plan`.
- **Ambigua:** falta decisao de produto ou arquitetura; pergunte ao usuario antes de editar.

Uma tarefa deixa de ser direta se envolver:

- duas ou mais apps com contrato novo entre elas;
- migration com impacto de dados ou permissao;
- nova entidade/use case/repository + UI consumidora no mesmo fluxo;
- fila, provider externo, AI tool ou realtime;
- alteracao de rules/arquitetura;
- mais de uma decisao tecnica relevante ainda em aberto.

### 3. Implementacao

- Siga a spec como fonte de verdade.
- Prefira a menor mudanca que entrega o comportamento especificado.
- Siga os padroes dos arquivos vizinhos antes de criar abstracoes novas.
- Preserve limites de camada:
  - `core` nao importa frameworks, SDKs ou codigo de apps.
  - UI nao acessa banco, providers externos ou infraestrutura diretamente.
  - Auth, ownership e adaptacao de transporte ficam na borda quando esse ja for o padrao do fluxo.
- Se encontrar divergencia factual na spec durante a implementacao, corrija a spec de forma cirurgica ou registre a pendencia quando a decisao nao for segura.

### 4. Testes

Adicione ou atualize testes quando a mudanca afetar regra de negocio, contrato, estado de UI, handler ou comportamento com regressao conhecida.

Use as regras de teste correspondentes:

| Tipo de artefato | Arquivo de regras |
|---|---|
| Objetos de dominio | `documentation/rules/domain-objects-testing-rules.md` |
| Use cases | `documentation/rules/use-cases-testing-rules.md` |
| Handlers | `documentation/rules/handlers-testing-rules.md` |
| Rotas HTTP do server | `documentation/rules/server-routes-testing-rules.md` |
| Rotas e pages da web | `documentation/rules/web-app-routes-testing-rules.md` |
| Widgets | `documentation/rules/widget-tests-rules.md` |

Nao crie testes fora dos padroes existentes do projeto.

### 5. Validacao

Apos alterar codigo, execute os comandos no workspace afetado:

- `npm run typecheck`
- `npm run codecheck`
- `npm run test`

Se a mudanca tocar UI, pagina Next.js, fluxo browser, layout responsivo, formulario, modal, drawer, canvas ou estado visual/interativo, valide tambem com **MCP Playwright**:

- iniciar ou reutilizar o dev server do app afetado;
- abrir a rota impactada no browser;
- executar o fluxo principal alterado;
- verificar visualmente/interativamente que nao ha tela em branco, erro no console, overlay quebrado, texto sobreposto ou comportamento divergente da spec;
- capturar screenshot quando a validacao visual for relevante.

Se o MCP Playwright nao estiver disponivel, rode os testes Playwright existentes ou registre claramente que a validacao browser ficou pendente.

Se a mudanca tocar multiplos workspaces, valide cada workspace afetado ou rode os comandos equivalentes na raiz quando isso for mais adequado.

Se algum comando falhar por causa da mudanca, corrija antes de encerrar. Se houver falha pre-existente fora do escopo, reporte com evidencia.

### 6. Encerramento

Ao final, responda com:

- resumo curto do que foi implementado;
- arquivos principais alterados;
- comandos de validacao executados e resultado;
- validacao Playwright/browser executada quando aplicavel;
- pendencias, se houver.

---

## Restricoes

- Nao crie plano formal.
- Nao use subagentes.
- Nao implemente alem do escopo da spec.
- Nao invente arquivos, metodos, contratos ou schemas sem evidencia.
- Nao reescreva specs inteiras; se precisar ajustar documento, faca edicao cirurgica.
- Nao avance quando a spec exigir decisao arquitetural relevante sem confirmacao.
- Nao substitua `implement-plan` em tarefas grandes; este prompt existe para tarefas menores.
