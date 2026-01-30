# Prompt: Commit Code

**Objetivo Principal**
Gerar mensagens de commit altamente descritivas e padronizadas para as alterações realizadas no código, seguindo rigorosamente as diretrizes de contribuição do projeto.

**Diretrizes de Execução:**

1.  **Análise do Contexto:**
    *   Analise somente o nome dos arquivos alterados para entender exatamente o que mudou
    *   Agrupe as alterações por responsabilidade. Se houver mudanças em camadas diferentes (ex: UI e REST), sugira commits separados.
    *   Analise o conteúdo dos arquivos agrupados alterados para entender exatamente o que mudou

2.  **Padrão de Mensagem (Strict):**
    Cada commit deve seguir o formato: `emoji prefix: concise description in English`.

    *   **Idioma:** A mensagem de commit **deve ser em Inglês**.
    *   **Prefixo:** Escolha o prefixo e emoji correto com base na tabela abaixo:

    | Tipo                           | Prefixo    | Emoji |
    | :----------------------------- | :--------- | :---- |
    | Camada de domínio              | domain     | 🌐    |
    | Camada de API REST             | rest       | 📶    |
    | Camada de UI                   | ui         | 🖥️    |
    | Camada de banco de dados       | db         | 💾    |
    | Use cases                      | use case   | ✨    |
    | Interfaces                     | interface  | 📑    |
    | Tipagem                        | type       | 🏷️    |
    | Documentação                   | docs       | 📚    |
    | Correção de bug                | fix        | 🐛    |
    | Refatoração                    | refactor   | ♻️    |
    | Teste                          | test       | 🧪    |
    | Configuração/Infra             | config     | ⚙️    |
    | Dependências                   | deps       | 📦    |
    | Estrutura de pastas            | ftree      | 🗃️    |
    | Trabalho em progresso          | wip        | 🚧    |

3.  **Exemplos de Referência:**
    *   `🐛 fix(server): ensure only one achievement is unlocked at once`
    *   `📑 interface: add AchievementsRepository`
    *   `✨ use case: list all challenges`
    *   `🧪 test: list all challenges use case`

4.  **Verificação Final:**
    *   A mensagem é curta e direta?
    *   O emoji corresponde ao prefixo?
    *   O prefixo está na lista permitida?
    *   A descrição está em Inglês?