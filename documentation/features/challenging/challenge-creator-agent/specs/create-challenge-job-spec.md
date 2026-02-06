---
title: Job de Criação de Desafio
application: web
status: em progresso
last_updated: 03/02/2026
---

# Objetivo

Implementar um Job de criação de desafio que será executado diariamente para gerar um novo desafio. O job utiliza o workflow de criação de desafio para gerar o desafio da camada `ai`

O que já existe?

- apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts
- apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts
- apps/server/src/ai/mastra/teams/ChallengingTeam.ts
- apps/server/src/queue/inngest/functions/NotificationFunctions.ts

O que precisa ser criado?

job SendNotificationJob

O que precisa ser modificado?

- apps/server/src/queue/inngest/functions/NotificationFunctions.ts


