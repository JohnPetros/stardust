
---
description: Prompt para encontrar issues de performance em uma base de codigo e propor correcoes priorizadas.
---

# Prompt: Encontrar Issues de Performance

**Objetivo:**
- Dada uma base de codigo e um contexto de uso, identificar gargalos e riscos de performance (frontend, backend, build, banco, integracoes) com evidencias, impacto esperado e um plano de correcoes priorizado.
- Entregar um diagnostico acionavel: o que esta lento, por que provavelmente esta lento, onde no codigo isso ocorre, e como validar a melhora.

**Entrada:**

- **Tarefa/tema principal (obrigatorio):** `{TAREFA}`
  - Ex: "encontrar issues de performance no fluxo de login", "reduzir TTFB do dashboard", "otimizar pagina X", "reduzir uso de memoria no job Y".
- **Alvo e escopo (obrigatorio):** `{ALVO}`
  - Caminhos/pacotes/apps para inspecionar, rotas, features, ou "repo inteiro".
- **Contexto do produto e do problema (obrigatorio):** `{CONTEXTO}`
  - Fluxo(s) afetado(s), ambiente (dev/stage/prod), usuarios, volumetria, e sintomas.
- **Sinais e metricas observadas (opcional, mas recomendado):** `{SINAIS}`
  - Ex: tempos (p95/p99), TTFB/LCP/INP, CPU/memoria, erros, logs, traces, flamegraphs, bundle size.
- **Stack e constraints (opcional):** `{STACK}`
  - Frameworks, runtime, DB, filas, cache, provedores, limites (SLA, custo, compatibilidade).
- **Restricoes e preferencias (obrigatorio):** `{RESTRICOES}`
  - Ex: "nao alterar schema", "sem mudar comportamento", "nao adicionar dependencia", "usar Markdown", "sem otimizar prematuramente".
- **Fontes disponiveis (obrigatorio):** `{FONTES}`
  - PRDs/specs, guidelines internas, links, observability, tickets, e acesso ao codebase.

Formato esperado para `{FONTES}`:
- Links (bullets) e/ou caminhos de arquivo.
- Trechos relevantes (copiados/colados) se voce nao tiver acesso ao repositorio.

**Diretrizes de Execucao:**

1. **Entendimento e validacao de entradas**
   - Reescreva `{TAREFA}` em uma frase objetiva e defina o tipo de performance em foco (ex: runtime frontend, API, DB, build, job, cold start).
   - Defina criterios de sucesso mensuraveis (mesmo que por hipotese), e anote restricoes criticas de `{RESTRICOES}`.
   - Se algo essencial estiver faltando (ex: qual rota/fluxo ou qual sintoma), registre em "Pendencias" e siga com defaults seguros (explicitos).

2. **Levantamento do que ja existe (antes de inspecionar codigo)**
   - Leia primeiro as regras/arquitetura/guidelines relevantes em `{FONTES}`.
   - Procure por implementacoes similares (features parecidas, endpoints equivalentes, paginas com mesmo padrao) para comparar abordagens.
   - Identifique onde o sistema deveria medir performance (logs/metrics/traces) e se ja existe instrumentacao.

3. **Investigacao no codebase (coletar evidencias, nao apenas palpites)**
   - Mapeie o caminho do request/acao do usuario:
     - Entrada (UI/rota) -> chamada (RPC/REST) -> dominio/servico -> repositorio/DB -> retorno -> renderizacao.
   - Encontre hotspots por sinais e por padroes comuns, por exemplo:
     - **Frontend:** re-render excessivo, estado global mal particionado, listas sem virtualizacao, calculos pesados em render, imagens/JS grandes, requests duplicadas, waterfall, uso incorreto de suspense/caching.
     - **Backend/API:** N+1, consultas sem indice/sem filtro, serializacao pesada, loops sincronos, falta de paginacao, uso indevido de cache, concorrencia baixa.
     - **DB:** consultas com join pesado, falta de indice, scans, paginacao incorreta, transacoes longas.
     - **Jobs/filas:** processamento em lote sem chunking, retries explosivos, concorrencia/limites, memoria crescente.
     - **Build/bundle:** dependencias grandes, imports indevidos, code splitting ausente, configuracao de bundler.
   - Para cada suspeita, anote pelo menos uma evidencia verificavel:
     - Caminho(s) de arquivo e simbolos; trecho minimo do codigo; ou comando/saida de profiling; ou metrica/log.
   - Diferencie claramente:
     - **Fato observado** (evidencia)
     - **Hipotese** (causa provavel)
     - **Experimento** (como confirmar)

