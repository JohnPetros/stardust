---
description: Prompt para criar pull requests padronizados via gh com titulo, body e checklist de validacao.
---

# Prompt: Criar PR

**Objetivo:** Padronizar a criação de Pull Requests (PRs), incluindo a criação
dos commits pendentes na branch quando necessário, garantindo descrições claras
que facilitem a revisão de código e o rastreamento de tarefas. O foco é
utilizar exclusivamente a **GitHub CLI (gh)** para manter a integridade do fluxo
de trabalho.

---

## Entrada

- Uma Spec (especificação) devidamente implementada e validada.
- Uma Bug Report (relatório de bug) devidamente implementada e validada.
- Uma branch de funcionalidade (`feature/`), correção (`fix/`) ou refatoração
  (`refactor/`) contendo a implementação pronta para revisão, com ou sem
  alterações ainda não commitadas.

---

## Regras Aplicáveis

Antes de criar commits ou abrir o PR, leia:

- `documentation/rules/commit-rules.md` — regras oficiais de agrupamento e mensagem de commit.
- `documentation/rules/pr-review-rules.md` — critérios que o PR deve facilitar para revisão.
- `documentation/rules/code-conventions-rules.md` — convenções gerais a checar no changelog e riscos.
- `documentation/rules/rules.md` — para citar rules de camada quando o PR introduzir padrão novo, decisão arquitetural ou risco relevante.

Se houver commits pendentes, `commit-rules.md` prevalece sobre a tabela duplicada neste prompt. Atualize este prompt quando a tabela divergir da rule.

Antes de criar o PR, confirme o preflight local da Spec e a existência de
`evaluation.md`:

- `npm run check:code`;
- `npm run check:types`;
- `npm run test:unit`;
- `npm run check:architecture`, quando aplicável;
- `npm run test:integration`, quando aplicável.

Para frontend, confirme também a auditoria de `documentation/rules/ui-layer-rules.md`
por widget e a matriz independente de comparação Pencil/Web para todos os nodes
canônicos do Contract.

O `evaluation.md` deve conter as evidências reais do preflight, o resultado do
único Judge Implementation da implementação inteira, warnings, findings,
decisões e lições. O Judge precisa avaliar o HEAD que será publicado; qualquer
mudança posterior deve invalidar o aceite e exigir nova avaliação. Quality Gate
e build ficam pendentes até o CI; não exija que estejam verdes para abrir o PR.

Preserve a worktree e os processos existentes do usuário. Não descarte,
sobrescreva ou encerre processos/alterações fora do escopo do PR para resolver
conflitos locais; escolha uma porta/ambiente alternativo e registre a limitação
quando necessário.

O Quality Gate repete esses checks no CI. O build é executado no CI depois do
Quality Gate e não precisa ser tratado como sensor SDD local obrigatório.

---

## Diretrizes de Execução

### 1. Análise do Contexto

- Revise `spec.md`, `evaluation.md` e o changelog das alterações realizadas.
- Identifique:

  - impactos técnicos
  - decisões de design tomadas
  - riscos e efeitos colaterais

---

### 2. Definição do Título

- Deve ser:

  - curto
  - direto
  - em PT-BR
  - refletir a essência da alteração
  - preferencialmente em formato nominal

- O título do PR não deve começar com verbo.
- Prefira formulações nominais como:

  - `Configuração de...`
  - `Cobertura de...`
  - `Correção de...`
  - `Ajuste de...`
  - `Refatoração de...`

Exemplos:

- Configuração da listagem de produtos
- Correção do erro de carregamento de imagem
- Correção da navegação para tela de catálogo
- Cobertura da página de cadastro com testes de integração

⚠️ Não incluir prefixos no título:

```
feat/
fix/
refactor/
```

---

### 3. Commits Pendentes na Branch

Se a branch ainda **não** estiver com todas as alterações commitadas, antes de
criar o PR siga o mesmo padrão do prompt `commit-code`.

#### 3.1 Pré-condições

Execute:

```bash
git diff --cached --name-only
git status --porcelain
```

- Se houver arquivos previamente em stage, **aborte** e informe o problema.
- Se não houver alterações pendentes, prossiga para a criação do PR.
- Se houver alterações não commitadas, continue para a etapa de agrupamento.

#### 3.2 Regra de agrupamento

Analise **caminho e diff** de cada arquivo alterado:

```bash
git diff --stat
git diff -- <arquivo>
```

Agrupe por **responsabilidade semântica**, não por pasta:

- arquivos que implementam a mesma funcionalidade → mesmo commit
- arquivos em camadas diferentes (ex: domain + REST) → commits separados por
  camada

Se um arquivo for ambíguo, sinalize a ambiguidade, tome a decisão e prossiga.

#### 3.3 Tabela de prefixos para commit

