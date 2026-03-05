---
description: Prompt para concluir a correcao de bug com validacao, aderencia arquitetural e atualizacao do bug report.
---

# Prompt: Commit Bug Report

**Objetivo:**
Finalizar e consolidar a correção de um erro reportado, garantindo que o bug foi devidamente mitigado, que novos testes foram adicionados (se aplicável) e que a solução respeita a arquitetura do projeto.

**Entrada:**
*   **Bug Report:** O documento de report original
*   **Código Corrigido:** As alterações realizadas para sanar o problema.

**Diretrizes de Execução:**

1.  **Validação Final da Correção:**
    *   **Testes de Regressão:** Execute `npm run test` para validar que o bug foi sanado e que o sistema permanece estável.
    *   **Cenários de Erro:** Certifique-se de que foram adicionados testes unitários para o caso específico do bug, garantindo que ele não retorne (test-first approach para bugs).

2.  **Verificação de Padrões e Arquitetura:**
    *   **Respeito às Camadas:** Valide se a correção respeita as guidelines (`core-layer-guidelines.md`, `ui-layer-guidelines.md`, etc.) e se está na camada correta identificada no diagnóstico.

3.  **Atualização do Bug Report:**
    *   Atualize o estado do Bug Report ou adicione notas sobre a resolução final e mude o status para "concluido".
    *   Se a causa raiz identificada durante a implementação for diferente da inicial, documente essa descoberta.
