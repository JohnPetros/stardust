# Prompt: Commit Spec

**Objetivo:**
Finalizar e consolidar a implementação de uma Spec técnica, garantindo que o código esteja polido, documentado, validado e pronto para a criação de um Pull Request.

**Entrada:**
*   **Spec Técnica:** O documento que guiou a implementação (`documentation/features/.../specs/...`).
*   **Código Implementado:** As alterações realizadas nas camadas UI, Core, Rest e Drivers.

**Diretrizes de Execução:**

1.  **Validação de Qualidade Final:**
    *   **Análise Estática:** Execute `npx biome check .` em todo o projeto para garantir que não existam warnings ou erros remanescentes.
    *   **Testes Unitários:** Execute `npm run test -- <caminho>` para validar que todos os testes (novos e existentes) estão passando.
    *   **Formatação:** Garanta que todos os arquivos seguem o padrão com `npx biome check --apply .`.

2.  **Verificação de Requisitos:**
    *   Compare o código final com cada seção da Spec (O que deve ser criado/modificado).
    *   Certifique-se de que todos os componentes descritos foram implementados conforme planejado.

3. **Atualização da Documentação e Visualização:**
    *   Refine o documento da Spec original para refletir decisões de design de última hora ou mudanças de caminho.
    *   **Diagramas ASCII:** Avalie se as mudanças implementadas alteraram fluxos complexos ou a navegação.
        *   **Ação:** Gere ou atualize um diagrama ASCII (fluxo de dados ou sequência) para facilitar a visualização da implementação final.
        *   Utilize a notação `ASCII` dentro de blocos de código específicos.

4.  **Preparação para o Commit:**
    *   Agrupe as mudanças logicamente de acordo com as camadas afetadas.
    *   Prepare mensagens de commit seguindo as [diretrizes de desenvolvimento](documentation/developement-guidelines.md) (e.g., `✨ ui: implementar listagem de pedidos`).

5.  **Geração de Resumo Final:**
    *   Forneça um resumo técnico do que foi concluído para facilitar a criação do PR subsequente.
