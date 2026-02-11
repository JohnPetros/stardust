# Fix Side Effect Skill

**Objetivo:**
Identificar e corrigir regressões ou erros de compilação (efeitos colaterais) resultantes de alterações manuais no código-fonte. O foco é restabelecer a integridade do projeto, atualizando dependências e validando testes.

**Entrada:**
*   Caminho do arquivo ou diretório onde ocorreram as edições manuais.

**Diretrizes de Execução:**

1.  **Diagnóstico Estático:**
    *   Utilize `npm run codecheck` para varrer o projeto em busca de erros de linting ou compilação gerados pela alteração.
    *   Priorize a correção de erros de sintaxe e contratos de interface quebrados.

2.  **Correção de Dependências:**
    *   Atualize todos os arquivos que dependem do código modificado (imports, chamadas de função, instâncias de classe).
    *   **Responsabilidade:** Cabe ao agente garantir que a refatoração se propague corretamente por toda a base de código.

3.  **Validação de Testes:**
    *   **Verificação:** Caso a alteração tenha impactado a lógica de negócios ou a estrutura de classes, os testes correspondentes **devem** ser atualizados.
    *   **Execução:** Utilize `npm run test -- <caminho>` (no diretório correto do monorepo) para rodar os testes afetados.
    *   **Critério de Sucesso:** A tarefa só está concluída quando não houver erros de análise estática e os testes estiverem passando (verde).

4.  **Sincronização de Documentação (Spec e PRD):**
    *   **Verificação:** Verifique se as alterações no código divergem do que está documentado no **PRD** ou nos **Specs** da feature correspondente (localizados em `documentation/features/`).
    *   **Atualização:** Caso o comportamento do sistema tenha mudado em relação às definições originais, atualize os documentos relevantes para garantir que a documentação reflita com precisão o estado atual do projeto.

  