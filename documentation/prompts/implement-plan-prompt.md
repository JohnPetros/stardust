---
description: Implementar um plano de implementacao derivado de uma spec tecnica.
---

# Prompt: Implementar Plano

**Objetivo principal** Implementar no codebase um plano de implementacao derivado de uma spec tecnica, seguindo a arquitetura e diretrizes do Equiny Mobile.

## Entrada

- Caminho do arquivo do plano (Markdown) **ou**, se nao houver plano, caminho da spec tecnica (Markdown).

## Diretrizes de execucao

1. **Pre-check (obrigatorio)**
   - Leia o plano e identifique: escopo, fluxo principal, criterios de aceite, riscos e pendencias.
   - Se o documento estiver incompleto, nao invente: crie uma lista `Pendencias` e avance com defaults seguros.

2. **Consultar regras/arquitetura (obrigatorio)**
   - Antes de implementar uma camada, se necessario, consulte as regras correspondentes em `documentation/rules/`.
   - Preserve padroes existentes (nomenclatura, organizacao de pastas, providers, presenters).

4. **Ciclo de implementacao por tarefa**
   - Para cada tarefa do plano:
     - Localize codigo existente semelhante antes de criar algo novo.
     - Implemente a mudanca minima que entrega valor observavel.
     - Evite acoplamento entre camadas e chamadas de API na UI.

5. **Verificacao (obrigatorio) para cada fase**
   - Garanta que o projeto compila e que fluxos impactados funcionam.
   - Rode checks existentes (ex.: analyzers/tests) quando aplicavel e corrija falhas antes de seguir.

6. **Progresso e reporte**
   - atualize o checklist de tarefas implementadas.
   - Ao final, reporte: o que foi implementado, arquivos principais tocados, pendencias e proximos passos.

## Saida esperada

- Implementacao completa (ou parcial, se bloqueada) do plano/spec no codebase.
- Lista objetiva de tarefas concluida x pendente, com justificativa para bloqueios.
- Referencias a paths reais de arquivos alterados/criados.
