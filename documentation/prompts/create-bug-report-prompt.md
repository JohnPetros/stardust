---
name: create-bug-report
description: Diagnosticar uma GitHub bug issue aprovada em um Bug Report factual do Stardust e recomendar correção direta ou Correction Spec.
---

# Criar Bug Report

Transforme uma GitHub bug issue aprovada em um diagnóstico técnico durável. O Bug Report é
input de correção, não Spec: não inclua `CA-*`, um roteiro de validação manual, fases, tasks,
assinaturas, inventário proposto de arquivos ou implementação detalhada.

## Entrada

- GitHub bug issue com problema, comportamento esperado, reprodução e contexto;
- contexto técnico opcional: ambiente, browser/dispositivo, frequência e evidências.

Sem issue existente, pare e encaminhe para `create-bug-issue`; este workflow não cria nem
atualiza a issue.

## Autoridade e Rules

Leia `AGENTS.md`, `documentation/sdd.md`, `documentation/rules/rules.md`,
`documentation/architecture.md`, `documentation/modules.md`, a milestone associada e o PRD
versionado vinculado quando existir. Selecione e leia por inteiro as Rules das camadas e tipos de
teste afetados. Use-as para validar fronteiras, sem transformar o relatório em Spec.

Milestone e PRD definem comportamento esperado. Se a expectativa solicitada mudar o produto,
pare e encaminhe para amendment/feature; não classifique mudança de comportamento como bug.

## Pesquisa diagnóstica

Organize a pesquisa direta da task em lanes delimitadas:

- uma lane para boundary estreito;
- lanes independentes quando dois ou mais boundaries forem afetados;
- escolha apenas lanes reais, como Core, Server, Web, Studio, Database ou Integration;
- defina sintoma, expectativa, paths iniciais, Rule Pack e pergunta diagnóstica;
- registre paths/declarations exatos, evidência, causa provável, risco e incerteza.

A task principal pesquisa cada lane, resolve conflitos por inspeção direta e separa fato de
hipótese. Não crie agentes de pesquisa.

## Diagnóstico com Playwright

Playwright pode e deve ser usado para diagnosticar bugs de frontend, UI, rotas client-side,
autenticação ou qualquer falha que dependa do navegador real. Ele não é reservado à validação
final da correção.

Quando o sintoma envolver navegador:

- reproduza a rota e o fluxo observável com Playwright antes de concluir a causa;
- para rotas protegidas, autentique usando as variáveis locais previstas em `AGENTS.md`, nunca
  credenciais literais, e acesse pelo menos uma rota protegida no mesmo contexto;
- registre `console`, `pageerror`, `requestfailed` e `response`, incluindo método, path e status
  dos endpoints relevantes, sem registrar headers ou corpos que contenham tokens, cookies ou
  dados pessoais;
- use `waitForURL`, `waitForRequest`, `waitForResponse` ou `waitForFunction` para sincronizar
  estados; não use `waitForTimeout` como única evidência;
- inspecione o estado efetivamente observado: DOM, estilos computados, atributos, loading,
  navegação, remounts, timing e respostas HTTP; em falhas visuais, capture screenshot quando isso
  ajudar a distinguir composição, stacking context, asset ou hidratação;
- se o fluxo falhar por autenticação, separe falha de credencial/API, propagação de sessão,
  CORS, middleware, refresh e carregamento da tela. Confirme o endpoint de login e as chamadas
  subsequentes sem expor os valores sensíveis;
- trate a execução Playwright como evidência diagnóstica do relatório. O documento final não deve
  ganhar uma seção de manual validation, acceptance, tasks ou implementação por causa dessa
  investigação.

Para Web App e Studio, siga os ambientes, scripts de exportação de credenciais, portas e fluxo
autenticado descritos em `AGENTS.md`. Use o Playwright CLI tanto para a reprodução formal quanto
para a exploração visual pontual; não use outra ferramenta de automação de navegador neste
projeto.

## Workflow

1. confira a issue real e a reprodução informada;
2. separe falha observada de comportamento esperado;
3. associe milestone, PRD e requisito real quando aplicáveis, sem alterar seu estado;
4. inspecione entry point, estado, transporte, use case, persistência e integração implicados;
5. quando aplicável, reproduza e instrumente o fluxo real com Playwright conforme a seção de
   diagnóstico no navegador;
6. salve ou atualize
   `documentation/features/<domínio>/<feature>/reports/<slug>-bug-report.md`;
7. recomende no resumo final:
   - **Correção direta:** narrow, bem compreendida, baixo risco e sem Contract durável; ou
   - **Correction Spec:** ambígua, cross-layer, coordenada ou de risco material, exigindo
     `RF-*`, `CA-*`, `MV-*` ou Plan.

Não escreva a delivery route dentro do Bug Report e não crie a Spec neste workflow.

## Estrutura obrigatória

```md
---
title: <título curto>
issue: <GitHub issue URL>
milestone: <URL ou null>
prd: <path/requisito ou null>
apps:
  - <web|server|studio>
status: open
last_updated_at: YYYY-MM-DD
---

# Bug Report: <título>

## Diagnóstico

### Falha observada

<comportamento confirmado e condições>

### Comportamento esperado

<contrato de produto, Spec, Design ou comportamento estabelecido>

### Causa raiz

<explicação sustentada por evidência; hipóteses restantes explicitamente marcadas>

### Áreas afetadas

- `<path relativo>` — <responsabilidade no defeito>

### Risco de regressão

<comportamentos relacionados que a correção deve preservar>

## Limite da correção

<o que deve ser corrigido e o que deve permanecer inalterado>
```

## Restrições

- use GitHub Issues e paths relativos reais;
- não invente execução, causa, método, contrato ou arquivo;
- não inclua acceptance, uma seção de manual validation, tasks, fases ou file plan; evidências
  Playwright podem fundamentar a causa, mas devem ser sintetizadas nas seções factuais do report;
- não edite Spec, Plan, Evaluation, PRD ou Rule;
- não exponha credenciais, dados privados ou logs sensíveis;
- no fim, reporte issue, path e route recomendada.