4. **Geracao da saida final (priorizada e acionavel)**
   - Agrupe issues por area (frontend, api, db, infra, build) e priorize por:
     - Impacto no usuario/custo
     - Probabilidade
     - Esforco
     - Risco de regressao
   - Para cada issue, proponha uma correcao:
     - "Quick win" (baixo risco/esforco)
     - "Solucao robusta" (se houver)
   - Inclua como validar (metricas antes/depois, roteiro de reproducao, comandos).

**Uso de Ferramentas Auxiliares (se disponiveis):**

- **Busca no repositorio:** use ferramentas de busca (ex: glob/grep/Serena) para localizar hotspots, implementacoes similares, e referencias.
- **Leitura de arquivos:** leia somente os arquivos necessarios para sustentar as evidencias.
- **Documentacao oficial:** se houver duvida sobre comportamento de biblioteca/framework, consulte docs oficiais (ex: via Context7) e cite o que muda na recomendacao.
- **Modo sem ferramentas:** se voce nao tiver acesso ao repositorio, solicite ao usuario:
  - Estrutura de pastas (tree), arquivos alvo, e trechos das rotas/componentes/queries relevantes;
  - Logs/metricas (p95/p99, LCP/INP, TTFB) e passos para reproducao.

**Template de Saida (Estrutura Obrigatoria):**

# Escopo
- `{TAREFA}`
- `{ALVO}`
- Criterios de sucesso: `{CRITERIOS_DE_SUCESSO}`
- Restricoes: `{RESTRICOES}`

# Assuncoes e Pendencias
- Assuncoes adotadas (defaults) e por que sao seguras
- Pendencias para fechar diagnostico (perguntas objetivas)

# Mapa do Fluxo (onde o tempo pode estar indo)
- Fluxo resumido do usuario/request (entrada -> camadas -> saida)
- Pontos de I/O (rede, DB, filas) e pontos de CPU (parse, serializacao, render)

# Evidencias Coletadas
- Metricas/sinais observados (com fonte)
- Referencias no codigo (caminhos de arquivo e simbolos) com trechos minimos

# Issues de Performance (Prioridade)
Para cada item, preencher os campos:
- **ID:** `{ISSUE_ID}`
- **Area:** `{AREA}` (frontend/api/db/infra/build/outro)
- **Sintoma:** `{SINTOMA}`
- **Causa provavel:** `{CAUSA}`
- **Evidencia:** `{EVIDENCIA}` (arquivo/linha, metrica, log, output)
- **Impacto:** `{IMPACTO}` (usuario/custo/SLA)
- **Risco:** `{RISCO}` (baixo/medio/alto) + regressao possivel
- **Correcao (quick win):** `{FIX_QUICK}`
- **Correcao (robusta):** `{FIX_ROBUSTA}` (opcional)
- **Como validar:** `{VALIDACAO}` (metricas, passos, comandos)
- **Estimativa:** `{ESFORCO}` (S/M/L) e dependencias

# Recomendacoes (Plano em Etapas)
- Etapa 1: quick wins + instrumentacao minima
- Etapa 2: correcoes estruturais
- Etapa 3: hardening (limites, caching, guardrails)

# Instrumentacao e Medicao
- O que medir (KPIs) e onde instrumentar
- Como coletar (logs/metrics/traces/profiler)
- Baseline e criterio de comparacao (antes/depois)

# Checklist de Verificacao
- Nao mudou comportamento funcional
- Nao degradou acessibilidade/SEO (se aplicavel)
- Nao aumentou bundle/build time sem justificativa
- Validacao em ambientes relevantes (dev/stage/prod)

# Referencias
- `{FONTES}` (links, arquivos, tickets)

**Regras:**
- Nao invente caminhos de arquivo, APIs, nomes de modulos ou metricas; se nao encontrar, marque como pendencia.
- Nao exponha raciocinio passo a passo; mantenha o pensamento detalhado interno e apresente somente conclusoes, evidencias e acoes.
- Sempre separe fato vs hipotese vs experimento.
- Seja especifico: cite arquivos/simbolos/comandos e descreva como reproduzir/medir.
- Nao proponha "otimizacoes" sem um sintoma/risco claro ou uma medicao alvo.
- Respeite `{RESTRICOES}`; se uma recomendacao violar, ofereca alternativa compativel.
