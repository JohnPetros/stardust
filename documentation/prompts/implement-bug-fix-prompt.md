---
name: implement-bug-fix
description: Implementar uma correção direta derivada de um Bug Report do Stardust, com regressão automatizada e validação real quando aplicável.
---

# Implementar Correção de Bug

Implemente uma correção direta a partir de um Bug Report diagnosticado. O Bug Report é a
autoridade do sintoma, da causa raiz e do limite da correção; este workflow transforma esse
diagnóstico em uma mudança pequena, testada e validada. Não use este prompt para implementar
uma mudança de produto, uma correção ambígua ou uma alteração de Contract.

## Entrada

- caminho do Bug Report, preferencialmente em
  `documentation/features/<domínio>/<feature>/reports/`;
- código e issue relacionados disponíveis no workspace;
- contexto opcional sobre ambiente, reprodução ou falhas encontradas depois do diagnóstico.

Se o Bug Report não existir, estiver sem causa sustentada ou recomendar Correction Spec, pare e
encaminhe para `create-bug-report` ou `create-spec`. Não invente o escopo da correção.

## Autoridade e Rules

Leia `AGENTS.md`, `documentation/sdd.md`, o Bug Report, `documentation/rules/rules.md`,
`documentation/architecture.md`, `documentation/modules.md` e o Rule Pack das camadas afetadas.
Leia também `documentation/rules/code-conventions-rules.md` quando houver mudança de código e as
Rules específicas de testes quando a cobertura for alterada.

Preserve a milestone, o PRD, o comportamento esperado e os contratos existentes. Se a causa
exigir mudar API, schema, evento, rota pública, requisito, design ou qualquer outro Contract,
pause a implementação direta, registre a divergência e encaminhe para `create-spec`.

## Gate antes da edição

Antes de editar código:

1. confirme o Bug Report, issue, status e limite da correção;
2. confirme os paths reais, o entry point, o fluxo afetado e a causa com inspeção direta;
3. reproduza a falha quando possível e capture um baseline mínimo;
4. defina o teste de regressão que falharia antes da mudança;
5. confirme que a mudança permanece narrow, sem criar Plan, Spec ou Contract artificial.

Se a reprodução contrariar o diagnóstico, não force a implementação: atualize o diagnóstico por
meio de `create-bug-report` ou reavalie o roteamento.

## Bug Report como registro vivo

O Bug Report deve permanecer alinhado ao estado real da correção durante todo o workflow. Atualize-o
sempre que houver qualquer mudança relevante em:

- sintoma reproduzido, causa raiz, hipótese descartada ou limite da correção;
- paths afetados, regressão automatizada, evidência de validação ou blocker;
- risco de regressão, comportamento esperado, dependências ou status da correção.

Se a implementação revelar uma causa complementar, uma divergência do diagnóstico ou um novo risco,
pare antes de ampliar o escopo, registre a descoberta no Bug Report e confirme se a correção continua
direta. Não deixe o relatório desatualizado até a etapa de encerramento. O relatório deve registrar
fatos observados e comandos/resultados de validação, sem virar uma Spec, Plan ou lista de tarefas.

## Implementação

1. Faça primeiro o teste de regressão no nível correto: unitário para lógica isolada, widget para
   View/Hook, rota para composição App Router e Playwright para o comportamento publicado no
   navegador.
2. Implemente somente o limite descrito no Bug Report, respeitando arquitetura, dependências,
   nomenclatura, factories, tratamento de erros e fronteiras entre camadas.
3. Preserve estados de sucesso, erro, loading, retry, navegação, autenticação e consumidores
   relacionados que não fazem parte do defeito.
4. Não altere credenciais, `.env.development`, migrations, issue, Spec, Plan ou Evaluation sem
   autorização explícita e sem o workflow correspondente.
5. Mantenha o Bug Report atualizado enquanto a implementação avança; se o código ou os testes
   alterarem o diagnóstico, o escopo, a evidência ou o risco, atualize o relatório antes de
   prosseguir.

## Diagnóstico e validação com Playwright CLI

Para qualquer correção que envolva frontend, UI, rota client-side ou autenticação, use o Playwright
CLI também como instrumento de diagnóstico e de validação final.

Durante a reprodução e o rerun:

- carregue as credenciais somente pelas variáveis e scripts locais definidos em `AGENTS.md`;
- autentique no mesmo contexto do navegador e exercite a rota protegida relevante;
- registre `console`, `pageerror`, `requestfailed` e `response`, mantendo apenas método, path,
  status e evidência não sensível;
- aguarde autenticação, requests, estados visuais e navegação com `waitForResponse`,
  `waitForFunction` e `waitForURL`, sem depender de `waitForTimeout` isolado;
- confirme estados observáveis de sucesso e erro, além de loading e navegação quando fizerem
  parte do fluxo;
- execute testes versionados com `npm --workspace @stardust/web run test:integration -- <arquivo>` ou
  `npm exec playwright -- test ...` a partir de `apps/web`; use o ambiente de integração com
  `ServerMock` nos testes versionados e o fluxo real em `localhost:3000`/API local para inspeção
  autenticada fora da suíte;
- para Studio, use o servidor, a porta e as credenciais definidos em `AGENTS.md`, valide login e
  pelo menos uma rota protegida;
- após cada correção, repita o fluxo autenticado completo pelo Playwright CLI. Tela de login, mock isolado ou
  renderização unitária não bastam para declarar a correção funcional.

Não registre tokens, cookies, senhas, corpos sensíveis, valores de `.env` ou logs que permitam
reconstruí-los.

## Detectores e testes

Após qualquer alteração, execute os detectores obrigatórios de `AGENTS.md`:

- `npm run check:code`;
- `npm run check:types`;
- `npm run test:unit`;
- testes específicos do bug e o fluxo Playwright aplicável.

Se um detector falhar por estado externo, como porta ocupada, preserve o processo alheio, registre
o bloqueio exato e execute todas as alternativas seguras. Não declare sucesso global com base em
um teste parcial.

## Conclusão

Depois de validar a mudança:

1. inspecione `git diff` e `git diff --check`;
2. confirme que não há arquivos ou credenciais acidentais no diff;
3. atualize obrigatoriamente o Bug Report com todas as descobertas, paths, testes, evidências,
   blockers e mudanças de status relevantes; mesmo sem divergência de causa, registre a evidência
   final quando ela ainda não estiver documentada;
4. invoque `conclude-bug-report` para consolidar as evidências e fechar o report somente quando a
   correção estiver realmente validada;
5. informe paths alterados, testes executados, validação manual/Playwright, blockers e o status
   final do Bug Report.

## Restrições

- não implemente uma Correction Spec neste workflow;
- não transforme relato em evidência: registre comandos, cenários e resultados observados;
- não invente paths, testes, contratos, respostas HTTP ou causa raiz;
- não faça mudanças destrutivas nem mate processos externos para liberar portas;
- não faça commit, push, issue update ou PR sem solicitação explícita;
- mantenha a correção mínima e reversível, com regressão automatizada proporcional ao risco.

## Template de saída

```md
## Correção implementada

- Bug Report: <path>
- Causa confirmada: <resumo>
- Paths alterados: <paths>

## Evidências

- Testes automatizados: <comandos e resultados>
- Playwright/manual: <cenário, endpoints/status e estado observado>
- Blockers: <nenhum ou descrição exata>

## Encaminhamento

- Bug Report: <open|closed|blocked>
- Próximo passo: <conclude-bug-report|create-spec|nenhum>
```
