---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

- [ ] Confirmar se havera CTA de cancelamento em lote visivel no header (a spec pede handler e contrato, mas o layout detalha apenas CTA de geracao em lote).

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir contratos compartilhados de audio/vozes no core | - | - |
| F2 | Expor endpoint de vozes e ajustar validacao REST no server | F1 | F4 |
| F4 | Integrar UI e fluxo de audio no studio | F1 | F2 |

> **Estratégia de paralelismo:** sempre comece pelo core (domínio, structures e use cases). Assim que o core estiver concluído, as fases de `server` e `studio` podem ser executadas em paralelo, pois ambas dependem apenas do contrato definido no core.

---

## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Definir o contrato compartilhado de audio e vozes no core — DTOs e interface REST consumida pelos adapters — sem depender de infraestrutura. Essa fase desbloqueia F2 e F4 para rodarem em paralelo.

### Tarefas

- [x] **F1-T1** — Criar `AudioVoiceDto`
  - **Depende de:** -
  - **Resultado observavel:** existe `packages/core/src/lesson/domain/structures/dtos/AudioVoiceDto.ts` com `value: AudioVoiceValue` e `label: string`.
  - **Camada:** `core`

- [x] **F1-T2** — Exportar `AudioVoiceDto` no barrel do modulo
  - **Depende de:** F1-T1
  - **Resultado observavel:** `packages/core/src/lesson/domain/structures/dtos/index.ts` expoe `AudioVoiceDto`.
  - **Camada:** `core`

- [x] **F1-T3** — Estender `LessonService` compartilhado com metodos de audio
  - **Depende de:** F1-T2
  - **Resultado observavel:** `packages/core/src/lesson/interfaces/LessonService.ts` passa a expor `fetchAudioVoices`, geracao/cancelamento individual e em lote.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositórios e Handlers

> ⚡ Pode rodar em paralelo com F4 após F1 estar concluída.

**Objetivo:** Implementar a borda REST do `server` para vozes e preservacao do subdocumento `audio` na validacao de update de blocos.

### Tarefas

- [x] **F2-T1** — Criar `textBlockAudioSchema`
  - **Depende de:** F1-T3
  - **Resultado observavel:** existe `packages/validation/src/modules/lesson/schemas/textBlockAudioSchema.ts` validando `fileName`, `voice` e `status`.
  - **Camada:** `rest`

- [x] **F2-T2** — Permitir `audio` em `textBlockSchema`
  - **Depende de:** F2-T1
  - **Resultado observavel:** `packages/validation/src/modules/lesson/schemas/textBlockSchema.ts` aceita `audio` opcional.
  - **Camada:** `rest`

- [x] **F2-T3** — Exportar `textBlockAudioSchema` no barrel de schemas
  - **Depende de:** F2-T1
  - **Resultado observavel:** `packages/validation/src/modules/lesson/schemas/index.ts` expoe `textBlockAudioSchema`.
  - **Camada:** `rest`

- [x] **F2-T4** — Criar `FetchAudioVoicesController`
  - **Depende de:** F1-T2
  - **Resultado observavel:** existe controller que responde `200` com as vozes `panda/shark/princess` e labels PT-BR.
  - **Camada:** `rest`

- [x] **F2-T5** — Exportar controller de vozes no barrel de controllers
  - **Depende de:** F2-T4
  - **Resultado observavel:** `apps/server/src/rest/controllers/lesson/index.ts` expoe `FetchAudioVoicesController`.
  - **Camada:** `rest`

- [x] **F2-T6** — Criar `AudioVoicesRouter` com `GET /lesson/audio-voices`
  - **Depende de:** F2-T4
  - **Resultado observavel:** existe router publico sem auth para a rota de vozes.
  - **Camada:** `rest`

- [x] **F2-T7** — Registrar `AudioVoicesRouter` no `LessonRouter`
  - **Depende de:** F2-T6
  - **Resultado observavel:** `GET /lesson/audio-voices` fica acessivel no modulo `lesson`.
  - **Camada:** `rest`

---

## F4 — Studio: UI e Integração

> ⚡ Pode rodar em paralelo com F2 após F1 estar concluída.

**Objetivo:** Implementar no `studio` o fluxo de voz/geracao/polling/cancelamento por bloco e player compacto, preservando `audio` no ciclo de edicao.

### Tarefas

- [x] **F4-T1** — Estender `LessonService` REST do studio com metodos de audio
  - **Depende de:** F1-T3
  - **Resultado observavel:** `apps/studio/src/rest/services/LessonService.ts` implementa `fetchAudioVoices`, gerar/cancelar individual e em lote.
  - **Camada:** `rest`

- [x] **F4-T2** — Criar hook `useStorageAudio`
  - **Depende de:** F1-T3
  - **Resultado observavel:** existe `apps/studio/src/ui/global/hooks/useStorageAudio.ts` retornando URL publica de `audios/story` ou `null`.
  - **Camada:** `ui`

- [x] **F4-T3** — Criar hook `useAudioGenerationPolling`
  - **Depende de:** F4-T1
  - **Resultado observavel:** existe polling a cada 3000ms enquanto houver bloco `pending`, com callback de update e erro.
  - **Camada:** `ui`

- [x] **F4-T4** — Criar widget `BlockVoiceSelector`
  - **Depende de:** F1-T2
  - **Resultado observavel:** seletor de voz com fallback `panda` quando lista vazia.
  - **Camada:** `ui`

- [x] **F4-T5** — Criar widget `BlockAudioPlayer` e hook `useBlockAudioPlayer`
  - **Depende de:** F4-T2
  - **Resultado observavel:** player compacto com play/pause, seek e progresso.
  - **Camada:** `ui`

- [x] **F4-T6** — Criar widget `BlockAudioControls`
  - **Depende de:** F4-T4, F4-T5
  - **Resultado observavel:** composicao de seletor, botao gerar/regenerar, cancelar, badge/spinner e player por status.
  - **Camada:** `ui`

- [x] **F4-T7** — Preservar `audio` no hook `useLessonStoryPage`
  - **Depende de:** F4-T1
  - **Resultado observavel:** `toEditorItem` e `toPersistedTextBlock` mantem `audio` sem perda no save.
  - **Camada:** `ui`

- [x] **F4-T8** — Integrar voz/geracao/cancelamento/polling em `useLessonStoryPage`
  - **Depende de:** F4-T3, F4-T7
  - **Resultado observavel:** handlers de voz/geracao/cancelamento funcionam, sincronizam alteracoes locais antes de chamar endpoints por `blockIndex`.
  - **Camada:** `ui`

- [x] **F4-T9** — Integrar controles de audio em `TextBlockCard`
  - **Depende de:** F4-T6, F4-T8
  - **Resultado observavel:** card renderiza `BlockAudioControls` para tipos elegiveis no estado expandido.
  - **Camada:** `ui`

- [x] **F4-T10** — Integrar controle em lote/polling no `TextBlocksView` e `LessonStoryPageView`
  - **Depende de:** F4-T8, F4-T9
  - **Resultado observavel:** header exibe CTA de geracao em lote, indicador de polling e mantem drag-and-drop ativo durante `pending`.
  - **Camada:** `ui`
