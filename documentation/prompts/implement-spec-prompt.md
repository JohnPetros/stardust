# Prompt: Implementar Spec

**Objetivo:**
Executar o plano de implementação técnica de forma iterativa, organizada e validada, garantindo qualidade e integração contínua.

**Entrada:**
*   Documento de Spec técnica aprovado/finalizado.

**Diretrizes de Execução:**

1.  **Validação de Diretrizes e Arquitetura:**
    Antes de iniciar a implementação, certifique-se de que compreende as diretrizes e a estrutura do projeto:
    *   **Índice de Diretrizes:** `documentation/guidelines/guidelines-rule.md` (Verifique aqui diretrizes específicas extras)
    *   **Arquitetura & Clean Architecture:** `documentation/architecture.md` (Fonte primária de verdade)
    *   **Padronização de Código:** `documentation/guidelines/code-conventions-guidelines.md`
    *   **Diretrizes por Camada:**
        *   **Core (Domínio):** `documentation/guidelines/core-package-guideines.md`
        *   **UI (Widgets & Design):** `documentation/guidelines/ui-layer-guidelines.md`
        *   **REST (Integrações HTTP):** `documentation/guidelines/rest-layer-guidelines.md`
        *   **RPC (Server Actions):** `documentation/guidelines/rpc-layer-guidelines.md`
        *   **Queue (Background Jobs):** `documentation/guidelines/queue-layer-guidelines.md`
        *   **Database (Persistência):** `documentation/guidelines/database-guidelines.md`
    *   **Padrões de Testes:** `documentation/guidelines/unit-tests-guidelines.md`

2.  **Decomposição Atômica:**
    *   Divida o plano macro em micro-tarefas atômicas.
    *   Cada tarefa deve resultar em um código compilável e funcional isoladamente.

3.  **Ordem de Execução (Bottom-Up):**
    Implemente as tarefas seguindo rigorosamente a hierarquia de dependências:
    1.  **Core:** DTOs, Entidades e Interfaces.
    2.  **Drivers/Infra:** Implementações de repositórios e gateways (ex: Supabase, Inngest).
    3.  **API Layers:** Implementações de Actions (RPC) ou Controllers (REST).
    4.  **Interface de Usuário:** Widgets e Páginas.
    *   **Regra:** Nunca implemente um componente consumidor (ex: Widget/Page) antes de implementar a lógica/dados que ele consome.

4.  **Ciclo de Qualidade e Verificação (Por Tarefa):**
    Ao finalizar a codificação de *cada micro-tarefa*, execute os passos de validação ANTES de passar para a próxima:
    *   **Formatação e Lint:** Execute `npm run codecheck` para garantir conformidade e formatação.
    *   **Typecheck:** Execute `npm run typecheck` para garantir que o código seja válido com relação a tipagem.
    *   **Testes:** Execute `npm run test` para validar a lógica implementada
    *   **Contexto de Monorepo:** O comando deve ser executado **dentro do diretório da aplicação ou pacote específico** (onde reside o `package.json`, ex: `apps/web` ou `packages/core`), e não na raiz do workspace.
    *   **Critério de Aceite:** Corrija imediatamente quaisquer erros do linter ou testes falhando. Não avance com código "quebrado".

5.  **Uso de Ferramentas Auxiliares:**
    *  **MCP Context7:** Caso tenha dúvidas sobre como usar uma biblioteca específica (ex: `shadcn/ui`, `radix-ui`, `inngest`, `supabase`), utilize o MCP do Context7 para obter documentação e exemplos de uso.
    *  **MCP Serena**: Quando não souber onde exatamente está um arquivo ou pasta, utilize o MCP do Serena para facilitar sua busca pelo projeto.

6.  **Planejamento e Tarefas:**
    *   Caso tenha sido realizado o planejamento e a definição de tarefas prévias, leve-as em consideração durante a implementação.

7.  **Consistência de Padrões:**
    *   **Camada UI:**
        *   Todo widget deve seguir a estrutura de Widget: `Index` (.tsx), `View` (.tsx) e `Hook` (.ts).
        *   Evite lógica de negócio na View.
        *   Prefira dividir o widget em widgets menores para melhorar a reutilização e a manutenção do código.
        *   Se precisar criar um widget interno, siga a estrutura de Widget: `Index` (.tsx), `View` (.tsx) e `Hook` (.ts) também
        *   Funções dentro de hooks devem usar a notação function em vez de arrow functions, exceto em casos específicos como useCallback.
        *   **Importante:** Utilize `Tailwind CSS` e primitivos do `Radix UI` (ou componentes `shadcn` existentes), evitando estilos inline ou bibliotecas não aprovadas como Material UI.
