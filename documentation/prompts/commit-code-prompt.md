# Prompt: Commitar Código

**Objetivo:**
Orientar o agrupamento lógico de alterações e a criação de commits padronizados seguindo estritamente as diretrizes do projeto definidas em `CONTRIBUTING.md`.

**Entrada:**
*   Lista de arquivos modificados, criados ou deletados (staged ou não).
*   Contexto das alterações (o que foi implementado, corrigido ou refatorado).

**Diretrizes de Execução:**

1.  **Análise de Status:**
    *   Execute (ou analise) o `git status` para visualizar todas as pendências.
    *   Identifique arquivos que não devem ser comitados (arquivos de log, temporários, ou fora do escopo da tarefa atual).

2.  **Agrupamento Lógico (Atomicidade):**
    *   Separe as alterações em grupos lógicos e atômicos.
    *   Evite "mega-commits". Se possível, separe alterações de Backend (Domain, RPC, DB) de Frontend (UI), refatorações de novas features, e correções de bugs.

3.  **Padrão de Mensagem de Commit:**
    *   **Estrutura:** `<emoji> <prefixo>(<escopo opcional>): <corpo>`
    *   **Idioma:** Inglês (conforme `CONTRIBUTING.md`).
    *   **Regras:**
        *   O arquivo `CONTRIBUTING.md` define que commits devem ser escritos em **inglês**.
        *   Para *use cases* e *testes*, o corpo da mensagem não precisa começar por um verbo.

    *   **Exemplos:**
        *   `🐛 fix(server): ensure only one achievement is unlocked at once`
        *   `📑 interface: add AchievementsRepository`
        *   `✨ use case: list all challenges`
        *   `🧪 test: useChallengePage hook`

4.  **Tabela de Tipos de Commit (Obrigatório):**
    Utilize **exclusivamente** os prefixos e emojis definidos abaixo:

    | Tipo de commit | Prefixo | Emoji |
    | :--- | :--- | :--- |
    | Camada de domínio | `domain` | 🌐 |
    | Camada de API REST | `rest` | 📶 |
    | Camada de UI | `ui` | �️ |
    | Camada de banco de dados | `db` | � |
    | Camada de fila/mensageria | `queue` | 🎞️ |
    | Camada de provisão | `provision` | 🧰 |
    | Camada de API RPC | `rpc` | � |
    | Use cases | `use case` | ✨ |
    | Interfaces | `interface` | 📑 |
    | Tipagem | `type` | �️ |
    | Documentação | `docs` | 📚 |
    | Correção de bug | `fix` | 🐛 |
    | Refatoração de código | `refactor` | ♻️ |
    | Teste automatizado | `test` | 🧪 |
    | Configuração/infraestrutura | `config` | ⚙️ |
    | Constantes | `constants` | � |
    | Dependências | `deps` | 📦 |
    | Arquivos estáticos | `assets` | 🎴 |
    | Merge de branches | `merge` | 🔀 |
    | Reset de histórico | `revert` | ⏪ |
    | Executor/Interpretador | `cr` | ⏪ |
    | Estruturação pastas/arquivos | `ftree` | 🗃️ |
    | Certificados e licenças | `cert` | � |
    | Schema para validação | `validation` | 📮 |
    | Trabalho em andamento | `wip` | 🚧 |
    | Conserto de emergência | `hotfix` | 🚑 |
    | Entrega contínua | `cd` | � |
    | Integração contínua | `ci` | 🏎️ |
    | Nova release | `release` | 🔖 |
    | Containers Docker | `docker` | 🐳 |

5.  **Execução:**
    *   Adicione os arquivos para o grupo identificado: `git add <caminho/arquivo>`
    *   Realize o commit: `git commit -m "<mensagem padronizada>"`
