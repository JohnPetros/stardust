# Spec-Driven Development (SDD) no StarDust

## Objetivo

O SDD transforma uma demanda de feature em uma entrega verificável. Todo o
fluxo ocorre na mesma task/thread. O Orchestrator coordena Builders, Judges e
sensores como subagentes da task atual; nenhuma fase cria nova thread.

```text
PRD, Issue, Report ou demanda direta
→ Spec (Contract + solução técnica)
→ Judge Spec
→ Plan opcional
→ Builders
→ sensores aplicáveis
→ Judge Implementation
→ preflight local
→ PR + Quality Gate + build no CI
→ Spec completed
```

Specs são usadas para entregas relacionadas a uma feature: novas features,
alterações de comportamento, correções e mudanças técnicas necessárias para
uma feature. Manutenções transversais sem Contract de feature seguem fluxo
direto.

## Origem e estrutura da Spec

Uma Spec pode ter PRD, Issue, Report ou demanda direta como origem. O PRD não é
obrigatório para correções ou tarefas técnicas, mas toda Spec possui Contract.

```yaml
---
title: <título>
status: draft
revision: 1

source:
  type: <prd|issue|report|direct-request>
  ref: <path|url|codex-task>

prd: <opcional>
issue: <opcional>
plan: <opcional>

scope:
  - <workspace|diretório|arquivo>

last_updated_at: YYYY-MM-DD
---
```

Valores de `status`: `draft`, `open`, `in_progress`, `completed` e
`cancelled`. O arquivo da Spec é a sua identidade; não é necessário um campo
`id` separado.

A estrutura do corpo é:

1. contexto e objetivo;
2. escopo e fora de escopo;
3. Contract;
4. estado atual;
5. solução técnica;
6. plano de validação;
7. avaliações;
8. evidências finais;
9. alinhamento documental;
10. amendments.

O Contract vem antes da solução técnica. Use somente `RF-*` e `CA-*` como IDs
obrigatórios:

- `RF-*`: requisito funcional;
- `CA-*`: critério de aceitação verificável.

Segurança, performance e arquitetura entram como critérios de aceitação ou
restrições técnicas específicas. Não use `RN-*`, `RNF-*` ou `RA-*` como IDs
obrigatórios.

Cada Spec deve declarar premissas e questões pendentes. Antes de `open`, toda
questão pendente deve estar resolvida e toda premissa crítica deve estar
confirmada ou explicitamente aceita com risco e validação.

## Rastreabilidade

```text
PRD/Issue/Report
→ RF
→ CA
→ tarefa do Plan, quando existir
→ código e testes
→ evidência
→ Judge
```

A matriz de validação deve relacionar cada `CA-*` à evidência esperada e, na
conclusão, à evidência real. A avaliação formal fica na Spec. O Plan registra
fases, tarefas, tentativas, findings e próxima ação.

## Ciclo de vida

```text
draft
  → Judge Spec: accepted
open
  → implementação iniciada
in_progress
  → sensores + Judge Implementation + CI/build
completed
```

`cancelled` encerra uma Spec abandonada com motivo registrado. `failed` é
veredito de Judge; `blocked` é estado operacional de Plan ou tarefa.

Se o Contract mudar depois de `open`, pause, atualize PRD quando aplicável,
incremente `revision`, registre amendment e execute novamente o Judge Spec.
Uma alteração técnica pode atualizar a solução e revalidar apenas os critérios
afetados. Uma alteração editorial não exige nova avaliação.

## Orquestração de agentes

Todos os subagentes são criados diretamente pelo Orchestrator e são irmãos:

```text
Orchestrator
├── Builder Direct | Builder F<n>
├── Builder F<n>-T<m>, quando houver paralelismo real
├── Builder Fix QG-<n>, para correções
└── Judge Spec ou Judge Implementation
```

Builder é o único papel de implementação. O contexto do nome indica o escopo:

- `Builder Direct`: Spec pequena;
- `Builder F<n>`: escopo principal de uma fase;
- `Builder F<n>-T<m>`: tarefa atômica independente;
- `Builder Fix QG-<n>`: correção de finding ou Quality Gate.

