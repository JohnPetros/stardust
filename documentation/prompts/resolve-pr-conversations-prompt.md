---
description: Prompt para resolver conversas pendentes de um pull request com analise, implementacao e fechamento de threads.
---

# Prompt: Resolver Conversas de PR

**Objetivo Principal:**
Analisar, implementar e resolver todas as conversas e feedbacks pendentes em um Pull Request (PR) específico do GitHub. O foco é garantir que todos os pontos de melhoria, correções de bugs e sugestões de design levantadas pelos revisores sejam devidamente endereçados no código, respeitando os padrões e a arquitetura do projeto.

**Entrada:**
* **Link do PR:** URL completa do Pull Request no GitHub (ex: `https://github.com/owner/repo/pull/123`).

---

## Diretrizes de Execução

### 1. Extração de Contexto
* Identifique o `owner`, `repo` e `pullNumber` a partir da URL fornecida.
* Utilize o `github-mcp-server` para obter os detalhes do PR (título, branch, descrição, arquivos alterados).

### 2. Mapeamento de Conversas
* Execute `github-mcp-server.pull_request_read` com o método `get_review_comments` para listar todas as threads de revisão.
* Filtre e classifique cada thread em uma das categorias abaixo:

| Categoria | Critério | Ação |
|---|---|---|
| **Implementar** | Correção de código, ajuste de padrão, bug apontado | Implementar autonomamente |
| **Escalar** | Mudança arquitetural, decisão de design, conflito com spec | Usar `question` para consultar o usuário antes de agir |
| **Ignorar** | Thread já resolvida ou marcada como `outdated` | Pular |

> ⚠️ **Regra de escalada:** Qualquer comentário que implique mudança de arquitetura, remoção de funcionalidade ou conflito com o PRD/Spec associado deve ser escalado — nunca implementado de forma autônoma.

### 3. Análise e Implementação
Para cada thread da categoria **Implementar**:
* Localize o arquivo e as linhas de código mencionadas.
* Analise a sugestão ou problema apontado pelo revisor.
* Aplique as alterações necessárias utilizando as ferramentas de edição de arquivo (`replace_file_content`, `multi_replace_file_content`).
* Garanta que as mudanças sigam os padrões do projeto:
  * **Convenções de código:** `documentation/rules/code-conventions-rules.md`
  * **Arquitetura geral:** `documentation/architecture.md`
  * **Regras por camada:** conforme indicado em `documentation/rules/rules.md`

Para cada thread da categoria **Escalar**:
* Use a ferramenta `question` para apresentar ao usuário:
  * O comentário original do revisor.
  * O impacto identificado (o que precisaria mudar e por quê é uma decisão não trivial).
  * As opções possíveis, se houver.
* Aguarde a decisão antes de prosseguir.

### 4. Validação das Alterações
Após implementar todas as correções:
* **Lint e formatação:** Execute `npm run codecheck` na raiz do monorepo.
* **Tipagem:** Execute `npm run typecheck`.
* **Testes:** Execute `npm run test` para garantir que nenhum teste existente foi quebrado.
* Verifique se as alterações permanecem aderentes ao PRD e à Spec associada ao PR.

### 5. Fechamento das Threads
* Resolva cada thread implementada usando a mutation `resolveReviewThread` via GitHub GraphQL API.
* Threads escaladas que aguardam decisão do usuário **não devem ser resolvidas** até que a implementação seja confirmada.

### 6. Atualização da Documentação
Localize o documento de Spec ou Bug Report associado à branch do PR (`documentation/features/.../specs/...`) e, se as alterações implementadas afetarem o escopo documentado:
* Ajuste a descrição das seções impactadas para refletir as decisões finais.
* Atualize o campo `last_updated_at` no frontmatter.
* Se o PRD associado tiver itens de checklist impactados, marque-os como concluídos.

---

## Fluxo de Trabalho

### Passo 1: Coleta de Dados
Acesse as informações do PR e liste todos os comentários de revisão.
* **Ferramenta:** `github-mcp-server.pull_request_read(method: 'get_review_comments', ...)`

### Passo 2: Diagnóstico e Triagem
Para cada thread de comentário, identifique e classifique:
* O arquivo afetado e as linhas envolvidas.
* O problema descrito pelo revisor.
* A solução proposta.
* A categoria da thread: **Implementar**, **Escalar** ou **Ignorar**.

Antes de avançar, apresente ao usuário a lista de threads classificadas e aguarde confirmação se houver qualquer item marcado como **Escalar**.

### Passo 3: Execução
* Implemente as correções das threads categorizadas como **Implementar**.
* Para threads **Escalar**, use `question` e aguarde resposta antes de agir.

### Passo 4: Validação
Execute a sequência de validação:
```
npm run codecheck
npm run typecheck
npm run test
```
Corrija eventuais erros antes de prosseguir.

### Passo 5: Conclusão
Relate o progresso com o seguinte formato:

```
## Resumo de Resoluções

### ✅ Implementadas
- [x] `caminho/do/arquivo.ts` — [descrição da mudança realizada]
- [x] `caminho/do/outro/arquivo.ts` — [descrição da mudança realizada]

### ⏳ Aguardando decisão
- [ ] `caminho/do/arquivo.ts` — [comentário do revisor] → [motivo da escalada]

### ⏭️ Ignoradas
- `caminho/do/arquivo.ts` — thread já resolvida / outdated
```

### Passo 6: Atualização da Documentação
Analise o documento de Spec ou Bug Report da funcionalidade relacionada e atualize-o caso as alterações implementadas impactem o escopo ou as decisões de design documentadas.