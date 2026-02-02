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

---

## Diretrizes de Execução

### 1️⃣ Detectar Alterações

Execute primeiro:

git status --porcelain

- Se vazio → responda: `No changes to commit`
- Se houver alterações → continue

---

### 2️⃣ Análise do Contexto

- Analise **somente o nome e caminho dos arquivos alterados**
- Não analise o conteúdo
- Agrupe por responsabilidade
- Se houver mudanças em camadas diferentes (ex: UI e REST), crie commits
  separados

---

### 3️⃣ Padrão de Mensagem (Strict)

Cada commit deve seguir o formato:

emoji prefix: concise description in English

- Mensagem **obrigatoriamente em Inglês**
- Use apenas prefixos da tabela
- Um commit por responsabilidade

---

## 📋 Tabela de Prefixos (MANTIDA)

| Tipo                     | Prefixo   | Emoji |
| :----------------------- | :-------- | :---- |
| Camada de domínio        | domain    | 🌐    |
| Camada de API REST       | rest      | 📶    |
| Camada de UI             | ui        | 🖥️    |
| Camada de banco de dados | db        | 💾    |
| Use cases                | use case  | ✨    |
| Interfaces               | interface | 📑    |
| Tipagem                  | type      | 🏷️    |
| Documentação             | docs      | 📚    |
| Correção de bug          | fix       | 🐛    |
| Refatoração              | refactor  | ♻️    |
| Teste                    | test      | 🧪    |
| Configuração/Infra       | config    | ⚙️    |
| Dependências             | deps      | 📦    |
| Estrutura de pastas      | ftree     | 🗃️    |
| Trabalho em progresso    | wip       | 🚧    |

---

### 4️⃣ Execução Obrigatória

Para cada grupo de arquivos identificado, execute:

git add <arquivos-do-grupo> git commit -m "emoji prefix: concise description in
English"

Não peça confirmação. Não explique antes. Não gere apenas sugestão. **Execute.**

---

### 5️⃣ Exemplos de Referência

🐛 fix(server): ensure only one achievement is unlocked at once 📑 interface:
add AchievementsRepository ✨ use case: list all challenges 🧪 test: list all
challenges use case

---

### 6️⃣ Verificação Final (Antes de cada commit)

- mensagem curta e direta
- emoji corresponde ao prefixo
- prefixo está na tabela
- descrição em inglês
- representa corretamente o grupo

---

### 7️⃣ Formato de Saída Obrigatório

Mostre apenas comandos executados:

EXECUTING: git add src/domain/user.ts git commit -m "🌐 domain: add user
aggregate"

Sem explicações longas. Sem “sugestões”. Sem parar antes de commitar.
