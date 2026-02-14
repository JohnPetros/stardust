---
description: Prompt para resolver conversas pendentes de um pull request com analise, implementacao e fechamento de threads.
---

# Prompt: Resolver conversas de PR 

**Objetivo Principal**
Analisar, implementar e resolver todas as conversas e feedbacks pendentes em um Pull Request (PR) específico do GitHub. O foco é garantir que todos os pontos de melhoria, correções de bugs e sugestões de design levantadas pelos revisores sejam devidamente endereçados no código.

**Entrada:**
* **Link do PR:** URL completa do Pull Request no GitHub (ex: `https://github.com/owner/repo/pull/123`).

**Diretrizes de Execução:**

1. **Extração de Contexto:**
   * Identifique o `owner`, `repo` e `pullNumber` a partir da URL fornecida.
   * Utilize o `github-mcp-server` para obter os detalhes do PR.

2. **Mapeamento de Conversas:**
   * Execute `github-mcp-server.pull_request_read` com o método `get_review_comments` para listar todas as threads de revisão.
   * Filtre as conversas que ainda não foram resolvidas ou que exigem alterações no código.

3. **Análise e Implementação:**
   * Para cada comentário:
     * Localize o arquivo e as linhas de código mencionadas.
     * Analise a sugestão ou problema apontado pelo revisor.
     * Aplique as alterações necessárias no código local utilizando as ferramentas de edição de arquivo (`replace_file_content`, `multi_replace_file_content`).
     * Garanta que as mudanças sigam os padrões do projeto descritos em `documentation/code-conventions-guidelines.md` e `documentation/architecture.md`.

4. **Validação das Alterações:**
   * Após implementar as correções, verifique se o código compila corretamente, usando o comando flutter analyzer.
   * Execute testes relevantes se disponíveis, usando o MCP do dart.
   * Verifique se as alterações atendem aos requisitos do PRD e Spec.

5. **Finalização:**
   * Resolvas as conversas do PR usando usando a mutation resolveReviewThread via GitHub GraphQL API
   * Forneça um resumo detalhado de quais conversas foram resolvidas e quais alterações de código foram realizadas.

---

## FLUXO DE TRABALHO (Workflow)

### Passo 1: Coleta de Dados
Acesse as informações do PR e liste todos os comentários de revisão.
* **Ferramenta:** `github-mcp-server.pull_request_read(method: 'get_review_comments', ...)`

### Passo 2: Diagnóstico
Para cada thread de comentário, identifique:
* O arquivo afetado.
* O problema descrito.
* A solução proposta.

### Passo 3: Execução
Modifique os arquivos no ambiente local para refletir as resoluções.
Se houver dúvidas sobre um comentário específico ou se o comentário for ambíguo, peça esclarecimentos ao usuário antes de prosseguir.

### Passo 4: Conclusão
Relate o progresso, indicando:
* [x] Arquivo X: Comentário sobre Y resolvido (descrição da mudança).
* [x] Arquivo Z: Ajuste de padrão realizado.

### Passo 5: Atualização da documentação relacionada
Anaalise o documento de Spec, ou Bug Report, ou PRD da funcionalidade relacionada e atualize-a caso seja necessário com as novas alterações
