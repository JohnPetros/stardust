---
description: Prompt para analisar alteracoes e executar commits reais com padrao de mensagens definido.
---

# Prompt: Fazer Commits no Código

**Objetivo Principal**

Criar **e executar commits reais** no repositório para todas as alterações
detectadas no código, com mensagens altamente descritivas e padronizadas,
seguindo rigorosamente as diretrizes de contribuição do projeto.

Você **deve executar comandos git**, não apenas sugerir mensagens.

---

## 🚨 Regra Crítica

Se existirem arquivos modificados, você é obrigado a:

- executar `git add`
- executar `git commit`
- repetir o processo até não restarem mudanças pendentes

Nunca apenas sugira commits. Nunca pare somente na mensagem. **Sempre execute os
comandos.**

Não explique antes. Não gere apenas sugestão. **Execute.**

---

## Diretrizes de Execução

### 1️⃣ Detectar Alterações

Execute primeiro:

```bash
git status --porcelain
```

- Se vazio → responda: `No changes to commit`
- Se houver alterações → continue

---

### 2️⃣ Análise do Contexto

- Analise **somente o nome e caminho dos arquivos alterados**
- Não analise o conteúdo
- Agrupe por responsabilidade
- Se houver mudanças em camadas diferentes (ex: UI e REST), crie commits separados

---

### 3️⃣ Padrão de Mensagem (Strict — commitlint)

Cada commit deve seguir **exatamente** o formato abaixo, validado pelo `commitlint`:

```
<emoji> <type>(<scope>): <concise description in English>
```

#### Regras obrigatórias

| Regra                | Detalhe                                                                 |
| :------------------- | :---------------------------------------------------------------------- |
| **Mensagem em Inglês** | Toda descrição deve ser escrita em Inglês                             |
| **`type` obrigatório** | Deve ser um dos tipos da tabela abaixo — nunca invente ou omita       |
| **`scope` obrigatório** | Deve ser um dos escopos válidos: `web`, `server`, `core`, `studio`, `lsp` |
| **Descrição obrigatória** | Nunca deixe o subject vazio                                       |
| **Sem ponto final** | A descrição não deve terminar com `.`                                   |
| **Header ≤ 150 chars** | O header completo (type + scope + description) não pode ultrapassar 150 caracteres |
| **Sem genéricos** | Proibido usar descrições vagas como `update files`, `fix stuff`, `changes`, `minor fix`. A mensagem deve descrever **o que** foi feito e **em qual contexto** |

#### ✅ Exemplos corretos

```
🐛 fix(server): ensure only one achievement is unlocked at once
📑 interface(core): add AchievementsRepository
✨ use case(server): list all challenges
🧪 test(server): list all challenges use case
♻️ refactor(web): extract challenge card into reusable component
⚙️ config(studio): add commitlint rules for emoji types
```

#### ❌ Exemplos proibidos

```
fix: update files          ← genérico, sem scope, sem emoji
🐛 fix: minor fix          ← vago, sem scope
♻️ refactor(web): refactoring  ← descrição não diz o que foi refatorado
update(server): changes    ← type inválido, descrição genérica
```

---

## 📋 Tabela de Prefixos

| Type                          | `type` no commit  | Emoji |
| :---------------------------- | :---------------- | :---- |
| Domain layer                  | `domain`          | 🌐    |
| REST API layer                | `rest`            | 📶    |
| UI layer                      | `ui`              | 🖥️    |
| Database layer                | `db`              | 💾    |
| Work in progress              | `wip`             | 🚧    |
| Artificial intelligence layer | `ai`              | 🤖    |
| Queue layer                   | `queue`           | 🎞️    |
| Provision layer               | `prov`            | 🧰    |
| RPC layer                     | `rpc`             | 📟    |
| Use cases                     | `use case`        | ✨    |
| Interfaces                    | `interface`       | 📑    |
| Typings                       | `type`            | 🏷️    |
| Documentation                 | `docs`            | 📚    |
| Bug fix                       | `fix`             | 🐛    |
| Refactoring                   | `refactor`        | ♻️    |
| Test                          | `test`            | 🧪    |
| Config/Infrastructure         | `config`          | ⚙️    |
| Constants                     | `constants`       | 🪨    |
| Dependencies                  | `deps`            | 📦    |
| Assets                        | `assets`          | 🎴    |
| Merge                         | `merge`           | 🔀    |
| Revert                        | `revert`          | ⏪    |
| Code review fix               | `cr`              | ▶️    |
| Response                      | `response`        | 📤    |
| Folder structure              | `ftree`           | 🗃️    |
| Certificates/Licensing        | `cert`            | 📜    |
| Validation schema             | `validation`      | 📮    |
| Emergency hotfix              | `hotfix`          | 🚑    |
| Continuous delivery           | `cd`              | 🚚    |
| Continuous integration        | `ci`              | 🏎️    |
| New release                   | `release`         | 🔖    |
| Docker files                  | `docker`          | 🐳    |

---

## 📍 Escopos Válidos

| Scope     | Quando usar                                  |
| :-------- | :------------------------------------------- |
| `web`     | Aplicação web (frontend)                     |
| `server`  | Camada de servidor / backend                 |
| `core`    | Pacote de domínio compartilhado              |
| `studio`  | Interface de administração / Studio          |
| `lsp`     | Language Server Protocol                     |

---

### 4️⃣ Execução Obrigatória

Para cada grupo de arquivos identificado, execute:

```bash
git add <arquivos-do-grupo>
git commit -m "🏷️ type(scope): concise description in English"
```

Não peça confirmação. Não explique antes. Não gere apenas sugestão. **Execute.**

---

### 5️⃣ Verificação Final (Antes de cada commit)

- [ ] A mensagem é curta, direta e **não genérica**
- [ ] O emoji corresponde ao `type`
- [ ] O `type` está na tabela de prefixos
- [ ] O `scope` é um dos valores válidos (`web`, `server`, `core`, `studio`, `lsp`)
- [ ] A descrição está em Inglês
- [ ] O header tem ≤ 150 caracteres
- [ ] Não termina com ponto final
- [ ] Representa corretamente a responsabilidade do grupo de arquivos

---

### 6️⃣ Formato de Saída Obrigatório

Mostre apenas os comandos executados:

```
EXECUTING:
git add src/domain/user.ts
git commit -m "🌐 domain(core): add user aggregate"
```

Sem explicações longas. Sem "sugestões". Sem parar antes de commitar.