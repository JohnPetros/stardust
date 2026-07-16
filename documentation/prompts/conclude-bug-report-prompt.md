---
description: Prompt para concluir a correcao de bug com validacao, aderencia arquitetural e atualizacao do bug report.
---

# Prompt: Concluir Bug Report

**Objetivo:**
Finalizar e consolidar a correção de um erro reportado, garantindo que o bug foi devidamente mitigado, que novos testes foram adicionados (se aplicável) e que a solução respeita a arquitetura do projeto.

**Entrada:**
*   **Bug Report:** O documento de report original
*   **Código Corrigido:** As alterações realizadas para sanar o problema.

**Regras Aplicáveis:**

- Leia `documentation/rules/rules.md` para identificar as rules das camadas afetadas pela correção.
- Leia `documentation/rules/code-conventions-rules.md` antes de validar nomenclatura, factories, erros, eventos ou organização geral.
- Leia as rules de teste correspondentes quando a correção exigir ou alterar cobertura:
    - `documentation/rules/domain-objects-testing-rules.md`
    - `documentation/rules/use-cases-testing-rules.md`
    - `documentation/rules/handlers-testing-rules.md`
    - `documentation/rules/server-routes-testing-rules.md`
    - `documentation/rules/web-app-routes-testing-rules.md`
    - `documentation/rules/widget-tests-rules.md`

**Diretrizes de Execução:**

1.  **Validação Final da Correção:**
    *   **Testes de Regressão:** Execute `npm run test` para validar que o bug foi sanado e que o sistema permanece estável.
    *   **Cenários de Erro:** Certifique-se de que foram adicionados testes unitários para o caso específico do bug, garantindo que ele não retorne (test-first approach para bugs).

2.  **Verificação de Padrões e Arquitetura:**
    *   **Respeito às Camadas:** Valide se a correção respeita `documentation/architecture.md` e as rules específicas das camadas identificadas no diagnóstico.

3.  **Atualização do Bug Report:**
    *   Atualize o estado do Bug Report ou adicione notas sobre a resolução final e mude o status para "closed".
    *   Se a causa raiz identificada durante a implementação for diferente da inicial, documente essa descoberta.
