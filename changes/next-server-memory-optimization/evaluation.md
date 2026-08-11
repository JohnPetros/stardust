---
title: Otimizacao de memoria do Next Server da Web App
source: ../../documentation/reports/web-app-performance-report-2026-03-05.md
spec: not_applicable
status: accepted
base_commit: 46830574d9b8d9f515ff8a0758ff54d5c9e571bf
evaluated_commit: 2228c03e6734fea2cc616433026b10dda1f8d162
last_updated_at: 2026-08-08
---

# Evaluation — Otimizacao de memoria do Next Server da Web App

## Escopo avaliado

- Spec: não aplicável; manutenção transversal iniciada por demanda direta.
- Fonte técnica: `../../documentation/reports/web-app-performance-report-2026-03-05.md`.
- Plan: não aplicável; implementação incremental direta.
- Commit-base: `46830574d9b8d9f515ff8a0758ff54d5c9e571bf`.
- Commit avaliado: `2228c03e6734fea2cc616433026b10dda1f8d162`.
- Workspaces: `apps/web` e imports de conversa em `packages/core` alcançados pelo grafo do Next.js.

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| Reduzir a memória residente do processo Next em desenvolvimento | passed | A árvore de processos caiu de aproximadamente 2,97 GiB no baseline para 1,635 GiB após aquecimento pela suíte de integração, redução aproximada de 45%. Em inicialização fresca nas rotas root, landing e login, o total medido foi 1,801 GiB. |
| Impedir dependências pesadas de alcançarem rotas que não as utilizam | passed | O client reference manifest da rota root não contém `delegua`, `antlr`, `esprima` ou `monaco`; imports globais de server actions, fakers e code tips foram substituídos por fronteiras específicas. |
| Adiar recursos client-only sem alterar o comportamento observável | passed | PostHog e o bridge realtime de testes usam carregamento dinâmico; os editores da landing mantêm placeholder e são carregados por `IntersectionObserver` com margem de pré-carga de 600 px. |
| Preservar o fluxo funcional da Web App | passed | Suíte de integração Web: 49/49 testes; inspeção em browser real confirmou landing sem Monaco acima da dobra e carregamento após scroll. No HEAD avaliado, login real e nova navegação para `/space` preservaram a sessão; o endpoint realtime recuperou um 401 inicial via refresh 201 e repetição 200, sem `pageerror` ou `requestfailed`. |
| Preservar contratos do Core e fronteiras arquiteturais | passed | Testes focados de conversation: 7 suítes/14 testes; `check:architecture` sem violações em 3.638 módulos e 6.495 dependências. |

## Judges

### Judge Spec

- Veredito: não aplicável.
- Motivo: a regra de criação de Spec exclui manutenção transversal sem Contract de feature.

### Judge Plan

- Veredito: não aplicável.
- Plan: não aplicável.

### Judge Implementation

- Modo: `final`.
- Veredito: accepted.
- Commit: `2228c03e6734fea2cc616433026b10dda1f8d162`.
- Findings: `JI-01` resolvido pela repetição do fluxo autenticado no HEAD; `JI-02` resolvido pela criação e persistência deste documento antes do PR.

## Sensores e preflight

| Comando | Estado | Evidência |
| --- | --- | --- |
| `npm run check:code` | passed | Execução root concluída; apenas warnings preexistentes. |
| `npm run check:types -- --output-logs=errors-only` | passed | 7/7 workspaces concluídos. |
| `npm run check:architecture` | passed | Nenhuma violação; 3.638 módulos e 6.495 dependências analisados. |
| `npm run test:unit` | warning | Demais workspaces passaram; Server concluiu 162 suítes/303 testes, com uma falha de infraestrutura em `FeedbackConversationCascade.test.ts` porque o PostgreSQL local em `127.0.0.1:54322` estava indisponível. |
| `npm --workspace @stardust/web run test:integration` | passed | 49/49 testes concluídos em aproximadamente 3,9 minutos. |
| Teste unitário de `DeferredCodeSnippet` | passed | 2/2 testes concluídos. |
| Testes focados de `NextHttp` e `VerifyAuthRoutesController` | passed | 16 testes concluídos. |
| Testes focados de conversation no Core | passed | 7 suítes/14 testes concluídos. |
| Browser real | warning | Landing validada sem erros. No HEAD, login e `/space` passaram; `/profile/achievements/<id>/observe` respondeu 401, `/auth/refresh-session` respondeu 201 e a repetição de `/observe` respondeu 200, sem `pageerror` ou `requestfailed`. A recuperação gerou uma mensagem transitória no console. |

## Quality Gate e build do CI

| Verificação | Estado | HEAD / evidência |
| --- | --- | --- |
| Quality Gate | passed | PR #529, HEAD `6008e3db97d5ba02b9f5062cbd84992c236b5215`: checks de arquitetura, código, tipos, testes e integração concluídos com sucesso. |
| Build | passed | PR #529, HEAD `6008e3db97d5ba02b9f5062cbd84992c236b5215`: todos os jobs de build concluídos com sucesso. |

## Warnings e findings

- `WARN-01` — o teste unitário de cascade do Server depende do PostgreSQL local em `127.0.0.1:54322`; a conexão recusada é uma limitação de infraestrutura local, não evidência de regressão funcional. O CI deve confirmar o cenário em ambiente provisionado.
- `WARN-02` — a redução de memória foi medida no ambiente WSL de desenvolvimento e pode variar conforme cache, rotas aquecidas e versão do runtime; os números devem ser interpretados contra o mesmo baseline.
- `WARN-03` — a primeira conexão realtime de achievements em `/space` recebeu 401 e foi recuperada pelo fluxo esperado de refresh (201), com retry 200; o browser ainda registra o 401 transitório no console.

## Decisões

- Manter Next.js e reduzir o grafo efetivamente carregado antes de considerar troca de runtime.
- Preferir imports por domínio e entry points específicos a barrels globais em código alcançado pelo servidor Next.
- Manter os editores na landing, mas adiar Monaco e parsers até a proximidade da seção para preservar a experiência visual.
- Não criar Spec retrospectiva: a entrega é manutenção transversal sem novo contrato de produto.

## Lições aprendidas

- Imports type-only e barrels aparentemente pequenos podem manter grafos grandes vivos no processo de desenvolvimento; o manifest e a árvore RSS/PSS precisam ser medidos em conjunto.
- Lazy loading de providers globais e widgets abaixo da dobra reduz tanto o custo inicial no browser quanto o trabalho e os artefatos mantidos pelo servidor de desenvolvimento.

## Alinhamento documental

- Spec: não aplicável.
- Plan: não aplicável.
- Report: alinhado como fonte técnica; permanece aberto por conter outros itens fora deste recorte.
- Rules/Architecture/Overview: alinhados; nenhuma mudança de contrato arquitetural ou funcional exige atualização.

## Conclusão

- Estado: `accepted`.
- Próxima ação: revisão e merge do PR #529.
