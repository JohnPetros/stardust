---
name: implement-plan
description: Alias legado que encaminha um Plan SDD para a estratégia Plan-backed do único workflow implement-spec.
---

# Implementar Plan — compatibilidade

Não mantenha um workflow de implementação paralelo. Leia `plan.md` e invoque imediatamente
`implement-spec`; ele detecta o Plan da revisão atual, ativa Builders de ownership por wave,
mantém Plan/Evaluation e executa o Implementation Reviewer.

Se o Plan estiver obsoleto ou a Spec não estiver `open`/`in_progress`, deixe `implement-spec`
reconciliar o estado antes de qualquer edição. Novos documentos e handoffs devem referenciar
somente `implement-spec`.
