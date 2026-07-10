---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias

- [ ] Alinhar a expectativa sobre testes automatizados: a spec marca "Implementar testes automatizados nesta spec" como out-of-scope, mas o fluxo de `create-plan` exige tarefas de teste dedicadas para todo artefato testavel. Impacto: sem esse alinhamento, a implementacao pode omitir a rede minima de seguranca esperada pelo processo. Acao necessaria: confirmar se os testes previstos neste plano devem entrar no mesmo ciclo de implementacao ou se a spec sera ajustada formalmente.
- [ ] Registrar milestone/PRD de origem, se a entrega precisar seguir rastreabilidade completa de produto. Impacto: nao bloqueia a implementacao tecnica, mas reduz a rastreabilidade entre demanda de produto e execucao. Acao necessaria: vincular a issue `#451` a uma milestone/PRD, se esse acoplamento for obrigatorio para governanca da feature.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir o contrato de backup no `core`, cobrindo lote de upload e a orquestracao do use case de backup dos arquivos do storage. | - | - |
| F2 | Adaptar providers e job recorrente do `server` para executar o backup em Dropbox com observabilidade via Inngest. | F1 | - |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Nesta entrega a spec toca apenas `core` e `server`, entao nao ha fases independentes de `web` ou `studio` para paralelizar apos F1.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio para backup de arquivos do storage, sem depender de detalhes de infraestrutura. Essa fase consolida o contrato de upload em lote e o fluxo de backup por pasta/destino no `core`, deixando o `server` livre para apenas adaptar providers e agendamento.

### Tarefas

- [x] **T1.1** — Atualizar `FileStorageProvider` com `uploadMany(folder: FileStorageFolderPath, files: File[]): Promise<File[]>`
  - **Depende de:** -
  - **Resultado observavel:** o contrato publico de storage do `core` passa a expor upload em lote, permitindo que use cases e jobs consumam um metodo unico para backup de multiplos arquivos sem duplicar estrategia por provider.
  - **Camada:** `core`

- [x] **T1.2** — Implementar `BackupStorageFilesUseCase` em `packages/core/src/storage/use-cases/BackupStorageFilesUseCase.ts`
  - **Depende de:** T1.1
  - **Resultado observavel:** o use case percorre a allowlist de pastas da spec, pagina a listagem no provider de origem ate esgotar os itens, envia cada lote aos destinos via `uploadMany(...)`, isola falhas por pasta/destino e conclui com erro agregado quando houver falhas recuperaveis acumuladas.
  - **Camada:** `core`

- [x] **T1.2t** — Testar `BackupStorageFilesUseCase`
  - **Depende de:** T1.2
  - **Resultado observavel:** testes de `BackupStorageFilesUseCase` passando, cobrindo listagem paginada ate esgotar arquivos, envio dos lotes para multiplos destinos, continuidade quando um destino falha, continuidade quando uma pasta falha e erro final resumindo falhas acumuladas sem interromper o processamento restante.
  - **Camada:** `core`
  - **Rules:** `documentation/rules/use-cases-testing-rules.md`

- [x] **T1.3** — Exportar `BackupStorageFilesUseCase` no barrel `packages/core/src/storage/use-cases/index.ts`
  - **Depende de:** T1.2
  - **Resultado observavel:** o novo use case fica disponivel pelo barrel publico do modulo `storage`, permitindo importacao consistente pelo `server`.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios e Handlers

**Objetivo:** Implementar a infraestrutura e o agendamento do backup recorrente no `server`, consumindo os contratos definidos no `core`. Providers e configuracao ficam na camada de `provision`, enquanto o job e sua composicao ficam na camada de `queue`.

### Tarefas

- [x] **T2.1** — Implementar `uploadMany(...)` em `SupabaseFileStorageProvider`
  - **Depende de:** T1.1
  - **Resultado observavel:** o provider de origem do Supabase passa a cumprir integralmente o contrato `FileStorageProvider`, enviando multiplos arquivos por lote ao reutilizar `upload(...)` e retornando os arquivos efetivamente processados.
  - **Camada:** `provision`

- [x] **T2.2** — Implementar `uploadMany(...)` e ajustar o path remoto em `DropboxStorageProvider`
  - **Depende de:** T1.1
  - **Resultado observavel:** o provider do Dropbox envia lotes para `<ambiente>/file-storage-backups/<data>/<folder.value>/<file.name>`, preservando ambiente, data, pasta logica e nome para rastreabilidade externa sem misturar arquivos com `<ambiente>/database-backups`.
  - **Camada:** `provision`

- [x] **T2.6** — Implementar `BackupStorageFilesJob` em `apps/server/src/queue/jobs/storage/BackupStorageFilesJob.ts`
  - **Depende de:** T1.3, T2.1, T2.2
  - **Resultado observavel:** o job expõe `KEY` e `CRON_EXPRESSION` estaveis e executa `BackupStorageFilesUseCase` dentro de `amqp.run(...)`, mantendo rastreabilidade e retries por etapa no runtime do Inngest.
  - **Camada:** `queue`

- [x] **T2.6t** — Testar `BackupStorageFilesJob`
  - **Depende de:** T2.6
  - **Resultado observavel:** testes de `BackupStorageFilesJob` passando, cobrindo execucao do use case dentro de `amqp.run(...)`, uso da chave estavel da etapa e propagacao de falhas do use case para o handler do job.
  - **Camada:** `queue`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.7** — Exportar `BackupStorageFilesJob` no barrel `apps/server/src/queue/jobs/storage/index.ts`
  - **Depende de:** T2.6
  - **Resultado observavel:** o novo job fica disponivel pelo barrel de `storage`, mantendo o padrao de importacao usado pela composition root de fila.
  - **Camada:** `queue`

- [x] **T2.8** — Registrar `BackupStorageFilesJob` em `StorageFunctions`
  - **Depende de:** T2.2, T2.7
  - **Resultado observavel:** `StorageFunctions` passa a instanciar `SupabaseFileStorageProvider`, `DropboxStorageProvider`, `InngestAmqp` e a incluir a nova funcao cron no array de `getFunctions(...)`.
  - **Camada:** `queue`