O Orchestrator decide se há paralelismo real, garante paths sem sobreposição e
integra o diff. Nenhum Builder cria subagentes. Judges são read-only e irmãos
dos Builders.

Para uma Spec pequena, use `implement-spec` com um `Builder Direct`. Para uma
Spec com fases dependentes, use `create-plan` e `implement-plan`. O Plan é
opcional.

## Sensores e execução

Sensores oficiais:

| Script | Uso |
| --- | --- |
| `format` | aplicar formatação; não é gate |
| `check:code` | lint e consistência estática |
| `check:types` | contratos TypeScript |
| `test:unit` | comportamento isolado |
| `check:architecture` | fronteiras e dependências, quando aplicável |
| `test:integration` | APIs, banco, rotas e fluxos integrados, quando aplicável |

`check:dead-code` não faz parte dos sensores oficiais. Build não é sensor SDD;
é validação final do artefato no CI.

Durante o ciclo curto:

```text
format → check:code → check:types → test:unit
```

Antes do Judge e do PR, execute os sensores aplicáveis no escopo integrado.
Execute `check:architecture` quando imports, módulos ou fronteiras mudarem e
`test:integration` quando contratos ou fluxos reais mudarem.

Antes do PR, faça um preflight local. O Quality Gate do CI repete os checks e
permanece a fonte oficial. O build roda depois do Quality Gate no CI. Build
local é recomendado quando houver mudanças em bundler, rotas, exports,
ambiente, Docker, workflows ou artefatos gerados.

Se o Quality Gate falhar, a Spec permanece `in_progress`. O Orchestrator
aciona `Builder Fix QG-<n>` quando a correção estiver no escopo, reexecuta os
sensores afetados e aciona novo Judge quando a evidência for invalidada.

## Avaliação

O `Judge Spec` avalia se o Contract e a solução são claros, rastreáveis e
implementáveis. O `Judge Implementation` avalia o diff contra o Contract,
Rules, Architecture, testes, sensores e segurança proporcional ao risco.

Não existe um papel separado obrigatório de `Judge Conclusion`. O workflow
`conclude-spec` executa o fechamento; em Specs pequenas, o Judge Implementation
final já é o veredito de conclusão. Em Plans ou mudanças de alto risco, o
Orchestrator pode acionar um novo `Judge Implementation` para avaliar a
integração completa.

As avaliações e evidências finais são registradas na Spec. Pareceres extensos
permanecem no contexto da task; o Plan conserva apenas o histórico operacional
necessário.

## Atualização documental

Qualquer agente pode identificar uma lacuna documental e reportar documento,
evidência, tipo e ação sugerida. Em workflows SDD, o Orchestrator controla as
fontes de verdade; fora deles, essa responsabilidade pertence ao agente
principal da task.

Atualizações normativas necessárias para orientar a implementação acontecem
antes do Builder. Sincronizações factuais e aprendizados generalizáveis são
resolvidos em `conclude-spec`. Mudanças em PRD, novas Rules globais, fronteiras
arquiteturais ou expansão de escopo exigem decisão do usuário.

## MCPs

MCPs são ferramentas de contexto, não sensores. Use-os conforme o escopo:

- Serena: navegar pela codebase;
- Context7: consultar documentação atualizada;
- Pencil: consultar e validar design;
- Playwright: inspecionar fluxos reais no navegador;
- Supabase Dev: verificar schema, migrations e integrações de desenvolvimento;
- Supabase Prod: diagnóstico ou verificação autorizada em produção.

Playwright MCP não substitui `test:integration` quando o comportamento precisa
ser protegido por teste automatizado.

## Fontes de verdade

1. revisão humana explícita;
2. PRD ou origem declarada da demanda;
3. Contract da Spec;
4. Architecture e Rules;
5. solução técnica da Spec;
6. Plan;
7. implementação atual.

Conflitos materiais devem ser resolvidos antes de continuar.