| Type                          | Prefix     | Emoji |
| :---------------------------- | :--------- | :---- |
| Domain layer                  | domain     | 🌐    |
| REST API layer                | rest       | 📶    |
| UI layer                      | ui         | 🖥️    |
| Database layer                | db         | 💾    |
| Work in progress              | wip        | 🚧    |
| Artificial intelligence layer | ai         | 🤖    |
| RPC layer                     | rpc        | 📟    |
| Use cases                     | use case   | ✨    |
| Interfaces                    | interface  | 📑    |
| Typings                       | type       | 🏷️    |
| Documentation                 | docs       | 📚    |
| Bug fix                       | fix        | 🐛    |
| Refactoring                   | refactor   | ♻️    |
| Test                          | test       | 🧪    |
| Config/Infrastructure         | config     | ⚙️    |
| Dependencies                  | deps       | 📦    |
| Folder structure              | ftree      | 🗃️    |
| Provision layer               | provision  | 🧰    |
| Response                      | response   | 📤    |
| Design                        | design     | 🎨    |
| Certificates/Licensing        | cert       | 📜    |
| Validation schema             | validation | 📮    |
| Emergency hotfix              | hotfix     | 🚑    |
| Continuous delivery           | cd         | 🚚    |
| Continuous integration        | ci         | 🏎️    |
| New release                   | release    | 🔖    |
| Docker files                  | docker     | 🐳    |

#### 3.4 Padrão de mensagem e execução

Formato obrigatório:

```text
emoji prefix: concise description in English
```

- mensagem obrigatoriamente em inglês
- um commit por responsabilidade semântica
- descrição curta, direta, no imperativo

Para cada grupo identificado, execute:

```bash
git add <arquivos-do-grupo>
git commit -m "emoji prefix: concise description in English"
```

Só avance para a criação do PR quando `git status --porcelain` estiver vazio.

---

### 4. Estrutura da Descrição (Body)

O corpo do PR deve seguir o template abaixo.

**Regras de formatação:**

- usar Markdown
- não usar título principal `#`
- usar `##` e níveis abaixo

---

## Objetivo (obrigatório)

Explique por que este PR foi criado e qual seu propósito central.

## Issues relacionadas (opcional)

Vincule tarefas/bugs usando **exclusivamente** a palavra-chave `resolve`:

```
resolve #123
resolve #456
```

⚠️ Não usar `resolves`, `closes`, `fixes` ou qualquer outra variação. Apenas `resolve`.

---

## Causa do bug (opcional — apenas fix)

Descreva a causa técnica raiz.

---

## Changelog (obrigatório)

Lista técnica das mudanças:

- arquivos alterados
- comportamento modificado
- regras adicionadas
- refatorações feitas

---

## Como testar (obrigatório)

Passo a passo claro para o revisor validar:

1. …
2. …
3. …

---

## Observações (opcional)

- decisões de arquitetura
- limitações conhecidas
- tradeoffs
- próximos passos

Inclua, quando pertinente, o link ou a referência ao `evaluation.md` e indique
que Quality Gate e build serão confirmados pelo CI.

---

### 5. Criação via gh CLI

⚠️ Não usar GitHub MCP. ⚠️ Não usar APIs MCP. Usar exclusivamente **gh**.

Comando padrão:

```
gh pr create \
  --repo owner/repo \
  --base main \
  --head <nome-da-branch> \
  --title "<Titulo do PR>" \
  --body-file pr_body.md
```

Ou inline:

```
gh pr create \
  --base main \
  --head <branch> \
  --title "<Titulo>" \
  --body "<Descrição formatada>"
```

---

### 6. Monitoramento do CI e loop de correção

Depois de criar o PR, mantenha o workflow aberto até o Quality Gate e o build
do CI passarem para o HEAD atual.

Para cada falha:

1. registre imediatamente a falha no `evaluation.md`;
2. classifique o problema e identifique o sensor ou job afetado;
3. crie `Builder Fix QG-<n>` quando a correção estiver no escopo;
4. aplique a correção, atualize a branch e repita os sensores afetados;
5. repita o único Judge Implementation quando o diff ou a evidência tiver sido
   invalidada;
6. aguarde novamente o CI no novo HEAD.

Repita esse loop até o Quality Gate e o build ficarem verdes. Não encaminhe
para `conclude-spec` enquanto houver check falhando, finding bloqueante ou CI
pendente. Após três falhas consecutivas pelo mesmo motivo, apresente o
histórico e solicite decisão ao usuário.

### 7. Comentário de Code Review

Após criar o PR, adicione um comentário para solicitar code review do Codex:

```
gh pr comment <numero-do-pr> --body "@codex review"
```

Registre o SHA atual do PR. O review só é válido para a entrega quando houver
uma revisão do Codex associada a esse `HEAD`.

---

### 8. Retorno

Após criação:

```
gh pr view --web
```

ou

```
gh pr view --json url
```

Retornar somente após o CI verde:

- link do PR criado
- título final
- resumo do body gerado
