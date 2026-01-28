# Promtp: Criar PRD

**Objetivo:**
Padronizar a criação de Pull Requests (PRs), garantindo descrições claras que facilitem a revisão de código e o rastreamento de tarefas. O foco é utilizar exclusivamente as ferramentas do **GitHub MCP** para manter a integridade do fluxo de trabalho.

**Entrada:**
*   Uma Spec (especificação) devidamente implementada e validada.
*   Uma Bug Report (relatório de bug) devidamente implementada e validada.
*   Uma branch de funcionalidade (`feature/`), correção (`fix/`) ou refatoração (`refactor/`) com as alterações comitadas.

**Diretrizes de Execução:**

1.  **Análise do Contexto:**
    *   Revise a Spec implementada e o changelog das alterações realizadas.
    *   Identifique os impactos técnicos e as decisões de design tomadas.

2.  **Definição do Título:**
    *   O título deve ser curto, direto, em PT-BR e seguir a essência da alteração (ex: "Implementação da listagem de produtos" ou "Correção do erro de carregamento de imagem" ou ainda "Correção de navegação para tela de catálogo").
    *   Não inclua prefixos no título, como `feat/`, `fix/` ou `refactor/`.

3.  **Estrutura da Descrição (Body):**
    O corpo do PR deve seguir o template abaixo, preenchendo as seções relevantes. **Nota:** Utilize sempre formatação Markdown para garantir legibilidade e organização. Evite usar título principal `#`, use apenas subtítulos como `##` e demais com nível abaixo.

    *   🎯 **Objetivo (obrigatório):** Explique *por que* este PR foi criado e qual o seu propósito central.
    *   #️⃣ **Issues relacionadas (opcional):** Vincule tarefas ou bugs utilizando as palavras-chave do GitHub (ex: `fixes #123`).
    *   🐛 **Causa do bug (opcional):** Caso seja um `fix`, detalhe a razão técnica raiz do problema.
    *   📋 **Changelog (obrigatório):** Liste de forma técnica as principais modificações realizadas no código.
    *   🧪 **Como testar (obrigatório):** Forneça um guia passo a passo para que o revisor possa validar as alterações.
    *   👀 **Observações (opcional):** Adicione informações sobre decisões de arquitetura, limitações identificadas ou novos contextos.

4.  **Criação via GitHub MCP:**
    *   **Atenção:** Nunca utilize comandos `git` diretamente no terminal em qualquer etapa do processo. 
    *   Utilize a ferramenta `create_pull_request`.
    *   Siga o formato de dados abaixo para a execução da ferramenta:

```json
{
  "owner": "JohnPetros",
  "repo": "stardust",
  "base": "main",
  "head": "<Nome da branch>",
  "title": "<Titulo do PR>",
  "body": "<Descrição formatada conforme o item 3>"
}
```

5.  **Retorno:**
    *   Junto com a sua resposta, envie o link do PR criado no GitHub.

---
