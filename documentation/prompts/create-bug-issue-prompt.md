---
name: create-bug-issue
description: Criar uma GitHub bug issue factual no Stardust a partir de uma falha observada, com approval gate e sem diagnóstico técnico.
---

# Criar Bug Issue

Transforme um relato informal em uma única issue de intake e tracking. Não diagnostique causa,
crie Bug Report/Spec, implemente, abra branch, commit ou PR.

## Contexto obrigatório

Leia `AGENTS.md`, `documentation/rules/rules.md` e `documentation/modules.md`. Leia a milestone e
o PRD versionado aplicáveis quando a falha violar comportamento de produto. Inspecione source ou
testes apenas para identificar app/módulo ou distinguir comportamento atual de intenção; deep
diagnosis pertence a `create-bug-report`.

Use o contrato de produto real para Expected Behavior e preserve qualquer checkbox/status.
Se a expectativa mudar o comportamento pretendido, pare e encaminhe para feature/amendment.

## Gate obrigatório de PRD

Antes do draft, identifique o PRD mais relevante:

1. derive módulo, ator, lifecycle e comportamento violado a partir do relato;
2. pesquise PRDs versionados em `documentation/**/prd.md` e `documentation/prds/*.md`;
3. pesquise milestones abertas e fechadas via GitHub e siga links para PRDs versionados;
4. compare candidatos pelo mesmo outcome, atores, capacidades, experiência e fluxo — não apenas
   por palavras do título;
5. selecione uma única referência principal e o requisito/anchor mais específico disponível;
6. quando nenhum PRD governar o comportamento, registre explicitamente
   `None — <evidência da busca e motivo>` em vez de omitir ou inventar associação.

Se a busca não encontrar um PRD candidato, antes de preparar o draft pergunte ao usuário:
“Qual PRD você considera mais relevante para este comportamento? Se nenhum se aplicar, confirme
que não há PRD.” Use a indicação do usuário somente após conferir que ela corresponde ao módulo,
ator, outcome e fluxo relatados. Se o usuário confirmar que não há PRD, registre
`None — usuário confirmou que não há PRD aplicável após a busca`.

Se milestone e PRD versionado divergirem, resolva a autoridade antes do draft. A busca e a
seleção são obrigatórias mesmo quando o usuário não fornece PRD ou milestone.

## Metadata GitHub

- repository: `JohnPetros/stardust`;
- label obrigatória: `bug`;
- labels `web`, `server` e/ou `studio` somente quando confirmadas;
- use apenas labels existentes; não crie labels;
- milestone somente quando ownership de produto estiver estabelecido;
- não adicione bug ao Project 2 por inferência.

## Título e body

Use título nominal, sem prefixo de commit, descrevendo o sintoma, por exemplo
`Correção do redirecionamento após login`.

As seções `Contexto` e `Evidência` são opcionais: inclua cada uma somente quando houver dados
úteis fornecidos pelo usuário ou encontrados na investigação permitida. Nunca invente valores
para preencher uma seção opcional.

```md
## Problema

<o que acontece e onde>

## Comportamento esperado

<o que deveria acontecer segundo a autoridade existente>

## Reprodução

1. <estado inicial>
2. <ação>
3. <resultado observado>

## Contexto

- **Módulo:** <módulo ou Não identificado>
- **Aplicação:** <web|server|studio|combinação|Não identificada>
- **Ambiente:** <local|staging|production|Não identificado>
- **Frequência:** <sempre|intermitente|observado uma vez|Não identificada>
- **Perfil afetado:** <perfil ou Não identificado>
- **PRD mais relevante:** <URL/path ou None com motivo>
- **Requisito do PRD:** <anchor/ID ou documento completo>
- **Milestone:** <URL ou None>

## Evidência

- <links, screenshots, gravações ou outra evidência fornecida>
```

Quando não houver reprodução, escreva `Ainda não reproduzível`; mantenha desconhecidos
explícitos e nunca os adivinhe.

## Approval gate

Antes de escrever no GitHub, apresente título, body, labels, milestone, PRD selecionado,
requisito/anchor e justificativa de relevância. Publique somente depois de aprovação explícita
da versão atual. A aprovação autoriza apenas a issue.

Depois da publicação, retorne número, URL, título, labels, milestone, PRD/requisito selecionado e
resumo da falha. Recomende `create-bug-report` como próximo diagnóstico, mas não o invoque sem
pedido.

## Restrições

- exatamente uma issue salvo pedido de decomposição;
- sem root cause, affected files, correction guidance, acceptance, validation ou tasks;
- não altere produto, PRD ou SDD artifacts;
- não use `None` sem executar e resumir a busca obrigatória de PRD;
- não invente reprodução, ambiente ou expectativa.
