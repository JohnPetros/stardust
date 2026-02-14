---
description: Prompt para revisar codigo com foco em conformidade com spec, padroes do projeto e qualidade tecnica.
---

# Prompt: Revisar código

**Objetivo:** Realizar uma revisão técnica rigorosa da base de código para
assegurar conformidade com os padrões do projeto, identificar bugs latentes e
garantir a qualidade através de ferramentas de lint e formatação.

**Entrada:**

- **Contexto:** Spec que acabou de ser implementada (opcional).
- **Alvo:** Todo o projeto ou caminhos específicos fornecidos.

**Diretrizes de Execução:**

1. **Verificação de Spec e Lógica:**
   - **Conformidade:** Verifique se a spec foi implementada corretamente,
     respeitando todos os requisitos definidos.
   - **Escaneamento Manual:** Procure por erros de digitação, erros de lógica,
     problemas de nomenclatura e erros de sintaxe óbvios.

2. **Análise de Qualidade Estática:**
   - **Diagnóstico:** Execute `npm run codecheck` para identificar problemas de
     formatação e lint e depois `npm run typecheck` para verificar tipagem e
     corrigir erros de tipo.
   - **Priorização:** Examine a severidade dos problemas reportados, priorizando
     erros que impeçam o build.

3. **Refatoração e Alinhamento com Protocolos:**
   - **Manual:** Corrija manualmente os problemas persistentes do codecheck não
     pôde resolver.
   - **Diretrizes:** Siga rigorosamente os padrões de projeto conforme
     documentado em:
   - **Convenções de codificação:**
     [code-conventions-guidelines.md](../guidelines/code-conventions-guidelines.md)
     - **Arquitetura:** [architecture.md](../architecture.md)
     - **Core:**
       [core-package-guideines.md](../guidelines/core-package-guideines.md)
     - **REST:**
       [rest-layer-guidelines.md](../guidelines/rest-layer-guidelines.md)
     - **UI:** [ui-later-guidelines.md](../guidelines/ui-later-guidelines.md) e
       [web-application-guidelines.md](../guidelines/web-application-guidelines.md)
     - **Testes:**
       [unit-tests-guidelines.md](../guidelines/unit-tests-guidelines.md)
   - **Padrões:** Garanta o uso correto do **Widget Pattern** (View/Index/Hook),
     **Zudtand** para estado global e **Inngest** para filas.

4. **Validação Final:**
   - **Testes:** Execute `npm run test` para validar que as alterações não
     impactaram o comportamento funcional. Lembre-se de executar no diretório
     correto do monorepo.

**Critério de Sucesso:** A revisão é considerada concluída quando o Biome não
retornar erros e todos os testes automatizados relevantes passarem.
