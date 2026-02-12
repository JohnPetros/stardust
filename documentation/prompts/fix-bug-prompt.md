# Prompt: Fix Bug

**Objetivo Principal**
Ler o bug report, planejar a correção e implementar as mudanças necessárias para resolver o problema identificado, garantindo a qualidade do código.

**Entradas**
*   **Bug Report:** Documento detalhado descrevendo o problema, causas raízes e plano de correção sugerido.

**Diretrizes de Execução**

1.  **Análise e Planejamento**
    *   Revise cuidadosamente o Bug Report fornecido.
    *   Entenda o contexto do erro, os impactos técnicos e as decisões de design envolvidas.
    *   Elabore ou refine o plano de correção, assegurando conformidade com as diretrizes de arquitetura de cada camada (Core, UI, Banco de Dados, REST).

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

    A revisão final é a etapa crítica que garante a qualidade e integridade da solução antes da entrega. Deve ser realizada **somente após** a conclusão de todas as micro-tarefas.

    ##### 5.1 Checklist de Validação

    Execute as verificações abaixo para assegurar que o bug foi corrigido corretamente:

    | # | Verificação | Critério de Aceite |
    |---|-------------|-------------------|
    | 1 | **Completude** | Todos os requisitos do Bug Report foram implementados? |
    | 2 | **Funcionalidade** | O bug original não ocorre mais nos cenários de teste? |
    | 3 | **Regressão** | Testes existentes continuam passando (sem quebras)? |
    | 4 | **Efeitos Colaterais** | Nenhum comportamento inesperado foi introduzido? |
    | 5 | **Código** | Formatação, lint e análise estática estão aprovadas? |

    ##### 5.2 Procedimento de Validação

    1. **Leitura Recontextualizada**
       *   Releia o Bug Report na íntegra para garantir que nenhum requisito foi omitido.

    2. **Execução de Testes de Aceitação**
       *   Execute o teste que reproduzia o bug original.
       *   Confirme que o teste agora passa (comportamento esperado).

    3. **Análise de Impacto**
       *   Revise os arquivos modificados além da área direta do bug.
       *   Identifique possíveis dependências quebradas ou comportamentos alterados.

    4. **Execução da Suite Completa**
       *   Execute todos os testes do módulo afetado: `npm run test -- <caminho-do-modulo>`

    > ⚠️ **IMPORTANTE:** Se qualquer item do checklist falhar, retorne à fase de **Implementação Iterativa** e corrija antes de prosseguir.
