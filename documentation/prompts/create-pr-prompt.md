---
name: create-pr
description: Publicar ou atualizar um Pull Request do Stardust com rastreabilidade de Issue, PRD e SDD, além de evidências atuais de validação.
---

# Prompt: Criar ou Atualizar Pull Request

## Objetivo

Publicar uma entrega coerente do Stardust no GitHub. Use `gh`, preserve a
worktree do usuário e atualize um PR existente da mesma entrega em vez de criar
uma duplicata.

Esta tarefa não cria Spec, PRD, Plan, Issue ou Report. Apenas consome os
documentos que já existirem e a demanda direta quando a entrega não tiver
documentação SDD.

## Entradas e fontes de autoridade

Leia, quando existirem e forem aplicáveis:

- Spec ou Bug Report implementado;
- Plan;
- `evaluation.md`;
- diff real da entrega;
- `documentation/rules/sdd-rules.md`;
- `documentation/tooling.md`;
- rules aplicáveis;
- `documentation/rules/commit-rules.md`;
- Issue e milestone do GitHub usadas como rastreabilidade.

Quando a entrega vier de uma Spec, confirme que o `evaluation.md` usa a
estrutura canônica de `documentation/templates/evaluation.md` e possui
evidências atuais para a revisão exata da Spec.

Quando a entrega vier de uma demanda direta, não invente Spec, PRD, Issue,
requisitos ou registros externos para preencher o PR.

Exija autorização explícita antes de fazer commit, `push` e criar ou atualizar
o PR. No uso independente, invoque `commit-code` para alterações pendentes do
escopo. Quando chamado por `conclude-spec`, reutilize os commits já preparados.

## Inspeção da entrega

Antes da publicação, inspecione a worktree completa e o histórico da entrega:

```bash
git status --short
git diff --stat
git diff
git diff --cached --stat
git diff --cached
git log -10 --format='%h %s'
```

Identifique:

- arquivos em `stage`, modificados e não rastreados;
- artifacts gerados, migrations, seeds e configurações;
- aplicações e packages afetados;
- alterações do usuário sem relação com a entrega;
- segredos ou dados locais que não podem entrar no PR.

Preserve alterações alheias e mantenha-as fora dos commits. Se a relação entre
um arquivo e a entrega for ambígua, interrompa e informe a ambiguidade em vez
de incluir o arquivo por suposição.

## Preparação da branch e do PR

1. Inspecione as alterações em `stage` e fora dele.
2. Conclua os commits autorizados da entrega e confirme que a worktree está
   limpa antes de iniciar o merge com `main`.
3. Busque a branch real de integração sem trocar a worktree:

   ```bash
   git fetch origin main --prune
   ```

4. Consulte PRs abertos e fechados relacionados à entrega:

   ```bash
   gh pr list --state all --search "<termos da Spec, Issue ou entrega>"
   ```

5. Verifique base, head, SHA e ancestralidade. O nome da branch não comprova
   incorporação.
6. Use `main`/`origin/main` como base de integração, salvo instrução explícita
   diferente.
7. Incorpore obrigatoriamente o `origin/main` mais recente na branch da entrega
   conforme a seção seguinte.
8. Calcule e revise o diff completo contra a base do PR após o merge.
9. Se já existir um PR da mesma entrega, atualize seu head e body. Caso
   contrário, crie um único PR para a entrega coerente.

Não use operações Git destrutivas, não ignore hooks, não crie branches
dependentes acidentalmente e não misture alterações sem relação. Entregas
separadas exigem fronteiras semânticas reais e ordem explícita de dependência.

## Sincronização obrigatória com `main`

Antes de criar ou atualizar o PR, faça merge do `origin/main` mais recente na
branch da entrega. Não substitua essa etapa por `rebase` e não publique uma
branch que ainda não contenha o SHA remoto de `main` observado imediatamente
antes da publicação.

Com a worktree limpa, execute:

```bash
git fetch origin main --prune
git merge --no-edit origin/main
```

Quando o merge for concluído sem conflitos, revise o novo diff e repita as
validações afetadas pelo conteúdo incorporado.

### Conflitos menores e inequívocos

Resolva automaticamente somente conflitos mecânicos cujo resultado correto
possa ser determinado sem escolher entre comportamentos concorrentes. Exemplos:

