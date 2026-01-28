# Prompt: Fix Bug

**Objetivo Principal**
Ler o bug report, planejar a correção e implementar as mudanças necessárias para resolver o problema identificado, garantindo a qualidade do código.

**Entradas**
*   **Bug Report:** Documento detalhado descrevendo o problema, causas raízes e plano de correção sugerido.

**Diretrizes de Execução**

1.  **Análise e Planejamento**
    *   Revise cuidadosamente o Bug Report fornecido.
    *   Entenda o contexto do erro, os impactos técnicos e as decisões de design envolvidas.
    *   Elabore ou refine o plano de correção, assegurando conformidade com as diretrizes de arquitetura de cada camada (Core, UI, Drivers, REST).

2.  **Decomposição de Tarefas**
    *   Divida o plano de correção em micro-tarefas atômicas e gerenciáveis.
    *   Cada tarefa deve ter um escopo claro e resultar em um código compilável.

3.  **Implementação Iterativa**
    *   Execute a implementação de cada micro-tarefa sequencialmente.
    *   Siga rigorosamente as convenções de código e arquitetura do projeto.

4.  **Ciclo de Qualidade e Verificação (Por Tarefa)**
    *   Ao finalizar a codificação de *cada micro-tarefa*, execute os passos de validação **ANTES** de passar para a próxima:
        *   **Formatação e Lint:** Execute `npx biome check --apply .` para formatar e corrigir problemas automaticamente.
        *   **Análise Estática:** Execute `npx biome check .` para garantir que não há erros.
        *   **Testes:** Execute `npm run test -- <caminho>` (no diretório correto do monorepo) para validar.
    *   **Critério de Aceite:** Não avance com código que apresente erros de linter ou falhas de compilação.

5.  **Revisão Final**
    *   Verifique se a solução completa atende aos requisitos descritos no Bug Report.
    *   Confirme se não foram introduzidos novos efeitos colaterais.
