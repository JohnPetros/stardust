---
description: Prompt para analisar alterações e executar commits reais com padrão de mensagens definido.
---

# Prompt: Fazer Commits no Código

**Objetivo Principal**

Criar **e executar commits reais** no repositório para todas as alterações
detectadas, com mensagens altamente descritivas e padronizadas, seguindo
rigorosamente as diretrizes de contribuição do projeto.

Você **deve executar comandos git**, não apenas sugerir mensagens.

---

## 🚨 PRÉ-CONDIÇÕES OBRIGATÓRIAS

Execute estas verificações **antes de qualquer outra coisa**. Se qualquer
condição falhar, **pare imediatamente** e informe o motivo.

### 1. Verificar staging area
```bash
git diff --cached --name-only
```

- Se houver arquivos em stage → **ABORTAR**
- Informe: `⛔ Aborted: there are already staged files. Run 'git reset HEAD' to
  unstage them before proceeding.`

### 2. Verificar se há alterações
```bash
git status --porcelain
```

- Se vazio → responda: `✅ No changes to commit` e pare.
- Se houver alterações → continue para a próxima etapa.

---

## 🔍 Análise das Alterações

### Regra de análise

Para cada arquivo alterado, analise **tanto o caminho quanto o conteúdo do
diff** para determinar a natureza real da mudança:
```bash
git diff --stat
git diff -- <arquivo>
```

Não se baseie apenas no nome do arquivo. Um `user.service.ts` pode conter
um bugfix, um refactor ou um novo use case — o caminho sozinho não é
suficiente para classificar.

### Regra de agrupamento

Agrupe arquivos por **responsabilidade semântica**, não por pasta. Critérios:

- Arquivos que implementam a mesma funcionalidade → mesmo commit
- Arquivos em camadas diferentes (ex: domain + REST) → commits separados por
  camada

### Regra para arquivos ambíguos

Se um arquivo puder pertencer a mais de um grupo:

1. Sinalize a ambiguidade explicitamente no output:
   `⚠️ Ambiguous: <arquivo> could be '<prefix-a>' or '<prefix-b>'. Classifying
   as '<prefix-escolhido>' based on diff content.`
2. Tome a decisão e prossiga com o commit.

---

## 📋 Tabela de Prefixos

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
| Design                        | design   | 🎨    |
| Certificates/Licensing        | cert       | 📜    |
| Validation schema             | validation | 📮    |
| Emergency hotfix              | hotfix     | 🚑    |
| Continuous delivery           | cd         | 🚚    |
| Continuous integration        | ci         | 🏎️    |
| New release                   | release    | 🔖    |
| Docker files                  | docker     | 🐳    |

---

## 📝 Padrão de Mensagem (Strict)
```
emoji prefix: concise description in English
```

- Mensagem **obrigatoriamente em Inglês**
- Use apenas prefixos da tabela acima
- Um commit por responsabilidade semântica
- Descrição curta, direta, no imperativo (ex: `add`, `fix`, `remove`)

---

## ⚙️ Execução Obrigatória

Para cada grupo de arquivos identificado, execute na ordem:
```bash
git add <arquivos-do-grupo>
git commit -m "emoji prefix: concise description in English"
```

**Não peça confirmação. Não explique antes. Execute.**

Repita até `git status --porcelain` retornar vazio.

---

## ✅ Verificação por Commit (Checklist Interno)

Antes de executar cada `git commit`, valide mentalmente:

- [ ] Analisei o diff, não apenas o nome do arquivo
- [ ] A mensagem está em inglês
- [ ] O emoji corresponde ao prefixo
- [ ] O prefixo está na tabela
- [ ] A descrição representa corretamente o grupo
- [ ] Arquivos ambíguos foram sinalizados

---

## 📤 Formato de Saída Obrigatório
```
[PRE-CHECK] Staging area: clean ✅
[PRE-CHECK] Pending changes: 4 files ✅

EXECUTING:
git add src/domain/user.ts src/domain/user.repository.ts
git commit -m "🌐 domain: add user aggregate and repository interface"

⚠️ Ambiguous: src/services/auth.service.ts could be 'use case' or 'rest'.
   Classifying as 'use case' based on diff content (no HTTP handlers found).

EXECUTING:
git add src/services/auth.service.ts
git commit -m "✨ use case: add authentication flow"

[DONE] All changes committed. ✅
```

---

## 🚫 Comportamentos Proibidos

- Commitar com staging area suja previamente
- Classificar arquivos apenas pelo caminho, sem analisar o diff
- Gerar apenas sugestões sem executar os comandos
- Parar no meio do processo sem commitar todas as alterações
- Inventar prefixos fora da tabela