- ordenação de imports ou formatação;
- alterações independentes em documentação;
- adições independentes que devem coexistir;
- artifacts gerados que podem ser recriados por um comando oficial e
  determinístico do repositório.

Antes de resolver, inspecione os três lados do conflito e confirme que a
solução preserva integralmente a intenção de `main` e da entrega. Depois:

1. edite apenas os arquivos em conflito;
2. execute `git add -- <arquivos-resolvidos>` com paths explícitos;
3. conclua o merge sem alterar a mensagem padrão;
4. revise o diff resultante;
5. execute novamente os checks afetados.

Não classifique um conflito como menor apenas pela quantidade de arquivos ou
linhas envolvidas.

### Conflitos complexos ou ambíguos

Interrompa o fluxo e solicite orientação ao usuário quando a resolução exigir
decidir qual comportamento deve prevalecer. Isso inclui, entre outros:

- lógica de domínio ou regras de negócio concorrentes;
- contratos de API, tipos públicos ou schemas incompatíveis;
- migrations, seeds ou mudanças de persistência conflitantes;
- autenticação, autorização ou segurança;
- versões de dependências ou lockfiles cuja intenção não possa ser inferida;
- arquivo removido de um lado e modificado do outro;
- workflows, infraestrutura ou variáveis de ambiente com estratégias
  divergentes;
- testes que expressem expectativas funcionais incompatíveis.

Ao solicitar orientação:

1. liste os arquivos e hunks em conflito;
2. explique a intenção observável de `main` e da branch da entrega;
3. apresente o impacto de cada resolução possível;
4. não escolha silenciosamente uma alternativa;
5. não faça `git add`, commit, `push` ou publicação do PR;
6. preserve o merge pausado, salvo quando o usuário solicitar explicitamente
   `git merge --abort`.

### Verificação antes da publicação

Imediatamente antes do `push` e da criação ou atualização do PR, atualize
novamente a referência e confirme a ancestralidade:

```bash
git fetch origin main --prune
git merge-base --is-ancestor origin/main HEAD
```

Se a verificação falhar, incorpore novamente `origin/main`, trate conflitos
pelas mesmas regras e repita as validações afetadas. Não publique enquanto
`origin/main` não for ancestral do `HEAD`.

## Evidências de validação

Use as evidências atuais da entrega e execute somente os checks adicionais
aprovados pelo repositório que forem necessários para validar o estado de
publicação. Não substitua comandos exatos de `documentation/tooling.md` por
comandos genéricos presumidos.

Quando houver Spec, confirme antes da publicação:

- revisão exata da Spec congelada;
- todos os caminhos alterados dentro do escopo registrado;
- árvore obrigatória de arquivos e widgets preservada;
- contratos atendidos;
- nenhuma evidência afetada está obsoleta.

Se essa conformidade falhar, interrompa a publicação e encaminhe a correção por
`implement-spec`. Não corrija a implementação diretamente dentro do fluxo de
criação do PR.

Para UI baseada em design, use o bundle de design salvo pela Spec, não o Pencil
ao vivo. Confirme no `evaluation.md` a comparação independente de cada estado e
viewport obrigatório, incluindo:

- rota, estado e referência salva ou source node ID;
- viewport alvo;
- resultado da validação manual em navegador;
- captura da implementação ou identificador do artifact;
- comparação de estrutura, conteúdo, hierarquia, espaçamento, dimensões,
  tokens, interações e responsividade;
- observações de acessibilidade e DOM;
- findings visuais resolvidos.

Não crie uma seção separada de evidências visuais no body do PR. Quando houver
alteração de UI, resuma o resultado em `## Testes manuais` e referencie o
`evaluation.md` em `## Validações automatizadas` ou `## Limitações conhecidas`.

Revise migrations, artifacts gerados e lockfiles quando afetados. Não declare
como executado um check, fluxo manual, review ou deploy que não foi observado.
Registre limitações de ambiente, tentativas com falha e comandos omitidos sem
convertê-los em evidência de sucesso.

## Artifacts gerados e migrations

Quando a entrega alterar persistência ou conteúdo gerado:

- compare migrations, snapshots e journals com `origin/main`;
- resolva colisões de numeração preservando entradas anteriores;
- execute uma vez o comando documentado de geração ou verificação;
- revise SQL e metadados gerados contra a fonte da entrega;
- confirme que seeds, rotas geradas, lockfiles e demais derivados estão
  atuais e incluídos somente quando necessários.

Nunca edite manualmente artifacts gerados para ocultar divergências. Nunca
trate falha de geração ou ambiente indisponível como check aprovado.

## Contrato do PR

O body deve usar exatamente as seções abaixo e na mesma ordem.

### Objetivo

Use o heading:

```markdown
## Objetivo
```

Descreva o problema, o resultado esperado, o escopo e as exclusões relevantes.

### PRD

Use sempre o heading:

```markdown
## PRD
```

Quando houver PRD, informe uma ou mais URLs completas das milestones do
Stardust, uma por linha:

```markdown
## PRD

https://github.com/JohnPetros/stardust/milestone/40
```

Quando não houver PRD, use:

```markdown
## PRD

Não aplicável — alteração exclusivamente técnica.
```

Não omita esta seção. Ela é a fonte principal usada pelo processo de release
para selecionar quais PRDs terão E2E.

### Requisitos afetados

Inclua esta seção somente quando houver PRD:

```markdown
## Requisitos afetados

- `REQ-01` — descrição resumida.
- `REQ-03` — descrição resumida.
```

Use somente identificadores que existam no PRD. Para PRDs legados, preserve o
identificador original, como `RF-*`, sem convertê-lo artificialmente.

### Issues relacionadas

Use o heading:

```markdown
## Issues relacionadas
```

Liste somente Issues reais. Use `resolve #123` apenas quando o merge deste PR
deve encerrar a Issue. Quando não houver Issue, escreva `Nenhuma.`

### Implementação técnica

Use o heading:

```markdown
## Implementação técnica
```

Resuma os recortes coerentes de frontend, backend, domínio, persistência e
testes, citando apenas os caminhos mais relevantes.

### Alterações de regras de negócio

Inclua esta seção somente quando comportamento, validação, autorização ou
workflow de produto forem alterados. Registre comportamento anterior, novo
comportamento, motivo e evidência.

### Testes manuais

Use o heading:

```markdown
## Testes manuais
```

Informe pré-requisitos, passos reproduzíveis, resultado esperado e fluxos de
erro ou recuperação. Para mudanças de UI, inclua aqui um resumo da validação
visual, sem criar uma seção própria de evidências visuais.

### Validações automatizadas

Use o heading:

```markdown
## Validações automatizadas
```

Liste comandos exatos e resultados observados, incluindo falhas, limitações e
checks omitidos.

### Limitações conhecidas

Use o heading:

```markdown
## Limitações conhecidas
```

Registre lacunas não bloqueantes ou escreva `Nenhuma.`

Não adicione seções genéricas como `Changelog`, `Impacto e compatibilidade`,
`Observações` ou `Evidências visuais`. Não copie o diff inteiro. Não invente
Issues, requisitos, resultados de testes ou aprovações humanas. Não inclua uma
seção `Codex Review Summary` nem qualquer resumo automatizado de revisão no
body do PR.

## Título

Use uma frase nominal curta em PT-BR, sem prefixo de Conventional Commit ou
chave de Issue inventada. Não comece o título com verbo.

Exemplos:

- `Configuração da listagem de produtos`
- `Correção da navegação para a tela de catálogo`
- `Cobertura do cadastro com testes de integração`

Para correções, inclua no body a causa comprovada e a solução aplicada.

## Publicação e retorno

Faça `push` da branch preparada e crie ou atualize o PR com `gh`. O workflow do
Hermes inicia automaticamente depois que os checks aplicáveis passam para o
head SHA atual.

Depois, obtenha os metadados reais:

```bash
gh pr view <numero> \
  --json number,url,headRefName,baseRefName,headRefOid,commits,statusCheckRollup
```

Retorne:

- URL e número do PR;
- base, head e head SHA;
- resumo dos caminhos alterados;
- PRD ou `Não aplicável`;
- requisitos afetados;
- estado atual dos checks e reviews.

Não faça merge nem deploy. Comentários de review posteriores são tratados por
`resolve-pr-pendencies`.
