---
title: Trilha da galáxia com progresso por fatos, abertura de planetas e staging automatizado
status: in_progress
revision: 11
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/613
  - type: prd
    ref: documentation/prds/space/galaxy-page-prd.md
    revision: last_updated_at 2026-11-15
    requirements: [RP-01, RP-02, RP-03, RP-04, RP-05, RP-06, RP-07, RP-08, RP-09, RP-10, RP-12, RP-13]
    journeys: [JN-01, JN-02, JN-03, JN-04, JN-05, JN-06, JN-07, JN-08, JN-10]
  - type: prd
    ref: documentation/prds/lesson/story-narrative-prd.md
    revision: last_updated_at 2026-11-14
    requirements: [RP-04, RP-05, RP-06]
  - type: direct-request
    ref: Decisões de grilling Q1–Q20 (com Q2b, Q3a, Q5a) e revisão de design em cinco seções, confirmadas nesta task em 2026-11-17
scope:
  - packages/core/src/space
  - packages/core/src/profile
  - packages/studio/public/projects/planet-lock
  - apps/server/src
  - apps/server/package.json
  - apps/server/rest-client/profile
  - apps/web/src
  - apps/web/public/lotties
  - apps/backoffice/src
  - .github/workflows/server-app-staging-cd.yml
  - scripts/tests
  - scripts/web-quality.config.json
  - documentation/architecture.md
  - documentation/infrastructure.md
  - documentation/github-flow.md
  - documentation/tooling.md
last_updated_at: 2026-11-17
---

# Context and scope

A Issue #613 (milestone #11 "Página de Espaço") pede que alunos autenticados retomem a trilha do
ponto correto, entendam a progressão, abram cada planeta antes de começar suas estrelas e iniciem ou
revisem conteúdo liberado na página Galáxia (`/space/[galaxySlug]`), em desktop e mobile, numa trilha
de dez planetas que substitui a anterior. O PRD principal é
`documentation/prds/space/galaxy-page-prd.md` (revisão de 2026-11-15); a lista, a ordem, os conceitos
e as estrelas dos planetas vêm do RP-04 e do RP-05 de
`documentation/prds/lesson/story-narrative-prd.md` (revisão de 2026-11-14).

## Resultado delimitado

- O progresso da trilha passa a ser guardado só como **fatos**: estrelas concluídas
  (`users_completed_stars`) e planetas abertos (`users_opened_planets`). Todo estado (bloqueado,
  disponível, concluído; planeta bloqueado, liberado, aberto), o item atual, os contadores e a
  conclusão total são **derivados** por uma única structure do Core, `GalaxyTrail`, usada pelo
  Server, pelas guardas RPC e pela Web.
- `users_unlocked_stars`, `users_recently_unlocked_stars`, o indicador "Conteúdo novo", o job de
  reordenação e o desbloqueio no cadastro deixam de existir; as métricas contam estrelas concluídas.
- O aluno abre um planeta liberado com um clique (`PUT /profile/users/planets/:planetId/open`); a
  animação provisória do cadeado toca uma vez; nenhum planeta abre sozinho.
- As rotas de recompensa recusam estrelas bloqueadas (`403`) e não gravam mais a próxima estrela.
- A página Galáxia segue os boards `Galáxia · Trilha`: estados do mapa, painel de detalhes no desktop,
  painel inferior no mobile, FAB para o item atual, carregamento, falha com nova tentativa e vazio.
- O catálogo "Lógica de Programação" recebe os dez planetas (41 estrelas) por migration; a trilha
  anterior vai para a galáxia `trilha-anterior` (`unpublished`) sem apagar nada; o progresso da trilha
  é zerado preservando XP, moedas, nível, sequência, conquistas e desafios concluídos.
- Um workflow novo de CD do Server para staging aplica as migrations e o seed a cada push em `main`;
  produção continua pausada até um release que leve Server, migrations e Web juntos, com backup.

## Fora do escopo

- Diálogo de vídeo de apresentação, vídeo de encerramento e a ação "Rever vídeo" (issue própria).
- Conteúdo das histórias e desafios das novas estrelas (só um texto provisório por estrela de
  história) e arte final do cadeado. A arte dos planetas entra como WebP animado (revisão 8); ficam fora o
  alternativo estático para `prefers-reduced-motion` e a medição de peso total da página.
- Mudança nas fórmulas de recompensa; seleção de galáxia e uma segunda galáxia; autoria no Studio.
- Execução da substituição em produção; configuração do Coolify de staging (feita pelo usuário em
  paralelo).
- Bloqueio de leitura de conteúdo nas rotas de história, questões, blocos de texto e desafio por
  estrela (Q10: continuam só autenticadas).

## Classificação

Spec em modo **full**: migration com dados e reset de progresso, dois módulos do Core compostos na
borda, mudança de autorização em rotas de escrita, novo workflow de CD com seed remoto e redesenho da
página principal da Web.

## Decisões de grilling registradas

| ID | Decisão |
| --- | --- |
| Q1 | Uma única Spec full para toda a issue. |
| Q2, Q2b | Só fatos são gravados (`users_completed_stars`, `users_opened_planets`); `GalaxyTrail` deriva todo o resto; tabelas de desbloqueio deixam de conduzir a progressão. |
| Q3, Q3a, Q14–Q16 | A substituição da trilha é uma migration customizada no ledger; staging é o projeto `rveubqzvfbqbcpmuevnm`, ainda `legacy`, migrado por um CD novo com `initial_cutover` único. |
| Q4 | A trilha anterior vai para a galáxia `trilha-anterior` (`unpublished`); nada é apagado. |
| Q5, Q5a | Sem backfill: o progresso é zerado com a troca da trilha; o release de produção leva Server, migrations e Web juntos, após backup. |
| Q6 | Estrelas de história recebem um bloco de texto provisório e nenhuma questão; estrelas de desafio ficam sem desafio. |
| Q7 | Métricas contam estrelas concluídas; a chave `unlockedStarsCount` das conquistas é mantida; as tabelas antigas são removidas. |
| Q8 | Indicador "Conteúdo novo", `users_recently_unlocked_stars` e o job de reordenação são removidos. |
| Q9 | `stars.description` anulável; a seção de recompensas do painel é omitida (divergência aprovada). |
| Q10 | Rotas de recompensa e de abertura aplicam a derivação (`403`); guardas RPC da Web também (`404`); leituras de conteúdo continuam só autenticadas. |
| Q11 | Planeta aberto não é acionável nesta entrega; a placa mostra só "Aberto". |
| Q12 | Cadeado em Lottie provisório `planet-lock` (Studio → `apps/web/public/lotties`), com fade CSS em movimento reduzido ou falha. |
| Q13 | Desktop (≥ 1024 px): hover ou foco preenche o painel fixo, que mantém a última estrela e começa na atual; clique e Enter só selecionam. Abaixo de 1024 px: toque abre o painel inferior. |
| Q17 | Todo deploy de staging roda o seed completo; a guarda admite só o projeto de staging e as senhas vêm de secrets. |
| Q18 | `planets.concept` anulável, exibido na placa. |
| Q19 | Estrelas novas usam slugs limpos; as arquivadas recebem o sufixo `-trilha-anterior`. |
| Q20 | Nomes das estrelas aprovados conforme a tabela de RF-01. |
| Imagens (2026-11-18) | Cada planeta novo tem imagem própria no estilo dos planetas do seed (WebP animado 256 px em loop, fundo transparente; revisão 8); o CD de staging envia essas imagens ao R2 de staging. |
| Revisão de design | Áudio `star.wav` e reinício do Lottie da estrela na ação de começar/revisar, não na seleção; sem foguete de posição; planetas sem ícone (o campo `icon` deixa de existir, revisão 7); `check:web-quality` com a rota `galaxy`. |

# Implementation Contract

## Requisitos funcionais

| RF | Requisito | Origem |
| --- | --- | --- |
| RF-01 | O catálogo da galáxia `logica-de-programacao` passa a ter os dez planetas e 41 estrelas da tabela abaixo, com `concept`, imagens provisórias, slugs limpos, descrição neutra, bloco de texto provisório nas estrelas de história e nenhum desafio nas estrelas de desafio. Os planetas anteriores vão para a galáxia `trilha-anterior` (`unpublished`), preservando estrelas, histórias e desafios, com o sufixo `-trilha-anterior` nos slugs das estrelas. O seed local carrega exatamente o mesmo catálogo. | RP-04, RP-05 (Narrativa), RP-12, RP-13, Q4, Q6, Q9, Q18–Q20 |
| RF-02 | O progresso da trilha é guardado só em `users_completed_stars` e `users_opened_planets`, uma linha por fato, sem duplicação. A migration zera o progresso da trilha (`has_completed_space` falso, sem fatos) e preserva XP, moedas, nível, sequência, conquistas, desafios concluídos, ranking e galáxia atual; `users_unlocked_stars` e `users_recently_unlocked_stars` deixam de existir. | RP-12, Q2b, Q5a, Q7, Q15 |
| RF-03 | `GalaxyTrail` deriva, para uma galáxia e os fatos de uma conta: estado de cada estrela e de cada planeta, item atual (estrela ou planeta liberado), contadores e conclusão total, pelas regras do conceito "Trilha da galáxia". | RP-02, RP-05, RP-08, RP-10 |
| RF-04 | `PUT /profile/users/planets/:planetId/open` abre um planeta liberado para a conta da sessão, de forma idempotente; planeta bloqueado → `403`; inexistente → `404`; sem sessão → `401`. | RP-10, JN-08 |
| RF-05 | `PUT /profile/users/:userId/reward/star` e `/reward/star-challenge` só aceitam estrela disponível ou concluída (bloqueada → `403`, nada gravado nem recompensado); registram a conclusão de forma idempotente; nunca gravam a próxima estrela; gravam só para a conta da sessão (`:userId` de outra conta → `404`); pagam metade numa estrela já concluída; marcam `has_completed_space` na primeira conclusão da última estrela da primeira galáxia; publicam `PlanetCompletedEvent` só na primeira conclusão da última estrela de um planeta, depois de gravá-la. | RP-04, RP-06, RP-08, JN-04 |
| RF-06 | Criar uma conta não grava progresso; `FirstStarUnlockedEvent` continua publicado no cadastro (ranking e analytics); `StarUnlockedEvent` e seu mapeamento de analytics deixam de existir. | RP-10 ("nenhum planeta é aberto automaticamente"), DT-07 |
| RF-07 | KPI de estrelas, ordenação da lista de usuários, contagens por estrela e por planeta, estatística do perfil, planilha de usuários e a métrica de conquista `unlockedStarsCount` contam estrelas concluídas; os rótulos de interface passam a "Estrelas concluídas". | Q7 |
| RF-08 | O mapa mostra os planetas em ordem e, para cada estrela, número, nome, tipo e estado; para cada planeta, nome, conceito, contador de estrelas concluídas, estado e condição de liberação, conforme os boards; sem foguete de posição e sem "Conteúdo novo". | RP-05, RP-08, RP-02 |
| RF-09 | A entrada posiciona o mapa uma vez no item atual; o FAB aparece só com o item atual fora da área visível, aponta para ele e o traz de volta; sem item atual não há FAB nem rolagem. | RP-02, RP-03, JN-01 |
| RF-10 | Estrelas disponíveis e concluídas abrem detalhes: no desktop, painel fixo ao lado do mapa por hover ou foco; no mobile, painel inferior por toque. A ação do painel começa ou revisa o conteúdo do tipo real, tocando `star.wav` e reiniciando o Lottie da estrela; falha não troca o tipo nem navega. | RP-04, RP-09, JN-02, JN-03 |
| RF-11 | Um planeta liberado é um único botão (planeta + placa) que abre o planeta; a animação do cadeado toca uma vez após o sucesso; movimento reduzido ou falha da animação usam fade curto; a abertura não depende da animação; planeta aberto não é acionável. | RP-05, RP-10, JN-08 |
| RF-12 | Acesso direto por URL a uma estrela bloqueada (lição ou desafio) responde `404`; disponível e concluída abrem. | RP-04, JN-04 |
| RF-13 | Carregamento, falha com "Tentar novamente", trilha vazia e trilha concluída são apresentados sem inventar progresso; a trilha concluída mantém o link "Agradecimentos". | RP-01, RP-06, JN-05, JN-06, JN-07 |
| RF-14 | Mapa, painel, painel inferior e planeta funcionam com teclado, foco visível, nomes acessíveis e estados não dependentes só de cor, sem scroll horizontal em 1440×900 e 390×844. | RP-07 |
| RF-15 | Um workflow de CD de staging do Server aplica as migrations, roda o seed e implanta o Server a cada push relevante em `main`, com uma execução manual única de `initial_cutover`. | Q14–Q16 |
| RF-16 | O seed roda em staging só contra o projeto de staging, nunca em produção, com senhas das contas de demonstração vindas de secrets. | Q17 |
| RF-17 | A rota da página Galáxia entra no `check:web-quality` com os mínimos da rota `galaxies`. | `documentation/tooling.md` (Qualidade web) |
| RF-19 | O CD de staging envia as dez imagens novas para `images/planets/` no R2 de staging antes do seed, só no bucket de staging, sem apagar nem alterar outros objetos, e confirma a leitura pública de cada uma. | Pedido direto (2026-11-18) |
| RF-18 | Architecture, Infrastructure, GitHub Flow e Tooling descrevem a progressão por fatos, o CD de staging, o seed de staging e a pré-condição de produção (pausa mantida até release conjunto com backup). | Q5a, Q15, AGENTS.md |

### Catálogo da trilha (RF-01)

Numeração por planeta; H = história, D = desafio. Origem: RP-04 e RP-05 da Narrativa, com as
adaptações aprovadas em Q20 (Perene 3, "Operadores" em Kalkulon e os quatro desafios adaptados).

| # | Planeta (`concept`) | Estrelas |
| --- | --- | --- |
| 1 | Aurora (Introdução) | 1 H Lógica de programação · 2 H Variáveis · 3 H Escreva e leia · 4 D Desafio: Decolar |
| 2 | Trívia (Tipos de dados) | 1 H Tipo texto · 2 H Tipo número · 3 H Tipo lógico · 4 D Desafio: Reunir os três pedaços |
| 3 | Kalkulon (Operadores) | 1 H Operadores aritméticos · 2 H Operadores relacionais · 3 H Operadores lógicos · 4 D Desafio: Atravessar a chuva de asteroides |
| 4 | Ifthenia (Condicionais) | 1 H Se · 2 H Senão · 3 H Senão se · 4 H Escolha caso · 5 D Desafio: Reais ou Ocos |
| 5 | Cíclade (Laços) | 1 H Para · 2 H Enquanto · 3 H Fazer enquanto · 4 D Desafio: Sair de Cíclade |
| 6 | O Comboio, parte 1 (Listas: acessar e modificar) | 1 H Índice · 2 H Adicionar e remover · 3 D Desafio: Alcançar a nave zero |
| 7 | O Comboio, parte 2 (Listas: transformar e percorrer) | 1 H Ordenar e fatiar · 2 H Métodos de texto · 3 H Laços com listas · 4 D Desafio: Resgatar os tripulantes |
| 8 | Arcana (Funções) | 1 H Criando funções · 2 H Retorna · 3 H Funções nativas · 4 H Funções avançadas · 5 D Desafio: Abrir a Fortaleza |
| 9 | Perene (Tuplas) | 1 H Criar tuplas · 2 H Imutabilidade · 3 H Tuplas ou listas · 4 D Desafio: Guardar o que precisa sobreviver |
| 10 | Chavalor (Dicionários) | 1 H Acessar e alterar valores · 2 H Chaves e valores · 3 H Desestruturação · 4 D Desafio: Devolver o valor |

- **Slug:** nome em kebab-case sem acentos (`logica-de-programacao`, `variaveis`, `desafio-decolar`);
  únicos no catálogo depois do sufixo das estrelas arquivadas.
- **Descrição:** história → "Estrela de história sobre <nome em minúsculas>."; desafio →
  "Desafio final de <planeta>."
- **Texto provisório (história):** um bloco `default` com "Conteúdo desta estrela em produção.";
  `questions` vazio; `story` nulo.
- **Imagens:** `image` é `planet-<slug>-image.webp`, arquivo novo por planeta (`aurora`, `trivia`,
  `kalkulon`, `ifthenia`, `ciclade`, `o-comboio-parte-1`, `o-comboio-parte-2`, `arcana`, `perene`,
  `chavalor`), WebP animado 256 × 256 em loop (24 a 30 quadros de 80 a 100 ms, cerca de 220 a 375 KB, fundo transparente), versionado em
  `apps/server/src/database/seeders/assets/images/planets/` e igual em `0007` e no seed. O planeta não tem
  `icon`: a coluna `planets.icon` é removida pela migration `0009` e os ícones antigos saem do seed. No seed local, os planetas
  arquivados em `trilha-anterior` usam a imagem nova do planeta de mesmo conceito; em staging e
  produção mantêm as imagens que já têm no banco.
- **Disponibilidade:** `is_available = true` em planetas e estrelas novos.
- **IDs:** UUIDs fixos declarados em `0007` e repetidos em `seed-catalog.json`.

## Critérios de aceitação

| CA | RF | Given | When | Then | Expected evidence |
| --- | --- | --- | --- | --- | --- |
| CA-01 | RF-01 | Banco com o schema até `0005` e o catálogo anterior (LP com planetas, estrelas com histórias, desafios ligados a estrelas) | `0006`–`0008` são aplicadas | LP tem exatamente os 10 planetas (posições 1–10, `concept`, imagens) e 41 estrelas (número, nome, `is_challenge`, slug, descrição, texto provisório) da tabela de RF-01; `trilha-anterior` existe como `unpublished` e contém todos os planetas anteriores com as mesmas estrelas, histórias e desafios; slugs arquivados terminam em `-trilha-anterior` | AV-05 |
| CA-02 | RF-02 | O mesmo banco, com usuários com XP, moedas, nível, sequência, conquistas, desafios concluídos, galáxia atual, estrelas desbloqueadas e `has_completed_space = true` | `0006`–`0008` são aplicadas | `users_completed_stars` e `users_opened_planets` vazias; `has_completed_space = false`; demais colunas e tabelas de conta inalteradas; `users_unlocked_stars` e `users_recently_unlocked_stars` não existem; nenhuma view ou função referencia essas tabelas | AV-05 |
| CA-03 | RF-02 | Migrations aplicadas | Privilégios das tabelas novas são inspecionados | `anon`, `authenticated` e `PUBLIC` não têm privilégio em `users_completed_stars` e `users_opened_planets` | AV-05 |
| CA-04 | RF-01 | Seed local | `db:seed` após `db:test` | Planetas e estrelas de LP e de `trilha-anterior` têm os mesmos UUIDs, slugs, nomes e posições que `0007`; nenhuma conta tem fatos de progresso | AV-05 |
| CA-05 | RF-03 | Conta sem fatos, galáxia com 3 planetas | `GalaxyTrail.create` | Planeta 1 `liberated`, demais `locked`; todas as estrelas `locked`; item atual = planeta 1; nenhum planeta concluído; `isCompleted` falso | AV-01 |
| CA-06 | RF-03 | Planeta 1 aberto; estrela 1 concluída | Derivação | Estrela 1 `completed`, estrela 2 `available`, demais `locked`; item atual = estrela 2; `countCompletedStars(planeta 1) = 1` | AV-01 |
| CA-07 | RF-03 | Todas as estrelas do planeta 1 concluídas, planeta 2 não aberto | Derivação | Planeta 1 concluído e `opened`; planeta 2 `liberated` com estrelas `locked`; item atual = planeta 2; com todos os planetas abertos e todas as estrelas concluídas: item atual `null` e `isCompleted` verdadeiro; catálogo vazio: item atual `null` e `isCompleted` falso | AV-01 |
| CA-08 | RF-03 | Planeta aberto com estrelas 1–3 concluídas; uma estrela nova é inserida na posição 2 | Derivação | O planeta continua `opened`; a estrela nova fica `available` (anterior concluída) e é o item atual; as estrelas concluídas continuam `completed` | AV-01 |
| CA-09 | RF-04 | Conta autenticada, Aurora liberada | `PUT /profile/users/planets/<aurora>/open` | `200 { openedPlanetId }`; uma linha em `users_opened_planets`; `GET /profile/users/id/:id` devolve Aurora em `openedPlanetsIds`; a derivação mostra só a estrela 1 disponível | AV-02, AV-03, AV-04 |
| CA-10 | RF-04 | Aurora já aberta | Mesma requisição repetida | `200`; continua uma linha; nenhum outro efeito | AV-02, AV-04 |
| CA-11 | RF-04 | Trívia bloqueada; UUID inexistente | `PUT …/open` para cada um | Trívia → `403`; inexistente → `404`; nenhuma linha gravada | AV-02, AV-04 |
| CA-12 | RF-04 | Requisição sem sessão; requisição com sessão da conta A | `PUT …/open` | Sem sessão → `401`; com sessão, só a conta A é afetada (o caminho não tem identificador de conta) | AV-04 |
| CA-13 | RF-04 | Aurora aberta pela conta A | A conta entra com outra sessão (novo login) | `openedPlanetsIds` contém Aurora | AV-04 |
| CA-14 | RF-05 | Estrela 2 de Aurora bloqueada para a conta | `PUT /profile/users/:userId/reward/star` com essa estrela | `403`; nenhuma conclusão; moedas e XP inalterados | AV-02, AV-04 |
| CA-15 | RF-05 | Aurora aberta, estrela 1 disponível | Recompensa da estrela 1; depois a mesma recompensa de novo | 1ª: `200`, conclusão gravada, estrela 2 disponível, nenhuma outra disponível; 2ª: `200`, nenhuma conclusão nova, nenhuma estrela além da 2 disponível, recompensa pela metade | AV-02, AV-03, AV-04 |
| CA-16 | RF-05 | Estrelas 1–3 de Aurora concluídas | Recompensa da estrela 4 | Aurora concluída; Trívia `liberated` e não aberta (sem linha em `users_opened_planets`); `PlanetCompletedEvent` publicado uma vez; repetir não o publica de novo | AV-02, AV-04 |
| CA-17 | RF-05 | Todas as estrelas de LP exceto a última concluídas | Recompensa da última estrela; depois numa galáxia que não é a primeira | Na LP, `has_completed_space = true`; na outra galáxia, inalterado | AV-02, AV-04 |
| CA-18 | RF-05 | Estrela de desafio disponível e outra bloqueada | `PUT /profile/users/:userId/reward/star-challenge` | Bloqueada → `403`; disponível → conclusão da estrela e do desafio gravadas; próxima estrela não é gravada | AV-03, AV-04 |
| CA-19 | RF-06 | Conta nova | `CreateUserJob` e a função de ranking | Nenhum fato de progresso gravado; `FirstStarUnlockedEvent` publicado e o primeiro tier atribuído como antes | AV-03 |
| CA-20 | RF-06 | Código integrado | Busca por `StarUnlockedEvent` e por `users_unlocked_stars` em `packages/core`, `apps/server` e `apps/web` | Nenhuma referência restante (fora de migrations históricas) | AV-09 |
| CA-21 | RF-07 | Contas com conclusões em meses diferentes | KPI de estrelas, lista de usuários ordenada por estrelas, contagens do editor de planetas, estatística do perfil, planilha | Todos contam estrelas concluídas; perfil, KPI, tabela e formulário de conquista exibem "Estrelas concluídas"/"Estrelas Concluídas" | AV-02, AV-04, AV-06, AV-09 |
| CA-22 | RF-08 | Mapa com planeta aberto (estrelas concluída, disponível, bloqueadas), planeta liberado e planeta bloqueado | A página é apresentada | Estrela: número, nome, rótulo de tipo com ícone ("História" ou "Desafio de código"), estado ("Concluída" verde, "Disponível" amarelo, bloqueada discreta); Lottie `unlocked-star` em disponível e concluída, SVG em bloqueada; planeta: nome, conceito e "N de M estrelas concluídas" (desktop) ou "N de M concluídas" (mobile); ilustração com opacidade reduzida e cadeado em bloqueado e liberado; cor plena e "Aberto" em aberto; sem foguete e sem "Conteúdo novo" | AV-06, AV-07, VV-01–VV-08 |
| CA-23 | RF-08 | Estrela e planeta bloqueados | A página é apresentada | Estrela bloqueada por estrela anterior: "Conclua a estrela N para liberar"; em planeta não aberto: "Abra o planeta para liberar"; planeta bloqueado: "Conclua <planeta anterior> para liberar"; ícone de cadeado no texto; planeta liberado com "Próximo passo" e "Abrir planeta" | AV-06, VV-02, VV-06, VV-07 |
| CA-24 | RF-10 | Desktop 1440×900 | Hover ou foco por teclado numa estrela disponível ou concluída; depois o ponteiro sai; depois clique ou Enter na estrela; foco numa bloqueada | O painel mostra a estrela e permanece com ela após o ponteiro sair; ao carregar, mostra a estrela atual (ou nada sem item atual); clique e Enter só selecionam, sem navegação nem áudio; estrela bloqueada não é selecionável | AV-06, AV-07, VV-01 |
| CA-25 | RF-10 | Estrela selecionada | O painel é apresentado | "Estrela N · <planeta>", nome, chip de tipo, chip de estado, descrição (omitida quando `null`), sem recompensas, ação "Começar história", "Começar desafio", "Revisar história" ou "Revisar desafio" conforme tipo e estado | AV-06, VV-01, VV-10 |
| CA-26 | RF-10 | Mobile 390×844 | Toque numa estrela disponível; depois fechar | Painel inferior com fundo atenuado e a mesma ação; fechar mantém a rolagem do mapa e devolve o foco à estrela; o FAB fica oculto com o painel aberto | AV-06, AV-07, MV-02, VV-10 |
| CA-27 | RF-10 | Estrela de história; estrela de desafio sem desafio | A ação do painel é acionada | História: `star.wav` toca, o Lottie da estrela reinicia e a navegação vai para `/lesson/<slug>`; desafio sem desafio (ou falha): toast "Não foi possível abrir o desafio. Tente de novo.", sem navegação e sem cair na lição; consultar ou abrir não grava conclusão | AV-06, AV-07, MV-01 |
| CA-28 | RF-09 | Conta com item atual fora da primeira tela | Entrada na página | O mapa rola uma vez até o item atual (estrela ou planeta liberado) depois do layout estável; rolar manualmente depois não reposiciona | AV-06, AV-07, MV-01 |
| CA-29 | RF-09 | Item atual fora da área visível, acima e abaixo | O aluno rola e aciona o FAB | O FAB só aparece fora da área visível, com seta para cima ou para baixo, nome acessível "Voltar à estrela atual" e traz o item atual de volta | AV-06, AV-07, MV-02, VV-04, VV-09 |
| CA-30 | RF-09, RF-13 | Trilha concluída; trilha vazia | A página é apresentada | Sem FAB e sem rolagem automática | AV-06, AV-07 |
| CA-31 | RF-13 | Todas as estrelas de LP concluídas e `has_completed_space` | A página é apresentada | Todas as estrelas "Concluída", nenhuma em destaque, revisão disponível e link "Agradecimentos" para `/lesson/ending` | AV-06, AV-07 |
| CA-32 | RF-11 | Planeta liberado | Clique, Enter ou Espaço no planeta | Uma única requisição `PUT …/open`; enquanto pendente, `aria-busy` e novos acionamentos ignorados; no sucesso, o usuário é recarregado, o cadeado toca a abertura uma vez e a estrela 1 aparece "Disponível"; na falha, toast "Não foi possível abrir <planeta>. Tente de novo." e o planeta continua liberado | AV-06, AV-07, MV-01, VV-03, VV-11 |
| CA-33 | RF-11 | Planeta já aberto ao carregar | A página é apresentada; o aluno clica no planeta | Sem cadeado e sem animação; o planeta não é botão e a placa mostra "Aberto" | AV-06, AV-07 |
| CA-34 | RF-11 | Planeta bloqueado, planeta liberado, `prefers-reduced-motion: reduce`, falha ao carregar `planet-lock.json` | A página é apresentada e o planeta liberado é aberto | Bloqueado: cadeado parado; liberado: loop sutil (parado com movimento reduzido); abertura com movimento reduzido ou falha: fade curto; a estrela 1 fica disponível sem esperar a animação | AV-06, AV-07 |
| CA-35 | RF-13 | Consulta de galáxia ou planetas pendente; com falha; com zero planetas | A página é apresentada | Pendente: "Carregando trilha…" e placeholders; falha: "Não foi possível carregar a trilha", mensagem sem detalhe interno e "Tentar novamente", que refaz a carga; vazio: "Nenhum conteúdo disponível nesta trilha."; nenhum caso mostra mapa vazio, progresso zerado ou conclusão | AV-06, AV-07 |
| CA-36 | RF-14 | Teclado e leitor de tela; 1440×900 e 390×844 | Navegação por Tab e uso das ações | Planeta liberado é um único botão "Abrir planeta <nome>"; estrelas e ações têm nome acessível e foco visível; estados têm texto e ícone; sem scroll horizontal nos dois viewports | AV-06, AV-07, MV-02 |
| CA-37 | RF-12 | Estrela bloqueada, disponível e concluída; God Account | Acesso direto a `/lesson/<slug>` e à página do desafio da estrela | Bloqueada → `404`; disponível e concluída → página; God Account mantém o acesso a desafios | AV-06 |
| CA-38 | RF-15 | Workflow escrito | Inspeção estática | Gatilhos (push em `main` com os paths do Server e `workflow_dispatch` com `initial_cutover`), environment `staging`, grupo de concorrência `stardust-web-staging` sem cancelamento, ordem preflight → migrate → preflight → `seed-staging-assets.mjs` → `db:seed:staging` → deploy → SHA e health, sem dependência de `PRODUCTION_RELEASES_PAUSED` | AV-08 |
| CA-39 | RF-15 | Coolify de staging configurado pelo usuário | `initial_cutover` uma vez e depois um push | Migrations `0000`–`0008` registradas no ledger de staging; preflight `server-owned` passa; seed concluído; deploy com o SHA esperado e health `2xx`; LP com os 10 planetas | MV-03 |
| CA-40 | RF-16 | `seed.ts --environment staging` | Sem senhas; com host de produção ou outro projeto; com `MODE=production`; com o projeto de staging e senhas | Os três primeiros são recusados antes de qualquer escrita; o último prossegue com as senhas das variáveis; `--environment local` mantém a guarda de loopback e as senhas do fixture | AV-05 |
| CA-41 | RF-17 | Build de produção da Web, Server local, conta seed | `pnpm run check:web-quality --route galaxy` | Mediana de 3 execuções atinge os mínimos nos presets mobile e desktop; a mesma medição da página atual foi registrada antes da mudança | AV-10 |
| CA-42 | RF-18 | Documentação atualizada | Revisão | `architecture.md` descreve fatos e derivação; `infrastructure.md` e `github-flow.md` descrevem o Server de staging, seus secrets, o seed e a pré-condição de produção (pausa até release conjunto, backup obrigatório); `tooling.md` descreve `db:seed:staging` | AV-09 |
| CA-43 | RF-05 | Sessão da conta A; estrela 1 de Aurora disponível para A | `PUT /profile/users/<id da conta B>/reward/star` com essa estrela | `404` (`UserNotFoundError`: o repositório não enxerga a conta B na sessão de A); nenhuma conclusão gravada para A nem para B; moedas e XP inalterados | AV-04 |
| CA-44 | RF-19 | `seed-staging-assets.mjs` | Sem credenciais; bucket diferente de `STAGING_ASSETS_BUCKET`; bucket igual a `PRODUCTION_ASSETS_BUCKET`; `MODE=production`; arquivo do catálogo ausente | Cada caso é recusado antes de qualquer chamada ao R2; com a configuração de staging, o plano de envio contém exatamente as dez chaves `images/planets/planet-<slug>-image.webp` com `Content-Type: image/webp` | AV-05 |
| CA-45 | RF-19 | Staging configurado | Execução do CD | O passo de imagens roda depois do segundo preflight e antes do seed; as dez URLs `STAGING_CDN_URL/images/planets/…` respondem `200` com os bytes versionados; nenhum outro objeto do bucket muda | AV-08, MV-03 |

## Design Contract

**Fonte canônica:** desde a revisão 9, o canvas Doop `StarDust` (`iTvx3bvEsu`), inspecionado pelo Doop
MCP com os mesmos nomes de frame; as tabelas abaixo mantêm os nomes de página e board do Penpot, de onde os
frames vieram. Nenhum design é extraído. **Registro da revisão:**
`documentation/design-reviews/space/galaxy-page-prd.md` (`verdict: pass`,
`prd_last_updated_at: 2026-11-15`, `penpot_revn: 624`, revisado em 2026-11-17). Os digests dos onze
boards da matriz abaixo conferem com o registro. Os diálogos de vídeo ficaram fora do registro (botões de
40 px contra os 44 px de `design.md`) e não são usados por esta Spec, que deixa o vídeo para issue
própria.

### Matriz de referências visuais

| Surface / route | State / viewport | Penpot page / board / components | CA / VV | Allowed deviations |
| --- | --- | --- | --- | --- |
| `/space/[galaxySlug]` | Planeta aberto (1 de 4), estrelas concluída, disponível e bloqueadas, painel de uma estrela de história disponível; 1440×900 (board 1440×1160) | `🖥️ Desktop` / `Espaço / Galáxia / Desktop` / painel `Detalhes da estrela (hover)` | CA-22, CA-24, CA-25 / VV-01 | Sem bloco "Recompensas ao concluir"; placa "Aberto" sem "Rever vídeo"; ilustração real no lugar de "img"/"Imagem · planeta"; controle de galáxia como já implementado, sem cobrir a trilha; trilha pontilhada contínua entre o último item de um planeta e o planeta seguinte |
| `/space/[galaxySlug]` | Planeta liberado ("Próximo passo", "Abrir planeta", cadeado em loop) e Kalkulon bloqueado; 1440×900 | `🖥️ Desktop` / `Espaço / Galáxia / planeta liberado / Desktop` | CA-22, CA-23, CA-34 / VV-02 | "Abrir planeta" é rótulo visual dentro do botão único planeta+placa, não um botão aninhado; cadeado é o Lottie provisório |
| `/space/[galaxySlug]` | Logo após abrir (0 de 4, estrela 1 disponível, sem cadeado); 1440×900 | `🖥️ Desktop` / `Espaço / Galáxia / planeta aberto / Desktop` | CA-32 / VV-03 | Placa "Aberto" sem "Rever vídeo" |
| `/space/[galaxySlug]` | Item atual acima da área visível, FAB com seta para cima; 1440×900 | `🖥️ Desktop` / `Espaço / Galáxia / FAB de retorno / Desktop` | CA-29 / VV-04 | Seta para baixo = mesmo componente espelhado (decisão do registro) |
| `/space/[galaxySlug]` | Mapa com planeta aberto (1 de 4); 390×844 | `📱 Mobile` / `Espaço / Galáxia / Mobile` | CA-22 / VV-05 | Placa "Aberto" sem "Rever vídeo"; ilustração real |
| `/space/[galaxySlug]` | Planeta liberado; 390×844 | `📱 Mobile` / `Espaço / Galáxia / planeta liberado / Mobile` | CA-22, CA-23 / VV-06 | Idem VV-02 |
| `/space/[galaxySlug]` | Planeta bloqueado; 390×844 | `📱 Mobile` / `Espaço / Galáxia / planeta bloqueado / Mobile` | CA-23 / VV-07 | Texto de estrela bloqueada (ver "Precedência e mapeamento") |
| `/space/[galaxySlug]` | Logo após abrir; 390×844 | `📱 Mobile` / `Espaço / Galáxia / planeta aberto / Mobile` | CA-32 / VV-08 | Placa "Aberto" sem "Rever vídeo" |
| `/space/[galaxySlug]` | FAB; 390×844 | `📱 Mobile` / `Espaço / Galáxia / FAB de retorno / Mobile` | CA-29 / VV-09 | Idem VV-04 |
| `/space/[galaxySlug]` | Painel inferior de estrela de história disponível; 390×844 | `📱 Mobile` / `Espaço / Galáxia / Detalhes da estrela / Mobile` | CA-25, CA-26 / VV-10 | Encaixado: só cantos superiores arredondados, sem borda lateral e inferior, fundo atenuado (decisões do registro); sem recompensas |
| `/space/[galaxySlug]` | Sequência de abertura do cadeado (comportamento dos dois viewports) | `🖥️ Desktop` / `Espaço / Galáxia / Planeta / animação de abertura do cadeado / Desktop` | CA-32, CA-34 / VV-11 | Arte provisória; quadros 1→4 em sequência |

### Estados sem board

- **Carregando, falha e vazio:** composição de `GalaxiesLoading` e `GalaxiesLoadFailure`
  (`apps/web/src/ui/space/widgets/pages/Galaxies/`), com os textos de CA-35. Sem fonte canônica no
  Penpot; registrado como ausência.
- **Estrela concluída nos detalhes, variante de desafio, trilha concluída, painel sem estrela atual:**
  definidos por CA-25, CA-31 e CA-24 (decisões do registro).
- **FAB sobre planeta liberado:** mesmo nome acessível "Voltar à estrela atual" (decisão do registro).

### Precedência e mapeamento

- Tokens e utilitários de `apps/web/tailwind.config.js` e `documentation/design.md` têm precedência;
  valor de board sem token usa o token mais próximo já usado pela trilha e a divergência é registrada
  no Evaluation.
- Componentes reutilizados: `Animation` (`LottieAnimation`), `Icon`, `Button`, `Fab`
  (`apps/web/src/ui/global/widgets/components/Fab`), `ToastContext`, `Drawer` do `vaul` (precedente
  `NotesDrawer`), `useBreakpoint` (`lg` = 1024 px) e `useReducedMotion` (`motion/react`).
- UI preservada: `HomeHeader`, `Sidenav`, `TabNav`, `GalaxyControl`, `Particles`, o link
  "Agradecimentos" e a página `/lesson/ending`.
- Desvios dos boards decididos no registro (2026-11-17): o `GalaxyControl` nunca cobre a trilha em
  nenhuma posição de rolagem (nos boards ele se sobrepõe à coluna da trilha); a trilha pontilhada é
  contínua entre planetas (nos boards falta o trecho entre Aurora e Trívia). VV-01–VV-04 conferem os
  dois pontos.
- Desvios aceitos pelo usuário em 2026-11-21, após a revisão visual no Doop (ACH-22 a ACH-24; valem para
  todas as linhas VV que mostram o estado):
  - **Texto de estrela bloqueada:** em planeta não aberto, toda estrela diz "Abra o planeta para liberar"
    (CA-23); os boards dizem "Conclua a estrela N para liberar" ou "Conclua o planeta anterior".
  - **Painel de detalhes no desktop:** fica ancorado ao topo da coluna da direita (sticky, CA-24), e não na
    altura da estrela selecionada como no board; a distância até os cartões é maior que a do board.
  - **Cor da estrela bloqueada:** usa o SVG de estrela bloqueada existente (lilás acinzentado com numeral
    dourado), e não o cinza-ardósia com numeral escuro do board (CA-22).

### Matriz de auditoria estrutural

| Widget | Entry Point | View | Hook | Rule |
| --- | --- | --- | --- | --- |
| `SpacePage` | `Space/index.tsx`: `useSpaceContext`, `useAuthContext`, `useBreakpoint` → `useSpacePage` | `SpacePageView.tsx` | `useSpacePage.ts` | UI Layer: hook sem contexts |
| `TrailLoading` | alias de `TrailLoadingView` | `TrailLoadingView.tsx` | — (estrutural) | UI Layer: alias |
| `TrailLoadFailure` | alias de `TrailLoadFailureView` | `TrailLoadFailureView.tsx` | — | UI Layer: alias |
| `TrailEmpty` | alias de `TrailEmptyView` | `TrailEmptyView.tsx` | — | UI Layer: alias |
| `StarDetails` | `StarDetails/index.tsx`: contexts, `challengingService`, navegação, toast, áudio → `useStarDetails` | `StarDetailsView.tsx` | `useStarDetails.ts` | UI Layer |
| `StarDetailsSheet` | alias de `StarDetailsSheetView` (props `isOpen`, `onClose`) | `StarDetailsSheetView.tsx`: `Drawer` que renderiza o widget público `StarDetails` pelo `index.tsx` | — | UI Layer: alias; nenhum import de arquivos internos de `StarDetails` |
| `Planet` | `Planet/index.tsx`: `useSpaceContext`, `useOpenPlanetAction`, `useAuthContext`, toast, `useFileStorage` → `usePlanet` | `PlanetView.tsx` | `usePlanet.ts` | UI Layer: action hook consumido no Entry Point |
| `PlanetLock` | `PlanetLock/index.tsx`: `useReducedMotion` → `usePlanetLock` | `PlanetLockView.tsx` | `usePlanetLock.ts` | UI Layer |
| `Star` | `Star/index.tsx`: `useSpaceContext` → `useStar` | `StarView.tsx` | `useStar.ts` | UI Layer |
| `Statistics` (perfil) | inalterado | `StatisticsView.tsx` | — | UI Layer |

# Technical Contract

## Decisões técnicas

| ID | Decisão | Evidência | Alternativas | Razão e impacto |
| --- | --- | --- | --- | --- |
| DT-01 | Fatos em profile, derivação em space (`GalaxyTrail` recebe `IdsList`) | `Galaxy.countCompletedPlanets(completedPlanetsIds)` já recebe fatos de profile como `IdsList`; Core Rule de desacoplamento | Derivação em profile importando `Planet`; tabelas de estado | Uma regra para Server, RPC e Web; nenhum módulo importa repositório do outro |
| DT-02 | Composição na borda em cadeia de middlewares | `UsersRouter` já encadeia `profileMiddleware.appendUserInfoToBody` → `spaceMiddleware.appendNextStarToBody`; `PUT /current-galaxy` usa `appendEnterableGalaxyToBody` | Use case cross-module | Mantém a Core Rule; a conta vem só da sessão |
| DT-03 | Idempotência por PK composta e `ON CONFLICT DO NOTHING`; use cases checam o fato antes | `users_recently_unlocked_stars` já usa PK composta; `users_unlocked_stars` não tinha unique (duplicação possível) | Lock aplicativo; unique sem PK | Repetições e concorrência gravam no máximo uma linha |
| DT-04 | `GetNextStarUseCase` substituído por `GetStarCompletionUseCase`; a próxima estrela nunca é gravada | Disponibilidade derivada (Q2b) | Manter o cálculo da próxima estrela | Remove o caminho que gravava estado e o atravessamento de planeta |
| DT-05 | Substituição da trilha como migration customizada `0007`, com dados de UUID fixo, e remoção das tabelas em `0008` gerada | `0004_galaxies_catalog` é customizada com dados e SQL inverso no cabeçalho; `database-rules.md` (Drizzle) | Script manual; SQL via MCP | Um único caminho para local, staging e produção (Q15) |
| DT-06 | Objetos SQL que leem as tabelas antigas: os usados por repositórios Drizzle ou por outro objeto mantido (`users_completed_planets_view`, `count_star_unlocks`, `count_users_at_star`, `count_planet_completions`, `count_users_at_planet` e os que a verificação de referências apontar) são recriados sobre os fatos em `0007`; `count_user_unlocked_stars`, consumida pela ordenação `unlockedStarCountOrder` de `DrizzleUsersRepository`, é substituída por `count_user_completed_stars` em `0007` e o repositório passa a chamá-la; os legados sem consumidor (`get_last_user_unlocked_star_id`, `verify_user_space_completion`, `insert_initial_data`, `insert_user_initial_data`, `users_view`, `planets_view`) são removidos | Lista extraída de `0001_application_objects.sql`; AV-05 confirma que nada referencia as tabelas removidas | Recriar todos | Reduz código SQL morto; a verificação de referências é registrada no Evaluation antes de escrever `0007` |
| DT-07 | `FirstStarUnlockedEvent` mantém nome e payload; `StarUnlockedEvent` é removido sem substituto | `ReachFirstTierJob` e `AnalyticsFunctions` consomem o primeiro; o segundo só alimenta analytics; PRD: sem novos eventos de analytics | Renomear o evento; criar `StarCompletedEvent` | Preserva ranking e a série de analytics do cadastro |
| DT-08 | Adapter Supabase legado de usuários lança `MethodNotImplementedError` nos métodos novos | Precedente DT-07 da Spec de Galáxias (`SupabasePlanetsRepository`) | Implementar no adapter legado | Não é composto por nenhuma rota |
| DT-09 | `description` e `concept` opcionais nos DTOs | Campos opcionais já existem nos DTOs (`id?`, `galaxyId?`) | Obrigatórios | Evita tocar mappers legados e fakers não relacionados |
| DT-10 | Carregamento e falha da página pelo App Router (`loading.tsx`, `error.tsx` com `reset`) delegando a widgets | A página já busca no servidor; não há query cliente de planetas | Query SWR cliente | Sem nova camada de cache; "Tentar novamente" refaz a renderização do servidor |
| DT-11 | Guardas RPC constroem a trilha da galáxia atual (função interna `getCurrentGalaxyTrail` em cada action, sem arquivo compartilhado, revisão 11; risco aceito pelo usuário: a derivação existe em duas cópias e uma correção futura deve ser aplicada nas duas, coberta por `AccessStarPageAction.test.ts` e `AccessChallengePageAction.test.ts`) | `isFirstStarOfCurrentGalaxy` já busca galáxia atual e planetas | Endpoint de acesso no Server | Mesma derivação da página, sem rota nova |
| DT-12 | Seed de staging com `--environment staging`, projeto e senhas validados antes de qualquer escrita | `validateSeedDatabase` já recusa tudo que não é loopback; `check-drizzle-transition.mjs` já usa `--environment` | Seed só do catálogo (Q17 C) | Staging reproduzível sem login privilegiado público |
| DT-13 | Workflow de staging espelha o de produção, inclusive a verificação de SHA e health, no grupo `stardust-web-staging` | `server-app-production-cd.yml`; `web-app-staging-cd.yaml` e o E2E de release compartilham o grupo | Workflow mínimo só com webhook | Reseed nunca acontece durante o E2E de release |

## Conceitos novos

### Fatos de progresso (profile)

- `users_completed_stars (user_id, star_id, created_at)`, PK `(user_id, star_id)`, FKs para `users` e
  `stars` com `ON DELETE CASCADE`. Escrito só por `CompleteStarUseCase`, chamado pelas rotas de
  recompensa depois da guarda.
- `users_opened_planets (user_id, planet_id, created_at)`, PK `(user_id, planet_id)`, FKs para `users`
  e `planets` com `ON DELETE CASCADE`. Escrito só por `OpenPlanetUseCase`.
- Fonte de verdade da progressão. Nunca há atualização ou remoção em runtime; o reset acontece só na
  migration `0007`.
- `User.completedStarsIds` e `User.openedPlanetsIds` (`IdsList`) chegam pelo `UserDto`;
  `completeStar`/`openPlanet` não duplicam.

### Trilha da galáxia (`GalaxyTrail`, space)

Structure imutável criada por `GalaxyTrail.create({ planets: Planet[], completedStarsIds: IdsList,
openedPlanetsIds: IdsList })`. Os planetas são ordenados por `position` e as estrelas por `number`.

| Membro | Retorno | Regra |
| --- | --- | --- |
| `getPlanetState(planetId: Id)` | `PlanetProgressState` | `opened` se há fato; senão `liberated` se for o primeiro planeta ou se o anterior estiver concluído; senão `locked` |
| `getStarState(starId: Id)` | `StarProgressState` | `completed` se há fato; senão `available` se o planeta está `opened` e a estrela é a primeira ou a anterior está concluída; senão `locked` |
| `canAccessStar(starId: Id)` | `Logical` | `available` ou `completed` |
| `canOpenPlanet(planetId: Id)` | `Logical` | `liberated` |
| `isPlanetCompleted(planetId: Id)` | `Logical` | todas as estrelas concluídas e ao menos uma estrela |
| `countCompletedStars(planetId: Id)` | `Integer` | estrelas do planeta com fato |
| `completedPlanetsIds` | `IdsList` | planetas concluídos |
| `currentItem` | `{ kind: 'star'; starId: Id } \| { kind: 'planet'; planetId: Id } \| null` | primeira estrela não concluída na ordem; se seu planeta não está aberto, o planeta; `null` sem estrela pendente |
| `isCompleted` | `Logical` | há estrelas e todas estão concluídas |
| `isLastStar(starId: Id)` | `Logical` | última estrela do último planeta |
| `isLastStarOfPlanet(starId: Id)` | `Logical` | última estrela do seu planeta |

Exemplo: planetas `[Aurora(4), Trívia(4)]`, fatos `{ abertos: [Aurora], concluídas: [A1, A2, A3, A4] }`
→ Aurora `opened`, Trívia `liberated`, estrelas de Trívia `locked`, item atual `{ planet: Trívia }`.

Um planeta aberto continua aberto mesmo que o anterior deixe de estar concluído (estrela inserida
pelo editor); a estrela inserida fica disponível quando a anterior está concluída. Estados inválidos
nas structures lançam `ValidationError` do Core.

### Conclusão de estrela (`GetStarCompletionUseCase`, space)

Carrega a estrela, seu planeta e os planetas da mesma galáxia, cria `GalaxyTrail` com os fatos
recebidos e: lança `StarNotFoundError` se não existe; `StarLockedError` se `canAccessStar` é falso;
devolve `isAlreadyCompleted` (fato já existe), `isLastGalaxyStar` (`isLastStar`), `isFirstGalaxy`
(galáxia do planeta = `galaxiesRepository.findFirst()`) e `completedPlanetName` (nome do planeta
quando `isLastStarOfPlanet`, senão `null`). É somente leitura e não publica eventos: roda na guarda,
antes da validação e da gravação. Dependências: `StarsRepository`, `PlanetsRepository`,
`GalaxiesRepository`.

`CompleteStarUseCase` (profile) carrega o usuário, grava a conclusão só se `hasCompletedStar` é
falso e, só depois de gravar e com `completedPlanetName` não nulo, publica `PlanetCompletedEvent`
(payload atual: `userName`, `userSlug` do usuário carregado e `planetName`), como
`CompleteSpaceUseCase` faz com `SpaceCompletedEvent`. Repetição não grava nem publica.
Dependências: `UsersRepository`, `Broker`.

### Abertura de planeta (`GetPlanetOpeningUseCase`, space; `OpenPlanetUseCase`, profile)

`GetPlanetOpeningUseCase` carrega o planeta e os planetas da sua galáxia (`PlanetsRepository.findById`,
`findAllByGalaxy`), lança `PlanetNotFoundError` ou `PlanetLockedError` (estado `locked`) e devolve
`isAlreadyOpened`. `OpenPlanetUseCase` carrega o usuário e grava o fato só se `hasOpenedPlanet` é
falso. Dependências: `PlanetsRepository` (space); `UsersRepository` (profile).

### Contexto da trilha (Web, `SpaceContext`)

- **Dono:** `SpaceProvider`, montado só em `apps/web/src/app/(home)/space/[galaxySlug]/page.tsx`.
- **Entradas:** `planetsDto`, `currentGalaxy` (props) e `user` (`AuthContext`).
- **Valor:** `planets`, `galaxy`, `isFirstGalaxy`, `hasGalaxyChoice`, `trail: GalaxyTrail | null`
  (`null` sem usuário), `currentItem`, `selectedStarId: string | null`, `selectStar(starId)`,
  `registerStarAnimation(starId, ref)`, `restartStarAnimation(starId)`, `currentItemRef`,
  `currentItemPosition: CurrentItemViewportPosition`, `scrollToCurrentItem()`,
  `getCurrentItemLayoutSnapshot()`, `setCurrentItemPosition(position)` e `refreshTrail()`
  (recarrega o usuário).
- **Fonte de verdade:** os fatos do usuário; o context não guarda estado de progresso próprio.
  `selectedStarId` começa como a estrela atual (quando o item atual é estrela) e é estado de UI.
- **Direção:** `Planet`/`Star`/`StarDetails` leem o context no Entry Point; hooks de widget recebem
  valores por parâmetro; `useOpenPlanetAction` é chamado no Entry Point de `Planet`.
- **Ciclo de vida:** o registro de animações guarda refs por estrela e remove a entrada no
  desmontar; a rolagem usa listeners de scroll da janela e do ancestral rolável, removidos no
  desmontar (como `useLastUnlockedStarScroll`).

### Ação de abrir planeta (Web, `useOpenPlanetAction`)

Hook de action em `apps/web/src/ui/space/hooks/`: lê `profileService` do `RestContext`, expõe
`openPlanet(planetId)` e `openingPlanetId`, lança o erro da resposta com falha e não tem teste
dedicado (consumidor: `usePlanet`, AV-06; jornada: AV-07). Toast, recarga do usuário e o sinal
`justOpened` pertencem a `usePlanet`.

### Cadeado do planeta (Web, `PlanetLock`)

`usePlanetLock({ planetState, isJustOpened, isReducedMotion })` devolve a fase: `static` (bloqueado ou
movimento reduzido), `loop` (liberado), `opening` (uma vez após sucesso), `fade` (abertura com
movimento reduzido ou falha de carga), `hidden` (aberto). A falha de carga vem de `onLoadError` do
Lottie. `planet-lock.json` tem marcadores `idle`, `loop` e `open`.

## Expected file tree

```text
packages/core/
└── src/
    ├── global/domain/errors/
    │   ├── ForbiddenError.ts                                                                    [N]
    │   └── index.ts                                                                             [M]
    ├── space/
    │   ├── domain/
    │   │   ├── structures/
    │   │   │   ├── GalaxyTrail.ts                                                               [N]
    │   │   │   ├── StarProgressState.ts                                                         [N]
    │   │   │   ├── PlanetProgressState.ts                                                       [N]
    │   │   │   ├── index.ts                                                                     [M]
    │   │   │   └── tests/
    │   │   │       ├── GalaxyTrail.test.ts                                                      [N]
    │   │   │       ├── StarProgressState.test.ts                                                [N]
    │   │   │       └── PlanetProgressState.test.ts                                              [N]
    │   │   ├── errors/
    │   │   │   ├── StarLockedError.ts                                                           [N]
    │   │   │   ├── PlanetLockedError.ts                                                         [N]
    │   │   │   └── index.ts                                                                     [M]
    │   │   ├── entities/
    │   │   │   ├── Star.ts                                                                      [M]
    │   │   │   ├── dtos/
    │   │   │   │   ├── StarDto.ts                                                               [M]
    │   │   │   │   └── PlanetDto.ts                                                             [M]
    │   │   │   ├── Planet.ts                                                                    [M]
    │   │   │   ├── fakers/
    │   │   │   │   ├── StarsFaker.ts                                                            [M]
    │   │   │   │   └── PlanetsFaker.ts                                                          [M]
    │   │   │   └── tests/
    │   │   │       ├── Star.test.ts                                                             [M]
    │   │   │       └── Planet.test.ts                                                           [M]
    │   │   └── events/
    │   │       ├── SpaceOrderChangedEvent.ts                                                    [D]
    │   │       └── index.ts                                                                     [M]
    │   └── use-cases/
    │       ├── GetPlanetOpeningUseCase.ts                                                       [N]
    │       ├── GetStarCompletionUseCase.ts                                                      [N]
    │       ├── HandleStarsNewOrderUseCase.ts                                                    [D]
    │       ├── tests/
    │       │   ├── HandleStarsNewOrderUseCase.test.ts                                           [D]
    │       │   ├── GetPlanetOpeningUseCase.test.ts                                              [N]
    │       │   ├── GetStarCompletionUseCase.test.ts                                             [N]
    │       │   └── GetNextStarUseCase.test.ts                                                   [D]
    │       ├── GetNextStarUseCase.ts                                                            [D]
    │       └── index.ts                                                                         [M]
    └── profile/
        ├── domain/
        │   ├── entities/
        │   │   ├── User.ts                                                                      [M]
        │   │   ├── dtos/
        │   │   │   └── UserDto.ts                                                               [M]
        │   │   ├── fakers/
        │   │   │   └── UsersFaker.ts                                                            [M]
        │   │   └── tests/
        │   │       └── User.test.ts                                                             [M]
        │   └── events/
        │       ├── StarUnlockedEvent.ts                                                         [D]
        │       └── index.ts                                                                     [M]
        ├── factories/
        │   └── UserFactory.ts                                                                   [M]
        ├── interfaces/
        │   ├── UsersRepository.ts                                                               [M]
        │   └── ProfileService.ts                                                                [M]
        └── use-cases/
            ├── CompleteStarUseCase.ts                                                           [N]
            ├── OpenPlanetUseCase.ts                                                             [N]
            ├── UnlockStarUseCase.ts                                                             [D]
            ├── RemoveRecentlyUnlockedStarUseCase.ts                                             [D]
            ├── UpdateSpaceForAllUsersUseCase.ts                                                 [D]
            ├── CalculateRewardForStarCompletionUseCase.ts                                       [M]
            ├── CompleteSpaceUseCase.ts                                                          [M]
            ├── GetUnlockedStarsKpiUseCase.ts                                                    [M]
            ├── index.ts                                                                         [M]
            ├── tests/
            │   ├── CompleteStarUseCase.test.ts                                                  [N]
            │   ├── OpenPlanetUseCase.test.ts                                                    [N]
            │   ├── UnlockStarUse.test.ts                                                        [D]
            │   ├── RemoveRecentlyUnlockedStarUseCase.test.ts                                    [D]
            │   ├── UpdateSpaceForAllUsersUseCase.test.ts                                        [D]
            │   ├── CalculateRewardForStarCompletionUseCase.test.ts                              [M]
            │   ├── CompleteSpaceUseCase.test.ts                                                 [M]
            │   ├── GetUnlockedStarsKpiUseCase.test.ts                                           [M]
            │   ├── ObserveNewUnlockedAchievementsUseCase.test.ts                                [M]
            │   └── EnterGalaxyUseCase.test.ts                                                   [M]
            └── ObserveNewUnlockedAchievementsUseCase.ts                                         [M]
```

```text
apps/server/
├── src/
│   ├── database/
│   │   ├── drizzle/
│   │   │   ├── models/
│   │   │   │   ├── profile/
│   │   │   │   │   ├── user-completed-star-model.ts                                             [N]
│   │   │   │   │   ├── user-opened-planet-model.ts                                              [N]
│   │   │   │   │   ├── user-unlocked-star-model.ts                                              [D]
│   │   │   │   │   ├── user-recently-unlocked-star-model.ts                                     [D]
│   │   │   │   │   └── index.ts                                                                 [M]
│   │   │   │   └── space/
│   │   │   │       ├── star-model.ts                                                            [M]
│   │   │   │       └── planet-model.ts                                                          [M]
│   │   │   ├── types/entities/
│   │   │   │   └── profile/
│   │   │   │       └── DrizzleUser.ts                                                           [M]
│   │   │   ├── mappers/
│   │   │   │   ├── profile/
│   │   │   │   │   └── DrizzleUserMapper.ts                                                     [M]
│   │   │   │   └── space/
│   │   │   │       ├── DrizzleStarMapper.ts                                                     [M]
│   │   │   │       └── DrizzlePlanetMapper.ts                                                   [M]
│   │   │   ├── repositories/
│   │   │   │   └── profile/
│   │   │   │       └── DrizzleUsersRepository.ts                                                [M]
│   │   │   └── migrations/
│   │   │       ├── 0006_trail_progress_facts.sql                                                [G]
│   │   │       ├── 0007_galaxy_trail_catalog.sql                                                [N]
│   │   │       ├── 0008_drop_unlocked_stars.sql                                                 [G]
│   │   │       └── meta/
│   │   │           ├── 0006_snapshot.json                                                       [G]
│   │   │           ├── 0007_snapshot.json                                                       [G]
│   │   │           ├── 0008_snapshot.json                                                       [G]
│   │   │           └── _journal.json                                                            [G]
│   │   ├── supabase/
│   │   │   ├── repositories/profile/
│   │   │   │   └── SupabaseUsersRepository.ts                                                   [M]
│   │   │   └── mappers/profile/
│   │   │       └── SupabaseUserMapper.ts                                                        [M]
│   │   ├── seed.ts                                                                              [M]
│   │   └── seeders/
│   │       ├── seed-config.ts                                                                   [M]
│   │       ├── seed-data.ts                                                                     [M]
│   │       ├── ProfileSeeder.ts                                                                 [M]
│   │       ├── assets/images/planets/
│   │       │   ├── planet-aurora-image.webp                                                      [N]
│   │       │   ├── planet-trivia-image.webp                                                      [N]
│   │       │   ├── planet-kalkulon-image.webp                                                    [N]
│   │       │   ├── planet-ifthenia-image.webp                                                    [N]
│   │       │   ├── planet-ciclade-image.webp                                                     [N]
│   │       │   ├── planet-o-comboio-parte-1-image.webp                                           [N]
│   │       │   ├── planet-o-comboio-parte-2-image.webp                                           [N]
│   │       │   ├── planet-arcana-image.webp                                                      [N]
│   │       │   ├── planet-perene-image.webp                                                      [N]
│   │       │   ├── planet-chavalor-image.webp                                                    [N]
│   │       │   ├── planet-2ee862da-4b73-4fb3-984a-d6ed1743102b-image.svg                         [D]
│   │       │   ├── planet-4334d4ed-7b36-4e17-a917-7839f09f670e-image.svg                         [D]
│   │       │   ├── planet-6a4aca25-b962-4cad-9aa4-81e0a2b6c0ee-image.svg                         [D]
│   │       │   ├── planet-800775c1-b4f7-4dc7-8010-142f8dfb7ac9-image.svg                         [D]
│   │       │   ├── planet-83500701-a9b7-4f5b-8a63-599a08406f73-image.svg                         [D]
│   │       │   ├── planet-8c3b6cab-d3c6-4d64-8701-c580d4a6d31a-image.svg                         [D]
│   │       │   └── planet-af70e6c2-49b3-4bdf-a548-6512b0f5dc94-image.svg                         [D]
│   │       └── data/
│   │           └── seed-catalog.json                                                            [M]
│   ├── app/hono/
│   │   ├── middlewares/
│   │   │   ├── ProfileMiddleware.ts                                                             [M]
│   │   │   └── SpaceMiddleware.ts                                                               [M]
│   │   ├── routers/profile/
│   │   │   └── UsersRouter.ts                                                                   [M]
│   │   └── HonoApp.ts                                                                           [M]
│   ├── rest/controllers/
│   │   ├── profile/users/
│   │   │   ├── AppendUserTrailFactsToBodyController.ts                                          [N]
│   │   │   ├── OpenPlanetController.ts                                                          [N]
│   │   │   ├── RewardUserForStarCompletionController.ts                                         [M]
│   │   │   ├── RewardUserForStarChallengeCompletionController.ts                                [M]
│   │   │   ├── index.ts                                                                         [M]
│   │   │   └── tests/
│   │   │       ├── AppendUserTrailFactsToBodyController.test.ts                                 [N]
│   │   │       ├── OpenPlanetController.test.ts                                                 [N]
│   │   │       ├── RewardUserForStarCompletionController.test.ts                                [M]
│   │   │       └── RewardUserForStarChallengeCompletionController.test.ts                       [M]
│   │   └── space/
│   │       ├── planets/
│   │       │   ├── AppendOpenablePlanetToBodyController.ts                                      [N]
│   │       │   ├── index.ts                                                                     [M]
│   │       │   └── tests/
│   │       │       └── AppendOpenablePlanetToBodyController.test.ts                             [N]
│   │       └── stars/
│   │           ├── AppendStarCompletionToBodyController.ts                                      [N]
│   │           ├── AppendNextStarToBodyController.ts                                            [D]
│   │           ├── index.ts                                                                     [M]
│   │           └── tests/
│   │               ├── AppendStarCompletionToBodyController.test.ts                             [N]
│   │               └── AppendNextStarToBodyController.test.ts                                   [D]
│   ├── queue/
│   │   ├── jobs/
│   │   │   ├── profile/
│   │   │   │   ├── CreateUserJob.ts                                                             [M]
│   │   │   │   ├── tests/
│   │   │   │   │   └── CreateUserJob.test.ts                                                    [N]
│   │   │   │   ├── UpdateSpaceForAllUsersJob.ts                                                 [D]
│   │   │   │   └── index.ts                                                                     [M]
│   │   │   └── space/
│   │   │       ├── HandleStarsNewOrderJob.ts                                                    [D]
│   │   │       ├── tests/
│   │   │       │   └── HandleStarsNewOrderJob.test.ts                                           [D]
│   │   │       └── index.ts                                                                     [M]
│   │   └── inngest/functions/
│   │       ├── SpaceFunctions.ts                                                                [M]
│   │       └── AnalyticsFunctions.ts                                                            [M]
│   ├── provision/xlsx/
│   │   ├── ExcelJsXlsxProvider.ts                                                               [M]
│   │   └── tests/
│   │       └── ExcelJsXlsxProvider.test.ts                                                      [D]
│   └── tests/
│       ├── routes/
│       │   ├── profile/users/
│       │   │   ├── OpenPlanetRoute.test.ts                                                      [N]
│       │   │   ├── RewardUserForStarCompletionRoute.test.ts                                     [M]
│       │   │   ├── RewardUserForStarChallengeCompletionRoute.test.ts                            [M]
│       │   │   ├── FetchUnlockedStarsKpiRoute.test.ts                                           [M]
│       │   │   ├── FetchUserByIdRoute.test.ts                                                   [M]
│       │   │   ├── EnterGalaxyRoute.test.ts                                                     [M]
│       │   │   └── GenerateUsersXlsxFileRoute.test.ts                                           [M]
│       │   └── space/galaxies/
│       │       ├── ListGalaxyPlanetsRoute.test.ts                                               [M]
│       │       ├── ListGalaxiesRoute.test.ts                                                    [M]
│       │       └── FetchCurrentGalaxyRoute.test.ts                                              [M]
│       └── fixtures/
│           ├── SpaceFixture.ts                                                                  [M]
│           └── ProfileFixture.ts                                                                [M]
├── package.json                                                                                 [M]
└── rest-client/profile/
    └── users.rest                                                                               [M]
```

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── (home)/space/[galaxySlug]/
│   │   │   ├── loading.tsx                                                                      [N]
│   │   │   └── error.tsx                                                                        [N]
│   │   └── tests/
│   │       ├── space/
│   │       │   ├── space.test.ts                                                                [M]
│   │       │   └── galaxies.test.ts                                                             [M]
│   │       └── profile/
│   │           └── profile.test.ts                                                              [M]
│   ├── rpc/actions/
│   │   ├── space/
│   │   │   ├── isFirstStarOfCurrentGalaxy.ts                                                    [D]
│   │   │   ├── AccessStarPageAction.ts                                                          [M]
│   │   │   └── tests/
│   │   │       └── AccessStarPageAction.test.ts                                                 [M]
│   │   └── challenging/
│   │       ├── AccessChallengePageAction.ts                                                     [M]
│   │       └── tests/
│   │           └── AccessChallengePageAction.test.ts                                            [M]
│   ├── rest/services/
│   │   └── ProfileService.ts                                                                    [M]
│   └── ui/
│       ├── space/
│       │   ├── contexts/SpaceContext/
│       │   │   ├── index.tsx                                                                    [M]
│       │   │   ├── useSpaceContextProvider.ts                                                   [M]
│       │   │   ├── useCurrentItemScroll.ts                                                      [N]
│       │   │   ├── useLastUnlockedStarScroll.ts                                                 [D]
│       │   │   ├── currentItemLayout.ts                                                         [N]
│       │   │   ├── lastUnlockedStarLayout.ts                                                    [D]
│       │   │   ├── types/
│       │   │   │   ├── SpaceContextValue.ts                                                     [M]
│       │   │   │   ├── CurrentItemViewportPosition.ts                                           [N]
│       │   │   │   ├── LastUnlockedStarViewPortPosition.ts                                      [D]
│       │   │   │   └── index.ts                                                                 [M]
│       │   │   └── tests/
│       │   │       └── useSpaceContextProvider.test.ts                                          [M]
│       │   ├── hooks/
│       │   │   └── useOpenPlanetAction.ts                                                       [N]
│       │   └── widgets/pages/Space/
│       │       ├── index.tsx                                                                    [M]
│       │       ├── SpacePageView.tsx                                                            [M]
│       │       ├── useSpacePage.ts                                                              [M]
│       │       ├── fab-icon.ts                                                                  [M]
│       │       ├── tests/
│       │       │   ├── SpacePageView.test.tsx                                                   [M]
│       │       │   └── useSpacePage.test.ts                                                     [M]
│       │       ├── TrailLoading/
│       │       │   ├── index.tsx                                                                [N]
│       │       │   ├── TrailLoadingView.tsx                                                     [N]
│       │       │   └── tests/
│       │       │       └── TrailLoadingView.test.tsx                                            [N]
│       │       ├── TrailLoadFailure/
│       │       │   ├── index.tsx                                                                [N]
│       │       │   ├── TrailLoadFailureView.tsx                                                 [N]
│       │       │   └── tests/
│       │       │       └── TrailLoadFailureView.test.tsx                                        [N]
│       │       ├── TrailEmpty/
│       │       │   ├── index.tsx                                                                [N]
│       │       │   ├── TrailEmptyView.tsx                                                       [N]
│       │       │   └── tests/
│       │       │       └── TrailEmptyView.test.tsx                                              [N]
│       │       ├── StarDetails/
│       │       │   ├── index.tsx                                                                [N]
│       │       │   ├── StarDetailsView.tsx                                                      [N]
│       │       │   ├── useStarDetails.ts                                                        [N]
│       │       │   └── tests/
│       │       │       ├── StarDetailsView.test.tsx                                             [N]
│       │       │       └── useStarDetails.test.ts                                               [N]
│       │       ├── StarDetailsSheet/
│       │       │   ├── index.tsx                                                                [N]
│       │       │   ├── StarDetailsSheetView.tsx                                                 [N]
│       │       │   └── tests/
│       │       │       └── StarDetailsSheetView.test.tsx                                        [N]
│       │       └── Planet/
│       │           ├── index.tsx                                                                [M]
│       │           ├── PlanetView.tsx                                                           [M]
│       │           ├── usePlanet.ts                                                             [N]
│       │           ├── tests/
│       │           │   ├── PlanetView.test.tsx                                                  [N]
│       │           │   └── usePlanet.test.ts                                                    [N]
│       │           ├── PlanetLock/
│       │           │   ├── index.tsx                                                            [N]
│       │           │   ├── PlanetLockView.tsx                                                   [N]
│       │           │   ├── usePlanetLock.ts                                                     [N]
│       │           │   └── tests/
│       │           │       ├── PlanetLockView.test.tsx                                          [N]
│       │           │       └── usePlanetLock.test.ts                                            [N]
│       │           └── Star/
│       │               ├── index.tsx                                                            [M]
│       │               ├── StarView.tsx                                                         [M]
│       │               ├── useStar.ts                                                           [M]
│       │               ├── tests/
│       │               │   ├── StarView.test.tsx                                                [M]
│       │               │   └── useStar.test.ts                                                  [M]
│       │               └── AnimatedRocket/
│       │                   ├── index.tsx                                                        [D]
│       │                   └── AnimatedRocketView.tsx                                           [D]
│       ├── global/widgets/components/Animation/
│       │   ├── LottieAnimation/
│       │   │   └── lotties.ts                                                                   [M]
│       │   └── types/
│       │       └── AnimationName.ts                                                             [M]
│       └── profile/widgets/pages/Profile/
│           ├── ProfilePageView.tsx                                                              [M]
│           └── Statistics/
│               ├── StatisticsView.tsx                                                           [M]
│               └── tests/
│                   └── StatisticsView.test.tsx                                                  [N]
└── public/lotties/
    └── planet-lock.json                                                                         [N]
```

```text
apps/backoffice/
└── src/
    ├── rest/services/
    │   └── ProfileService.ts                                                                    [M]
    └── ui/
        ├── global/widgets/
        │   ├── pages/Dashboard/Kpis/
        │   │   ├── KpisView.tsx                                                                 [M]
        │   │   └── tests/
        │   │       └── KpisView.test.tsx                                                        [N]
        │   └── components/UsersTable/
        │       ├── UsersTableView.tsx                                                           [M]
        │       └── UsersTableSkeleton/
        │           └── UsersTableSkeletonView.tsx                                               [M]
        └── profile/widgets/components/AchievementForm/
            └── AchievementFormView.tsx                                                          [M]
```

```text
packages/studio/
└── public/projects/planet-lock/scene-1/
    └── lottie.json                                                                              [N]
```

```text
.github/
└── workflows/
    └── server-app-staging-cd.yml                                                                [N]
```

```text
scripts/
├── seed-local-assets.mjs                                                                        [M]
├── seed-staging-assets.mjs                                                                      [N]
├── tests/
│   ├── seed-staging-assets.test.mjs                                                             [N]
│   ├── galaxy-trail-migration.integration.test.mjs                                              [N]
│   ├── galaxies-migration.integration.test.mjs                                                  [M]
│   ├── seed-database.test.mjs                                                                   [M]
│   └── seed-database.integration.test.mjs                                                       [M]
└── web-quality.config.json                                                                      [M]
```

```text
documentation/
├── architecture.md                                                                              [M]
├── infrastructure.md                                                                            [M]
├── github-flow.md                                                                               [M]
└── tooling.md                                                                                   [M]
```

## Mapa canônico de paths afetados

### packages/core — global

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `packages/core/src/global/libs/validation/zod/ZodStringValidation.ts` | Modify | `image()` | Aceita `.webp` (as imagens novas dos planetas); sem isso o Server falha ao hidratar o planeta | AV-02 |
| `packages/core/src/global/domain/structures/tests/Image.test.ts` | Modify | teste | `image.webp` é válido | AV-02 |
| `packages/core/src/global/domain/errors/ForbiddenError.ts` | Create | `ForbiddenError extends AppError` | Operação proibida para a conta autenticada; a borda HTTP responde `403` | AV-04 |
| `packages/core/src/global/domain/errors/index.ts` | Modify | barrel | Exporta `ForbiddenError` | — |

### packages/core — space (domínio)

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `packages/core/src/space/domain/structures/GalaxyTrail.ts` | Create | `GalaxyTrail` (structure) | Deriva estados de estrela/planeta, item atual, contadores e conclusão a partir de `Planet[]` + `IdsList` de fatos (DT-01, conceito "Trilha da galáxia") | AV-01 |
| `packages/core/src/space/domain/structures/StarProgressState.ts` | Create | `StarProgressState` (`locked`/`available`/`completed`) | `isLocked`, `isAvailable`, `isCompleted`, `isAccessible`; valor inválido → `ValidationError` | AV-01 |
| `packages/core/src/space/domain/structures/PlanetProgressState.ts` | Create | `PlanetProgressState` (`locked`/`liberated`/`opened`) | `isLocked`, `isLiberated`, `isOpened`; valor inválido → `ValidationError` | AV-01 |
| `packages/core/src/space/domain/structures/index.ts` | Modify | barrel | Exporta as três structures novas | — |
| `packages/core/src/space/domain/structures/tests/GalaxyTrail.test.ts` | Create | teste | Regras de RF-03 e CA-01–CA-07 | AV-01 |
| `packages/core/src/space/domain/structures/tests/StarProgressState.test.ts` | Create | teste | Valores e predicados | AV-01 |
| `packages/core/src/space/domain/structures/tests/PlanetProgressState.test.ts` | Create | teste | Valores e predicados | AV-01 |
| `packages/core/src/space/domain/errors/StarLockedError.ts` | Create | `StarLockedError` | Estende `ForbiddenError`; estrela bloqueada para a conta | AV-02, AV-04 |
| `packages/core/src/space/domain/errors/PlanetLockedError.ts` | Create | `PlanetLockedError` | Estende `ForbiddenError`; planeta bloqueado não pode ser aberto | AV-02, AV-04 |
| `packages/core/src/space/domain/errors/index.ts` | Modify | barrel | Exporta os dois erros | — |
| `packages/core/src/space/domain/entities/Star.ts` | Modify | `Star.description: Text \| null` | Lido do DTO; `dto` devolve `description` | AV-01 |
| `packages/core/src/space/domain/entities/dtos/StarDto.ts` | Modify | `description?: string \| null` | Campo opcional; ausente = `null` | — |
| `packages/core/src/space/domain/entities/Planet.ts` | Modify | `Planet.concept: Text \| null` | Lido do DTO; `dto` devolve `concept`; sem `icon` (removido na revisão 7) | AV-01 |
| `packages/core/src/space/domain/entities/dtos/PlanetDto.ts` | Modify | `concept?: string \| null` | Campo opcional; ausente = `null`; sem `icon` (revisão 7) | — |
| `packages/core/src/space/domain/entities/fakers/StarsFaker.ts` | Modify | `fakeDto` | Gera `description` | — |
| `packages/core/src/space/domain/entities/fakers/PlanetsFaker.ts` | Modify | `fakeDto` | Gera `concept` | — |
| `packages/core/src/space/domain/entities/tests/Star.test.ts` | Modify | teste | `description` presente e `null` | AV-01 |
| `packages/core/src/space/domain/entities/tests/Planet.test.ts` | Modify | teste | `concept` presente e `null` | AV-01 |
| `packages/core/src/space/domain/events/SpaceOrderChangedEvent.ts` | Remove | `SpaceOrderChangedEvent` | Sem publicador nem consumidor | — |
| `packages/core/src/space/domain/events/index.ts` | Modify | barrel | Remove `SpaceOrderChangedEvent`; mantém `StarsOrderChangedEvent`/`PlanetsOrderChangedEvent` | — |

### packages/core — space (casos de uso)

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `packages/core/src/space/use-cases/GetPlanetOpeningUseCase.ts` | Create | `execute({ planetId, completedStarsIds, openedPlanetsIds }): Promise<{ planetId: string; isAlreadyOpened: boolean }>` | Carrega o planeta e os planetas da sua galáxia; `PlanetNotFoundError` ou `PlanetLockedError` | AV-02 |
| `packages/core/src/space/use-cases/GetStarCompletionUseCase.ts` | Create | `execute({ starId, completedStarsIds, openedPlanetsIds }): Promise<{ isLastGalaxyStar: boolean; isFirstGalaxy: boolean; isAlreadyCompleted: boolean; completedPlanetName: string | null }>` | `StarNotFoundError`/`StarLockedError`; somente leitura, sem `Broker`; `completedPlanetName` é o nome do planeta quando a estrela é a última dele | AV-02 |
| `packages/core/src/space/use-cases/HandleStarsNewOrderUseCase.ts` | Remove | `HandleStarsNewOrderUseCase` | Job de reordenação removido (Q8); `SpaceOrderChangedEvent` não tem consumidor | — |
| `packages/core/src/space/use-cases/tests/HandleStarsNewOrderUseCase.test.ts` | Remove | teste | Sai com o caso de uso | — |
| `packages/core/src/space/use-cases/GetNextStarUseCase.ts` | Remove | `GetNextStarUseCase` | Substituído por `GetStarCompletionUseCase` | — |
| `packages/core/src/space/use-cases/index.ts` | Modify | barrel | Exporta os novos; remove `GetNextStarUseCase` e `HandleStarsNewOrderUseCase` | — |
| `packages/core/src/space/use-cases/tests/GetPlanetOpeningUseCase.test.ts` | Create | teste | Liberado, aberto, bloqueado, inexistente | AV-02 |
| `packages/core/src/space/use-cases/tests/GetStarCompletionUseCase.test.ts` | Create | teste | Disponível, concluída, bloqueada, última da galáxia, última do planeta; nenhum evento publicado | AV-02 |
| `packages/core/src/space/use-cases/tests/GetNextStarUseCase.test.ts` | Remove | teste | Sai com o caso de uso | — |
| `packages/core/src/space/use-cases/CreatePlanetUseCase.ts` | Modify | `CreatePlanetUseCase` | Sem `icon` na requisição | AV-02 |
| `packages/core/src/space/use-cases/UpdatePlanetUseCase.ts` | Modify | `UpdatePlanetUseCase` | Sem `icon` na requisição | AV-02 |
| `packages/core/src/space/use-cases/tests/CreatePlanetUseCase.test.ts` | Modify | teste | Sem `icon` | AV-02 |
| `packages/core/src/space/use-cases/tests/UpdatePlanetUseCase.test.ts` | Modify | teste | Atualização parcial por `image` | AV-02 |
| `packages/core/src/space/interfaces/SpaceService.ts` | Modify | `createPlanet(planetName, planetImage)` | Sem `planetIcon` | — |

### packages/core — profile

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `packages/core/src/profile/domain/entities/User.ts` | Modify | `completedStarsIds`, `openedPlanetsIds`, `hasCompletedStar(id)`, `hasOpenedPlanet(id)`, `completeStar(id)`, `openPlanet(id)`, `completedStarsCount` | Remove `unlockedStarsIds`, `recentlyUnlockedStarsIds`, `unlockStar`, `hasUnlockedStar`, `hasRecentlyUnlockedStar`, `unlockedStarsCount`; métrica `unlockedStarsCount` passa a ler `completedStarsCount` | AV-01 |
| `packages/core/src/profile/domain/entities/dtos/UserDto.ts` | Modify | `completedStarsIds: string[]`, `openedPlanetsIds: string[]` | Substituem `unlockedStarsIds` e `recentlyUnlockedStarsIds` | — |
| `packages/core/src/profile/domain/entities/fakers/UsersFaker.ts` | Modify | `fakeDto` | Gera os fatos novos | — |
| `packages/core/src/profile/domain/entities/tests/User.test.ts` | Modify | teste | Idempotência de `completeStar`/`openPlanet`, contagem | AV-01 |
| `packages/core/src/profile/factories/UserFactory.ts` | Modify | `produce` | Monta as listas novas | — |
| `packages/core/src/profile/interfaces/UsersRepository.ts` | Modify | `addCompletedStar(starId: Id, userId: Id): Promise<void>`, `addOpenedPlanet(planetId: Id, userId: Id): Promise<void>`, `countAllCompletedStars(): Promise<Integer>`, `countCompletedStarsByMonth(): Promise<Integer>` | Remove `findUnlockedStars`, `findRecentlyUnlockedStars`, `addUnlockedStar`, `addRecentlyUnlockedStar`, `removeRecentlyUnlockedStar`, `countAllUnlockedStars`, `countUnlockedStarsByMonth` | — |
| `packages/core/src/profile/interfaces/ProfileService.ts` | Modify | `openPlanet(planetId: Id): Promise<RestResponse<{ openedPlanetId: string }>>` | Novo método REST | — |
| `packages/core/src/profile/use-cases/CompleteStarUseCase.ts` | Create | `execute({ userId, starId, completedPlanetName }): Promise<void>` | Grava a conclusão só se ainda não existe; só então, com `completedPlanetName` não nulo, publica `PlanetCompletedEvent` (nome e slug do usuário carregado) | AV-02 |
| `packages/core/src/profile/use-cases/OpenPlanetUseCase.ts` | Create | `execute({ userId, planetId }): Promise<{ openedPlanetId: string }>` | Grava a abertura só se ainda não existe | AV-02 |
| `packages/core/src/profile/use-cases/UnlockStarUseCase.ts` | Remove | `UnlockStarUseCase` | Não há desbloqueio gravado | — |
| `packages/core/src/profile/use-cases/RemoveRecentlyUnlockedStarUseCase.ts` | Remove | `RemoveRecentlyUnlockedStarUseCase` | Indicador removido (Q8) | — |
| `packages/core/src/profile/use-cases/UpdateSpaceForAllUsersUseCase.ts` | Remove | `UpdateSpaceForAllUsersUseCase` | Disponibilidade derivada (Q8) | — |
| `packages/core/src/profile/use-cases/CalculateRewardForStarCompletionUseCase.ts` | Modify | `execute({ ..., isAlreadyCompleted })` | Mesma fórmula; metade quando a estrela já estava concluída | AV-02 |
| `packages/core/src/profile/use-cases/CompleteSpaceUseCase.ts` | Modify | `execute({ userId, isLastGalaxyStar, isFirstGalaxy })` | Marca `has_completed_space` na primeira conclusão da última estrela da primeira galáxia | AV-02 |
| `packages/core/src/profile/use-cases/GetUnlockedStarsKpiUseCase.ts` | Modify | `execute()` | Conta estrelas concluídas (total e mês) | AV-02 |
| `packages/core/src/profile/use-cases/index.ts` | Modify | barrel | Exporta os novos; remove os três removidos | — |
| `packages/core/src/profile/use-cases/tests/CompleteStarUseCase.test.ts` | Create | teste | Grava uma vez; repetição sem escrita nem evento; evento só na conclusão que fecha o planeta | AV-02 |
| `packages/core/src/profile/use-cases/tests/OpenPlanetUseCase.test.ts` | Create | teste | Grava uma vez; repetição sem escrita | AV-02 |
| `packages/core/src/profile/use-cases/tests/UnlockStarUse.test.ts` | Remove | teste | Sai com o caso de uso | — |
| `packages/core/src/profile/use-cases/tests/RemoveRecentlyUnlockedStarUseCase.test.ts` | Remove | teste | Sai com o caso de uso | — |
| `packages/core/src/profile/use-cases/tests/UpdateSpaceForAllUsersUseCase.test.ts` | Remove | teste | Sai com o caso de uso | — |
| `packages/core/src/profile/use-cases/tests/CalculateRewardForStarCompletionUseCase.test.ts` | Modify | teste | Metade em revisão de estrela concluída | AV-02 |
| `packages/core/src/profile/use-cases/tests/CompleteSpaceUseCase.test.ts` | Modify | teste | Última estrela da primeira galáxia; outras galáxias não marcam | AV-02 |
| `packages/core/src/profile/use-cases/tests/GetUnlockedStarsKpiUseCase.test.ts` | Modify | teste | Usa as contagens de conclusão | AV-02 |
| `packages/core/src/profile/use-cases/ObserveNewUnlockedAchievementsUseCase.ts` | Modify | `isNewUnlockedAchievement` | Métrica `unlockedStarsCount` compara `user.completedStarsCount` | AV-02 |
| `packages/core/src/profile/use-cases/tests/ObserveNewUnlockedAchievementsUseCase.test.ts` | Modify | teste | Métrica `unlockedStarsCount` lê estrelas concluídas | AV-02 |
| `packages/core/src/profile/use-cases/tests/EnterGalaxyUseCase.test.ts` | Modify | teste | Fakers com os fatos novos; comportamento inalterado | AV-02 |
| `packages/core/src/profile/domain/events/StarUnlockedEvent.ts` | Remove | `StarUnlockedEvent` | Não há fato de desbloqueio (DT-07) | — |
| `packages/core/src/profile/domain/events/index.ts` | Modify | barrel | Remove `StarUnlockedEvent` | — |

### apps/server — database

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/server/src/database/drizzle/models/profile/user-completed-star-model.ts` | Create | `usersCompletedStars` (`users_completed_stars`) | PK `(user_id, star_id)`, FKs `ON DELETE CASCADE`, `created_at` | AV-04, AV-05 |
| `apps/server/src/database/drizzle/models/profile/user-opened-planet-model.ts` | Create | `usersOpenedPlanets` (`users_opened_planets`) | PK `(user_id, planet_id)`, FKs `ON DELETE CASCADE`, `created_at` | AV-04, AV-05 |
| `apps/server/src/database/drizzle/models/profile/user-unlocked-star-model.ts` | Remove | `usersUnlockedStars` | Tabela removida em `0008` | AV-05 |
| `apps/server/src/database/drizzle/models/profile/user-recently-unlocked-star-model.ts` | Remove | `usersRecentlyUnlockedStars` | Tabela removida em `0008` | AV-05 |
| `apps/server/src/database/drizzle/models/profile/index.ts` | Modify | barrel | Exporta os models novos; remove os antigos | — |
| `apps/server/src/database/drizzle/models/space/star-model.ts` | Modify | `description: text` | Coluna anulável | AV-05 |
| `apps/server/src/database/drizzle/models/space/planet-model.ts` | Modify | `concept: text` | Coluna anulável; sem `icon` (removida em `0009`) | AV-05 |
| `apps/server/src/database/drizzle/types/entities/profile/DrizzleUser.ts` | Modify | tipo de linha | Fatos novos no lugar dos antigos | — |
| `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts` | Modify | `toEntity` | `completedStarsIds`, `openedPlanetsIds`; `completedPlanetsIds` vem da view redefinida | AV-04 |
| `apps/server/src/database/drizzle/mappers/space/DrizzleStarMapper.ts` | Modify | `toEntity`/`toPersistence` | `description` | AV-04 |
| `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts` | Modify | `toEntity`/`toPersistence` | `concept` | AV-04 |
| `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts` | Modify | `addCompletedStar`, `addOpenedPlanet`, `countAllCompletedStars`, `countCompletedStarsByMonth` | `addCompletedStar`/`addOpenedPlanet` chamam `authorizeOwner(userId)` e usam `INSERT … ON CONFLICT DO NOTHING`; seleção dos fatos; ordenação `unlockedStarCountOrder` usa `count_user_completed_stars` | AV-04 |
| `apps/server/src/database/drizzle/migrations/0006_trail_progress_facts.sql` | Generate | `db:generate -- --name trail_progress_facts` | Cria as duas tabelas de fatos, `stars.description`, `planets.concept` | AV-05 |
| `apps/server/src/database/drizzle/migrations/0007_galaxy_trail_catalog.sql` | Create | migration customizada (`db:generate -- --custom --name galaxy_trail_catalog`) | Arquiva a trilha anterior, insere os 10 planetas e 41 estrelas, zera `has_completed_space`, recria/remove objetos SQL dependentes, revoga acesso; SQL inverso no cabeçalho | AV-05 |
| `apps/server/src/database/drizzle/migrations/0008_drop_unlocked_stars.sql` | Generate | `db:generate -- --name drop_unlocked_stars` | Remove `users_unlocked_stars` e `users_recently_unlocked_stars` | AV-05 |
| `apps/server/src/database/drizzle/migrations/meta/0006_snapshot.json` | Generate | snapshot | Gerado com `0006` | — |
| `apps/server/src/database/drizzle/migrations/meta/0007_snapshot.json` | Generate | snapshot | Gerado com `0007` | — |
| `apps/server/src/database/drizzle/migrations/meta/0008_snapshot.json` | Generate | snapshot | Gerado com `0008` | — |
| `apps/server/src/database/drizzle/migrations/meta/_journal.json` | Generate | journal | Quatro entradas novas (`0006`–`0009`), em ordem | AV-05 |
| `apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts` | Modify | adapter legado | Métodos novos lançam `MethodNotImplementedError`; removidos saem (DT-08) | — |
| `apps/server/src/database/supabase/mappers/profile/SupabaseUserMapper.ts` | Modify | adapter legado | Devolve listas de fatos vazias | — |
| `apps/server/src/database/drizzle/migrations/0009_drop_planet_icon.sql` | Generate | `db:generate -- --name drop_planet_icon` | Remove `planets.icon` | AV-05 |
| `apps/server/src/database/drizzle/migrations/meta/0009_snapshot.json` | Generate | snapshot | Gerado com `0009` | — |
| `apps/server/src/database/supabase/mappers/space/SupabasePlanetMapper.ts` | Modify | adapter legado | Sem `icon` no DTO; `icon` vazio apenas para satisfazer os tipos legados | — |
| `apps/server/src/database/supabase/repositories/space/SupabasePlanetsRepository.ts` | Modify | adapter legado | Sem `icon` do domínio; `icon` vazio apenas para satisfazer os tipos legados | — |

### apps/server — seed

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/server/src/database/seed.ts` | Modify | CLI `--environment local\|staging` | Escolhe a guarda e as senhas; fluxo de limpeza e carga inalterado | AV-05 |
| `apps/server/src/database/seeders/seed-config.ts` | Modify | `readSeedConfig(environment, target)` | Local: guarda de loopback e fixture; staging: projeto `rveubqzvfbqbcpmuevnm`, nunca `aukqejqsiqsqowafpppb`, `MODE` ≠ `production`, senhas de `SEED_EXPLORER_PASSWORD`/`SEED_ADMIN_PASSWORD` | AV-05 |
| `apps/server/src/database/seeders/seed-data.ts` | Modify | `seedProfileProgress` | Não grava progresso inicial | AV-05 |
| `apps/server/src/database/seeders/ProfileSeeder.ts` | Modify | tabelas limpas | Troca as tabelas antigas pelas de fatos | AV-05 |
| `apps/server/src/database/seeders/data/seed-catalog.json` | Modify | catálogo local | Mesmos UUIDs, slugs e textos de `0007`; trilha anterior em `trilha-anterior`; `image` de cada planeta novo e arquivado aponta para `planet-<slug>-image.webp` | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-aurora-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-trivia-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-kalkulon-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-ifthenia-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-ciclade-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-o-comboio-parte-1-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-o-comboio-parte-2-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-arcana-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-perene-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-chavalor-image.webp` | Create | imagem do planeta | WebP animado 256 × 256 em loop, fundo transparente; o planeta fica parado e só os elementos ao redor se movem | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-2ee862da-4b73-4fb3-984a-d6ed1743102b-image.svg` | Remove | imagem antiga | Sem referência no catálogo | — |
| `apps/server/src/database/seeders/assets/images/planets/planet-4334d4ed-7b36-4e17-a917-7839f09f670e-image.svg` | Remove | imagem antiga | Sem referência no catálogo | — |
| `apps/server/src/database/seeders/assets/images/planets/planet-6a4aca25-b962-4cad-9aa4-81e0a2b6c0ee-image.svg` | Remove | imagem antiga | Sem referência no catálogo | — |
| `apps/server/src/database/seeders/assets/images/planets/planet-800775c1-b4f7-4dc7-8010-142f8dfb7ac9-image.svg` | Remove | imagem antiga | Sem referência no catálogo | — |
| `apps/server/src/database/seeders/assets/images/planets/planet-83500701-a9b7-4f5b-8a63-599a08406f73-image.svg` | Remove | imagem antiga | Sem referência no catálogo | — |
| `apps/server/src/database/seeders/assets/images/planets/planet-8c3b6cab-d3c6-4d64-8701-c580d4a6d31a-image.svg` | Remove | imagem antiga | Sem referência no catálogo | — |
| `apps/server/src/database/seeders/assets/images/planets/planet-af70e6c2-49b3-4bdf-a548-6512b0f5dc94-image.svg` | Remove | imagem antiga | Sem referência no catálogo | — |
| `apps/server/package.json` | Modify | script `db:seed:staging` | `tsx src/database/seed.ts --environment staging` sem `.env.local` | AV-08 |
| `apps/server/src/database/seeders/assets/images/planets/planet-2ee862da-4b73-4fb3-984a-d6ed1743102b-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-4334d4ed-7b36-4e17-a917-7839f09f670e-image.svg-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-6a4aca25-b962-4cad-9aa4-81e0a2b6c0ee-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-800775c1-b4f7-4dc7-8010-142f8dfb7ac9-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-83500701-a9b7-4f5b-8a63-599a08406f73-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-8c3b6cab-d3c6-4d64-8701-c580d4a6d31a-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-af70e6c2-49b3-4bdf-a548-6512b0f5dc94-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-eb67c91b-d17e-41d8-ac10-b9bdd7fbf299-icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |
| `apps/server/src/database/seeders/assets/images/planets/planet-f0fa99e3-d5fb-4ff0-8c29-a3fc7cff21e8.icon.svg` | Remove | ícone antigo | Planetas não têm mais ícone | AV-05 |

### apps/server — borda HTTP

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/server/src/app/hono/middlewares/ProfileMiddleware.ts` | Modify | `appendUserTrailFactsToBody` | Estende o corpo com os fatos da conta da sessão | AV-04 |
| `apps/server/src/app/hono/middlewares/SpaceMiddleware.ts` | Modify | `appendOpenablePlanetToBody`, `appendStarCompletionToBody` | Remove `appendNextStarToBody` | AV-04 |
| `apps/server/src/app/hono/routers/profile/UsersRouter.ts` | Modify | `PUT /planets/:planetId/open`; cadeias de `reward/star` e `reward/star-challenge` | Conta sempre da sessão; validação de `planetId` com `idSchema` | AV-04 |
| `apps/server/rest-client/profile/users.rest` | Modify | exemplo HTTP | `PUT /profile/users/planets/:planetId/open` | — |
| `apps/server/src/app/hono/routers/space/PlanetsRouter.ts` | Modify | `POST`/`PUT /space/planets` | Corpo sem `icon` | AV-04 |
| `apps/server/rest-client/space/planets.rest` | Modify | exemplo HTTP | Corpo sem `icon` | — |

### apps/server — controllers

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/server/src/rest/controllers/profile/users/AppendUserTrailFactsToBodyController.ts` | Create | `handle(http)` | `extendBody({ completedStarsIds, openedPlanetsIds })` e `pass()` | AV-03 |
| `apps/server/src/rest/controllers/profile/users/OpenPlanetController.ts` | Create | `handle(http)` | Chama `OpenPlanetUseCase`; `200 { openedPlanetId }` | AV-03 |
| `apps/server/src/rest/controllers/profile/users/RewardUserForStarCompletionController.ts` | Modify | `handle(http)` | `CompleteStarUseCase` (com `completedPlanetName` do corpo) no lugar de `UnlockStarUseCase`/`RemoveRecentlyUnlockedStarUseCase`; `CompleteSpaceUseCase`; recompensa com `isAlreadyCompleted` | AV-03 |
| `apps/server/src/rest/controllers/profile/users/RewardUserForStarChallengeCompletionController.ts` | Modify | `handle(http)` | Idem para estrela de desafio; `CompleteChallengeUseCase` inalterado | AV-03 |
| `apps/server/src/rest/controllers/profile/users/index.ts` | Modify | barrel | Exporta os dois novos | — |
| `apps/server/src/rest/controllers/profile/users/tests/AppendUserTrailFactsToBodyController.test.ts` | Create | teste | Corpo estendido | AV-03 |
| `apps/server/src/rest/controllers/profile/users/tests/OpenPlanetController.test.ts` | Create | teste | Delegação e resposta | AV-03 |
| `apps/server/src/rest/controllers/profile/users/CompleteSpaceController.ts` | Modify | `handle(http)` | Corpo com `isLastGalaxyStar` e `isFirstGalaxy` opcionais; `CompleteSpaceUseCase` recebe `{ userId, isLastGalaxyStar, isFirstGalaxy }` | AV-03 |
| `apps/server/src/rest/controllers/profile/users/tests/CompleteSpaceController.test.ts` | Modify | teste | Corpo completo e padrões dos campos opcionais | AV-03 |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForStarCompletionController.test.ts` | Modify | teste | Conclui; nunca desbloqueia | AV-03 |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForStarChallengeCompletionController.test.ts` | Modify | teste | Conclui; nunca desbloqueia | AV-03 |
| `apps/server/src/rest/controllers/space/planets/AppendOpenablePlanetToBodyController.ts` | Create | `handle(http)` | Chama `GetPlanetOpeningUseCase`; `extendBody({ planetId, isAlreadyOpened })` | AV-03 |
| `apps/server/src/rest/controllers/space/planets/index.ts` | Modify | barrel | Exporta o novo | — |
| `apps/server/src/rest/controllers/space/planets/tests/AppendOpenablePlanetToBodyController.test.ts` | Create | teste | Corpo estendido; erro propagado | AV-03 |
| `apps/server/src/rest/controllers/space/stars/AppendStarCompletionToBodyController.ts` | Create | `handle(http)` | Chama `GetStarCompletionUseCase`; `extendBody({ isLastGalaxyStar, isFirstGalaxy, isAlreadyCompleted, completedPlanetName })` | AV-03 |
| `apps/server/src/rest/controllers/space/stars/AppendNextStarToBodyController.ts` | Remove | `AppendNextStarToBodyController` | Substituído | — |
| `apps/server/src/rest/controllers/space/stars/index.ts` | Modify | barrel | Troca o export | — |
| `apps/server/src/rest/controllers/space/stars/tests/AppendStarCompletionToBodyController.test.ts` | Create | teste | Corpo estendido; erro propagado | AV-03 |
| `apps/server/src/rest/controllers/space/stars/tests/AppendNextStarToBodyController.test.ts` | Remove | teste | Sai com o controller | — |
| `apps/server/src/rest/controllers/space/planets/CreatePlanetController.ts` | Modify | `handle(http)` | Corpo sem `icon` | AV-03 |
| `apps/server/src/rest/controllers/space/planets/UpdatePlanetController.ts` | Modify | `handle(http)` | Corpo sem `icon` | AV-03 |
| `apps/server/src/rest/controllers/space/planets/tests/CreatePlanetController.test.ts` | Modify | teste | Sem `icon` | AV-03 |
| `apps/server/src/rest/controllers/space/planets/tests/UpdatePlanetController.test.ts` | Modify | teste | Sem `icon` | AV-03 |

### apps/server — app

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/server/src/app/hono/HonoApp.ts` | Modify | tratamento de erros | `ForbiddenError` → `403`, antes do fallback `500` | AV-04 |
| `apps/server/src/app/hono/HonoHttp.ts` | Modify | `getBody` | Tolera corpo vazio (`PUT …/open` não tem corpo) lendo-o por `readJsonBody()` | AV-04 |

### apps/server — queue e provision

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/server/src/queue/jobs/profile/CreateUserJob.ts` | Modify | `handle(amqp)` | Não grava estrela; mantém o restante da criação | AV-03 |
| `apps/server/src/queue/jobs/profile/tests/CreateUserJob.test.ts` | Create | teste | Nenhum fato de progresso gravado; criação, foguetes, avatares e `FinishUserCreationUseCase` executados via `amqp.run` | AV-03 |
| `apps/server/src/queue/jobs/space/HandleStarsNewOrderJob.ts` | Remove | `HandleStarsNewOrderJob` | Job de reordenação removido (Q8) | — |
| `apps/server/src/queue/jobs/space/tests/HandleStarsNewOrderJob.test.ts` | Remove | teste | Sai com o job | — |
| `apps/server/src/queue/jobs/space/index.ts` | Modify | barrel | Remove `HandleStarsNewOrderJob` | — |
| `apps/server/src/queue/inngest/functions/SpaceFunctions.ts` | Modify | `getFunctions` | Remove `createHandleStarsNewOrderFunction`; mantém `UnlockFirstStarJob` | AV-09 |
| `apps/server/src/queue/jobs/profile/UpdateSpaceForAllUsersJob.ts` | Remove | `UpdateSpaceForAllUsersJob` | Job sem registro no Inngest e sem caso de uso | — |
| `apps/server/src/queue/jobs/profile/index.ts` | Modify | barrel | Remove o export | — |
| `apps/server/src/queue/inngest/functions/tests/InngestFunctionsAssembly.test.ts` | Modify | teste de montagem | Sem as funções removidas (`HandleStarsNewOrderJob`) | AV-09 |
| `apps/server/src/queue/inngest/functions/AnalyticsFunctions.ts` | Modify | funções de analytics | Remove o mapeamento de `StarUnlockedEvent`; mantém `FirstStarUnlockedEvent`, `PlanetCompletedEvent`, `SpaceCompletedEvent` | AV-09 |
| `apps/server/src/provision/xlsx/ExcelJsXlsxProvider.ts` | Modify | linha da planilha de usuários | Usa `completedStarsCount` | AV-04 |
| `apps/server/src/provision/xlsx/tests/ExcelJsXlsxProvider.test.ts` | Remove | teste legado | Proibido pela Provision Layer; a coluna é provada por `GenerateUsersXlsxFileRoute.test.ts` | — |

### apps/server — testes de rota

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/server/src/tests/routes/profile/users/OpenPlanetRoute.test.ts` | Create | teste de rota | CA-09–CA-13 | AV-04 |
| `apps/server/src/tests/routes/profile/users/RewardUserForStarCompletionRoute.test.ts` | Modify | teste de rota | CA-14–CA-17, CA-43 | AV-04 |
| `apps/server/src/tests/routes/profile/users/RewardUserForStarChallengeCompletionRoute.test.ts` | Modify | teste de rota | CA-14, CA-15, CA-18 | AV-04 |
| `apps/server/src/tests/routes/profile/users/FetchUnlockedStarsKpiRoute.test.ts` | Modify | teste de rota | CA-21 | AV-04 |
| `apps/server/src/tests/routes/profile/users/FetchUserByIdRoute.test.ts` | Modify | teste de rota | Fatos no `UserDto` | AV-04 |
| `apps/server/src/tests/routes/space/galaxies/ListGalaxyPlanetsRoute.test.ts` | Modify | teste de rota | `concept` e `description` | AV-04 |
| `apps/server/src/tests/routes/space/galaxies/ListGalaxiesRoute.test.ts` | Modify | teste de rota | Progresso por planetas concluídos | AV-04 |
| `apps/server/src/tests/routes/space/galaxies/FetchCurrentGalaxyRoute.test.ts` | Modify | teste de rota | Asserções sobre `userUnlockedStarModel` passam a `users_completed_stars`/`users_opened_planets`, sem reduzir casos | AV-04 |
| `apps/server/src/tests/routes/profile/users/EnterGalaxyRoute.test.ts` | Modify | teste de rota | Idem: entrar na galáxia preserva os fatos | AV-04 |
| `apps/server/src/tests/routes/profile/users/GenerateUsersXlsxFileRoute.test.ts` | Modify | teste de rota | Caso de conta God: a coluna de estrelas traz o total de concluídas | AV-04 |
| `apps/server/src/tests/fixtures/SpaceFixture.ts` | Modify | `createPlanet(…, { concept })`, `createStar(…, { description })` | Dados por caso | — |
| `apps/server/src/tests/fixtures/ProfileFixture.ts` | Modify | `completeStar(userId, starId)`, `openPlanet(userId, planetId)`, `countCompletedStars(userId)` | Prepara e lê fatos | — |
| `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts` | Modify | teste de rota | Sem `icon` no corpo | AV-04 |
| `apps/server/src/tests/routes/space/planets/FetchAllPlanetsRoute.test.ts` | Modify | teste de rota | Sem `icon` na carga | AV-04 |

### apps/web — rotas, RPC e REST

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/web/src/app/(home)/space/[galaxySlug]/loading.tsx` | Create | `Loading` | Renderiza `TrailLoading` | AV-07 |
| `apps/web/src/app/(home)/space/[galaxySlug]/error.tsx` | Create | `Error({ reset })` (client) | Renderiza `TrailLoadFailure` com `onRetry={reset}` | AV-07 |
| `apps/web/src/rpc/actions/space/isFirstStarOfCurrentGalaxy.ts` | Remove | `isFirstStarOfCurrentGalaxy` | Substituído pela derivação | — |
| `apps/web/src/rpc/actions/space/AccessStarPageAction.ts` | Modify | `AccessStarPageAction`; função interna `getCurrentGalaxyTrail(service, user)` | `notFound` salvo estrela acessível; a derivação da trilha (galáxia atual + planetas + fatos do usuário) fica numa função interna do arquivo | AV-06 |
| `apps/web/src/rpc/actions/space/tests/AccessStarPageAction.test.ts` | Modify | teste | Bloqueada → 404; disponível/concluída → acesso | AV-06 |
| `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts` | Modify | `isStarInaccessible`; função interna `getCurrentGalaxyTrail(service, user)` | Usa a derivação (cópia interna do arquivo); God Account mantém o bypass | AV-06 |
| `apps/web/src/rpc/actions/challenging/tests/AccessChallengePageAction.test.ts` | Modify | teste | Bloqueada → 404; disponível/concluída → acesso | AV-06 |
| `apps/web/src/rest/services/ProfileService.ts` | Modify | `openPlanet(planetId)` | `PUT /profile/users/planets/:planetId/open` | AV-07 |
| `apps/web/src/rest/services/SpaceService.ts` | Modify | `createPlanet(planetName, planetImage)` | Sem `planetIcon` | — |

### apps/web — contexto e hooks de space

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/space/contexts/SpaceContext/index.tsx` | Modify | `SpaceProvider` | Monta `GalaxyTrail`; mantém `refetchUser` no mount | AV-06 |
| `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts` | Modify | `useSpaceContextProvider(planets, user, currentGalaxy)` | Expõe `trail`, `currentItem`, seleção, registro de animação, rolagem do item atual | AV-06 |
| `apps/web/src/ui/space/contexts/SpaceContext/useCurrentItemScroll.ts` | Create | `useCurrentItemScroll(currentItemId)` | Posição do item atual e rolagem estabilizada (substitui `useLastUnlockedStarScroll`) | AV-06 |
| `apps/web/src/ui/space/contexts/SpaceContext/useLastUnlockedStarScroll.ts` | Remove | `useLastUnlockedStarScroll` | Substituído | — |
| `apps/web/src/ui/space/contexts/SpaceContext/currentItemLayout.ts` | Create | funções de layout | Métricas, snapshot, centralização (substitui `lastUnlockedStarLayout.ts`) | AV-06 |
| `apps/web/src/ui/space/contexts/SpaceContext/lastUnlockedStarLayout.ts` | Remove | funções de layout | Substituído | — |
| `apps/web/src/ui/space/contexts/SpaceContext/types/SpaceContextValue.ts` | Modify | `SpaceContextValue` | Contrato do conceito "Contexto da trilha" | — |
| `apps/web/src/ui/space/contexts/SpaceContext/types/CurrentItemViewportPosition.ts` | Create | `'above' \| 'in' \| 'below'` | Substitui `LastUnlockedStarViewPortPosition` | — |
| `apps/web/src/ui/space/contexts/SpaceContext/types/LastUnlockedStarViewPortPosition.ts` | Remove | tipo | Substituído | — |
| `apps/web/src/ui/space/contexts/SpaceContext/types/index.ts` | Modify | barrel | Troca o tipo | — |
| `apps/web/src/ui/space/contexts/SpaceContext/tests/useSpaceContextProvider.test.ts` | Modify | teste | Derivação, item atual, seleção, animações, rolagem | AV-06 |
| `apps/web/src/ui/space/hooks/useOpenPlanetAction.ts` | Create | `useOpenPlanetAction(): { openPlanet(planetId: string): Promise<void>; openingPlanetId: string \| null }` | Action REST; lança o erro da resposta | AV-06 (consumidor), AV-07 |

### apps/web — página Galáxia

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/space/widgets/pages/Space/index.tsx` | Modify | `SpacePage` | Lê contexts e passa a `useSpacePage` | — |
| `apps/web/src/ui/space/widgets/pages/Space/SpacePageView.tsx` | Modify | `SpacePageView` | Mapa, painel desktop, sheet mobile, FAB, vazio, encerramento | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/useSpacePage.ts` | Modify | `useSpacePage` | FAB (visibilidade, direção, rótulo), sheet aberto, `shouldShowEnding`, vazio | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/fab-icon.ts` | Modify | `FAB_ICON` | Chaves de `CurrentItemViewportPosition` | — |
| `apps/web/src/ui/space/widgets/pages/Space/tests/SpacePageView.test.tsx` | Modify | teste | CA-29, CA-30, CA-31, CA-35 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/tests/useSpacePage.test.ts` | Modify | teste | CA-26, CA-29, CA-30 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoading/index.tsx` | Create | `TrailLoading = TrailLoadingView` | Alias | — |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoading/TrailLoadingView.tsx` | Create | `TrailLoadingView` | "Carregando trilha…" e placeholders | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoading/tests/TrailLoadingView.test.tsx` | Create | teste | Texto e placeholders | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoadFailure/index.tsx` | Create | `TrailLoadFailure = TrailLoadFailureView` | Alias | — |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoadFailure/TrailLoadFailureView.tsx` | Create | `TrailLoadFailureView({ onRetry })` | Título, mensagem, "Tentar novamente" | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoadFailure/tests/TrailLoadFailureView.test.tsx` | Create | teste | Ação chama `onRetry` | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/TrailEmpty/index.tsx` | Create | `TrailEmpty = TrailEmptyView` | Alias | — |
| `apps/web/src/ui/space/widgets/pages/Space/TrailEmpty/TrailEmptyView.tsx` | Create | `TrailEmptyView` | "Nenhum conteúdo disponível nesta trilha." | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/TrailEmpty/tests/TrailEmptyView.test.tsx` | Create | teste | Texto | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/index.tsx` | Create | `StarDetails` | Resolve contexts, `challengingService`, `useNavigationProvider`, `useToastContext`, áudio; chama `useStarDetails` | — |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/StarDetailsView.tsx` | Create | `StarDetailsView` | Conteúdo do painel; o sheet o reutiliza pelo `index.tsx` de `StarDetails` | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/useStarDetails.ts` | Create | `useStarDetails(params)` | Rótulos por tipo/estado; ação com áudio, reinício do Lottie e navegação; toast de falha | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/tests/StarDetailsView.test.tsx` | Create | teste | CA-25 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/tests/useStarDetails.test.ts` | Create | teste | CA-24, CA-27 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetailsSheet/index.tsx` | Create | `StarDetailsSheet` | Alias de `StarDetailsSheetView` (props `isOpen`, `onClose`); sem hook próprio | — |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetailsSheet/StarDetailsSheetView.tsx` | Create | `StarDetailsSheetView` | `Drawer` do `vaul` com fundo atenuado; renderiza o widget público `StarDetails` | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetailsSheet/tests/StarDetailsSheetView.test.tsx` | Create | teste | Abre, fecha, ação acessível | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/index.tsx` | Modify | `Planet` | Resolve contexts e `useOpenPlanetAction`; chama `usePlanet` | — |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetView.tsx` | Modify | `PlanetView` | Botão único planeta+placa, conceito, contador, condição, cadeado; arte do planeta de 88 px (mobile) e 140 px (desktop); só o planeta atual (`isAnimated`: o planeta que é o item atual ou que contém a estrela atual) usa `unoptimized`, para o Next.js não achatar o WebP animado; os outros passam pelo otimizador e mostram o primeiro quadro | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/usePlanet.ts` | Create | `usePlanet(params)` | Estado do planeta, ação de abrir, `justOpened`, toast de falha; `isAnimated` (planeta atual ou que contém a estrela atual) | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/tests/PlanetView.test.tsx` | Create | teste | CA-22, CA-36 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/tests/usePlanet.test.ts` | Create | teste | CA-32, CA-33 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/index.tsx` | Create | `PlanetLock` | Resolve `useReducedMotion`; chama `usePlanetLock` | — |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/PlanetLockView.tsx` | Create | `PlanetLockView` | Lottie `planet-lock` ou fade CSS | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/usePlanetLock.ts` | Create | `usePlanetLock({ planetState, isJustOpened, isReducedMotion })` | Fases parado, loop, abertura única, fade | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/tests/PlanetLockView.test.tsx` | Create | teste | Fases e fade | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/tests/usePlanetLock.test.ts` | Create | teste | CA-34 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/index.tsx` | Modify | `Star` | Lê estado da trilha e seleção do context | — |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/StarView.tsx` | Modify | `StarView` | Lottie/SVG, número, tipo, estado, condição; sem foguete e sem "Conteúdo novo" | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts` | Modify | `useStar(params)` | Seleção por hover/foco/toque sem áudio; registro da animação; rolagem inicial do item atual | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/tests/StarView.test.tsx` | Modify | teste | CA-22, CA-23 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/tests/useStar.test.ts` | Modify | teste | CA-24, CA-28 | AV-06 |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/AnimatedRocket/index.tsx` | Remove | `AnimatedRocket` | Foguete removido (RP-02) | — |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/AnimatedRocket/AnimatedRocketView.tsx` | Remove | `AnimatedRocketView` | Foguete removido (RP-02) | — |

### apps/web — global, perfil e jornadas

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/lotties.ts` | Modify | `LOTTIE_PATHS` | Registra `planet-lock` | — |
| `apps/web/src/ui/global/widgets/components/Fab/index.tsx` | Modify | `Fab` | Posição no mobile acima da navegação inferior (`bottom-[7.5rem] right-4`), como no board `FAB de retorno / Mobile`; desktop inalterado | VV-09 |
| `apps/web/src/ui/global/widgets/components/Animation/types/AnimationName.ts` | Modify | `AnimationName` | Inclui `'planet-lock'` | — |
| `apps/web/src/ui/global/widgets/components/Animation/types/AnimationProps.ts` | Modify | `AnimationProps` | Inclui `onLoadError` (falha ao carregar o Lottie não bloqueia a abertura do planeta) | AV-06 |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/index.tsx` | Modify | `LottieAnimation` | Repassa `onLoadError` | AV-06 |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/useLottieAnimation.ts` | Modify | `useLottieAnimation` | Chama `onLoadError` em `data_failed` | AV-06 |
| `apps/web/public/lotties/planet-lock.json` | Create | asset Lottie provisório | Exportado do projeto `planet-lock` do Studio; marcadores `idle`, `loop`, `open` | AV-06, VV-11 |
| `apps/web/src/ui/profile/widgets/pages/Profile/ProfilePageView.tsx` | Modify | `ProfilePageView` | Passa `completedStarsCount` | — |
| `apps/web/src/ui/profile/widgets/pages/Profile/Statistics/StatisticsView.tsx` | Modify | `StatisticsView` | Rótulo "Estrelas concluídas" | AV-06 |
| `apps/web/src/ui/profile/widgets/pages/Profile/Statistics/tests/StatisticsView.test.tsx` | Create | teste | Rótulo e valor | AV-06 |
| `apps/web/src/app/tests/space/space.test.ts` | Modify | Playwright | Jornadas de AV-07 | AV-07 |
| `apps/web/next.config.js` | Modify | `images` | Em desenvolvimento (CDN sempre local, já validado no arquivo), `dangerouslyAllowLocalIP` libera o otimizador para as imagens raster do MinIO | AV-06 |
| `apps/web/src/app/tests/space/galaxies.test.ts` | Modify | Playwright | Primeira estrela não é mais disponível na leitura | AV-07 |
| `apps/web/src/app/tests/profile/profile.test.ts` | Modify | Playwright | Fakers com os fatos novos; rótulo | AV-07 |

### apps/backoffice

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `apps/backoffice/src/rest/services/ProfileService.ts` | Modify | `openPlanet(planetId)` | Chamada REST sem uso em tela (implementa a interface do Core) | AV-09 |
| `apps/backoffice/src/ui/global/widgets/pages/Dashboard/Kpis/KpisView.tsx` | Modify | `KpisView` | Rótulo "Estrelas concluídas" | AV-09 |
| `apps/backoffice/src/ui/global/widgets/pages/Dashboard/Kpis/tests/KpisView.test.tsx` | Create | teste | Rótulo | AV-09 |
| `apps/backoffice/src/ui/global/widgets/components/UsersTable/UsersTableView.tsx` | Modify | `UsersTableView` | Coluna "Estrelas Concluídas" | AV-09 |
| `apps/backoffice/src/ui/global/widgets/components/UsersTable/UsersTableSkeleton/UsersTableSkeletonView.tsx` | Modify | `UsersTableSkeletonView` | Coluna "Estrelas Concluídas" | AV-09 |
| `apps/backoffice/src/ui/profile/widgets/components/AchievementForm/AchievementFormView.tsx` | Modify | `AchievementFormView` | Opção de métrica "Estrelas Concluídas"; chave inalterada | AV-09 |
| `apps/backoffice/src/rest/services/SpaceService.ts` | Modify | `createPlanet(planetName, planetImage)` | Sem `planetIcon` | AV-09 |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/usePlanetsPage.ts` | Modify | `handlePlanetCreate` | Cria o planeta só com nome e imagem | AV-09 |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetsPageView.tsx` | Modify | `PlanetsPageView` | `onPlanetFormSubmit` sem `icon` | AV-09 |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetForm/index.tsx` | Modify | `PlanetForm` | `onSubmit` sem `icon` | AV-09 |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetForm/PlanetFormView.tsx` | Modify | `PlanetFormView` | Sem o campo "Ícone do planeta" | AV-09 |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetForm/usePlanetForm.ts` | Modify | `usePlanetForm` | Esquema e limpeza de arquivos sem `icon` | AV-09 |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetCollapsible/PlanetCollapsibleView.tsx` | Modify | `PlanetCollapsibleView` | Sem o ícone do planeta | AV-09 |

### packages/studio

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `packages/studio/public/projects/planet-lock/scene-1/lottie.json` | Create | cena do Studio | Fonte do asset provisório do cadeado | MV-01 |

### CI/CD e scripts

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `.github/workflows/server-app-staging-cd.yml` | Create | workflow `Server app staging CD` | Push em `main` e `initial_cutover`; preflight → migrate → preflight → imagens → seed → deploy → SHA e health | AV-08, MV-03 |
| `scripts/seed-local-assets.mjs` | Modify | upload local | Aceita `.webp`; remove do MinIO local os objetos das pastas de catálogo que não existem no repositório; a animação da galáxia vem do próprio `animation` (a trilha anterior reutiliza a da Lógica), sem duplicar o envio | AV-05 |
| `scripts/seed-staging-assets.mjs` | Create | upload de staging | Guardas de CA-44; envia só as dez imagens de planeta ao R2 de staging (`https://<S3_ACCOUNT_ID>.r2.cloudflarestorage.com`); nunca apaga nem altera policy; confirma `STAGING_CDN_URL` | AV-05, AV-08 |
| `scripts/tests/seed-staging-assets.test.mjs` | Create | teste do script | CA-44, sem rede | AV-05 |
| `scripts/tests/galaxy-trail-migration.integration.test.mjs` | Create | teste de migration | CA-01–CA-04 | AV-05 |
| `scripts/tests/galaxies-migration.integration.test.mjs` | Modify | teste de migration | Asserções de `0003`–`0005` sem as tabelas removidas | AV-05 |
| `scripts/tests/seed-database.test.mjs` | Modify | teste do seed | CA-40 | AV-05 |
| `scripts/tests/seed-database.integration.test.mjs` | Modify | teste do seed | Catálogo novo, sem progresso inicial | AV-05 |
| `scripts/web-quality.config.json` | Modify | rota `galaxy` | `/space/logica-de-programacao`, `auth: true`, limites iguais aos de `galaxies` | AV-10 |

### Documentação

| Path | Change | Declaration | Contract | Tests |
| --- | --- | --- | --- | --- |
| `documentation/architecture.md` | Modify | fluxo "Galáxias" e novo fluxo "Trilha da galáxia" | Fatos em profile, derivação em space, staging CD | — |
| `documentation/infrastructure.md` | Modify | serviços, CD e runbook | Server de staging, secrets (incluindo os `S3_*` do environment `staging`), variables `STAGING_ASSETS_BUCKET`, `PRODUCTION_ASSETS_BUCKET` e `STAGING_CDN_URL`, seed, imagens no R2 de staging, envio manual das dez imagens ao R2 de produção antes do release, pausa de produção e backup | — |
| `documentation/github-flow.md` | Modify | seção Staging e implantação | Server de staging no merge; pré-condição de produção | — |
| `documentation/tooling.md` | Modify | scripts do Server | `db:seed:staging` e sua guarda; `seed-staging-assets.mjs` e suas variáveis (`STAGING_ASSETS_BUCKET`, `PRODUCTION_ASSETS_BUCKET`, `STAGING_CDN_URL`); imagens WebP e remoção de obsoletos no `storage:seed` | — |

## Detalhamento técnico por camada afetada

- **Core:** use cases recebem e devolvem só DTOs e primitivos (`string[]` para fatos); contratos de
  repositório usam `Id`/`Integer`. `GalaxyTrail` concentra a regra; use cases só orquestram. Erros
  novos sem métodos.
- **Validação e rotas:** `PUT /profile/users/planets/:planetId/open` valida `planetId` com o
  `idSchema` existente em `packages/validation`; nenhuma propriedade de conta é aceita do cliente.
  Erros: `PlanetNotFoundError`/`StarNotFoundError` → `404`; `PlanetLockedError`/`StarLockedError`
  estendem o novo `ForbiddenError` (`packages/core/src/global/domain/errors`), que `HonoApp` mapeia a
  `403` (hoje nenhum erro do Core chega a `403`; `NotAllowedError` responde `405`). Os casos `403` de
  AV-04 provam o mapeamento.
- **Ownership:** `addCompletedStar` e `addOpenedPlanet` chamam `authorizeOwner(userId)` em
  `DrizzleUsersRepository`; nas rotas de recompensa, um `:userId` diferente da conta da sessão
  responde `404` sem gravar nada (CA-43), porque `findById` filtra pela conta da sessão
  (`accountVisibility`) e o use case carrega o usuário antes de escrever; `authorizeOwner` é a defesa
  em profundidade.
  As rotas de recompensa mantêm o body e passam a ter `appendUserTrailFactsToBody` →
  `appendStarCompletionToBody` antes da validação, no lugar de `appendNextStarToBody`.
- **Banco:** `0006` gerada a partir dos models; `0007` customizada em transação única, com UUIDs fixos,
  `ON CONFLICT DO NOTHING` nos inserts de catálogo, recriação/remoção de objetos SQL (DT-06) e
  `REVOKE ALL … FROM PUBLIC, anon, authenticated` nas tabelas novas; `0008` gerada depois de remover os
  models antigos. Nenhuma migration gerada é editada à mão. O cabeçalho de `0007` documenta o SQL
  inverso (precedente `0004`).
- **UI:** cada widget novo segue Entry Point/View/Hook; Views sem efeitos; hooks com `function`;
  navegação por `useNavigationProvider`; painel inferior com `Drawer` do `vaul`; breakpoint por
  `useBreakpoint`. Estados de carregamento e falha da rota ficam nos widgets `TrailLoading` e
  `TrailLoadFailure`, renderizados por `loading.tsx` e `error.tsx`.
- **Queue:** `CreateUserJob` perde só o passo de desbloqueio; `ReachFirstTierJob` inalterado.
  `UpdateSpaceForAllUsersJob` não tem registro no Inngest e é removido com seu caso de uso.
- **CI/CD:** `server-app-staging-cd.yml` usa `actions/checkout@v7`, `pnpm/action-setup@v6`,
  `actions/setup-node@v7` (Node 22), `pnpm install --frozen-lockfile` e os mesmos passos de poll de
  deploy e health de `server-app-production-cd.yml`, com `COOLIFY_WEBHOOK_SERVER_STG` e
  `SERVER_STG_HEALTH_URL`. O passo de imagens roda `node scripts/seed-staging-assets.mjs` com os
  secrets `S3_ACCOUNT_ID`, `S3_BUCKET_NAME`, `S3_ACCESS_KEY_ID` e `S3_SECRET_ACCESS_KEY` do
  environment `staging` e as variables `STAGING_ASSETS_BUCKET`, `PRODUCTION_ASSETS_BUCKET` e
  `STAGING_CDN_URL`, que o usuário configura junto com o Coolify de staging. O script usa
  `@aws-sdk/client-s3` do Server (sem dependência nova), envia com `PutObject` idempotente e
  `CacheControl: no-cache`, e nunca lista, apaga nem altera policy no R2.

## Runtime Flow

### Entrar na Galáxia (JN-01, JN-05, JN-06)

`/space/[galaxySlug]/page.tsx` (servidor) resolve a galáxia atual e os planetas (`no-store`); durante a
busca, `loading.tsx` mostra `TrailLoading`; uma falha lança e `error.tsx` mostra `TrailLoadFailure`,
cujo "Tentar novamente" chama `reset()`. `SpaceProvider` recarrega o usuário uma vez e cria
`GalaxyTrail` com `completedStarsIds` e `openedPlanetsIds`; sem usuário, a página mostra
`TrailLoading`. Sem planetas, `TrailEmpty`, sem FAB e sem rolagem. Com item atual, a rolagem
estabilizada roda uma vez; o FAB acompanha a posição do item atual.

### Abrir um planeta (JN-08 sem vídeo)

```mermaid
sequenceDiagram
  participant W as Web (Planet)
  participant H as Hono UsersRouter
  participant P as ProfileMiddleware
  participant S as SpaceMiddleware
  participant DB as PostgreSQL
  W->>H: PUT /profile/users/planets/:planetId/open (sessão)
  H->>P: appendUserTrailFactsToBody (conta da sessão)
  P->>DB: fatos da conta
  H->>S: appendOpenablePlanetToBody
  S->>DB: planeta + planetas da galáxia
  S-->>H: 403 bloqueado / 404 inexistente
  H->>DB: OpenPlanetUseCase: INSERT … ON CONFLICT DO NOTHING
  H-->>W: 200 { openedPlanetId }
  W->>W: refreshTrail(); PlanetLock toca "open" uma vez (ou fade)
```

O botão fica `aria-busy` e ignora acionamentos durante a requisição. Na falha, toast e nenhum efeito.

### Selecionar, começar e revisar (JN-02, JN-03)

Desktop (≥ 1024 px): hover ou foco chama `selectStar`; o painel mostra `selectedStarId`. Mobile: toque
seleciona e abre o painel inferior; fechar devolve o foco à estrela. A ação de `useStarDetails` toca
`star.wav`, chama `restartStarAnimation` e navega: história → `/lesson/<slug>`; desafio →
`challengingService.fetchChallengeByStarId` e a rota do desafio; sem desafio ou falha → toast, sem
navegação. As páginas de destino aplicam `AccessStarPageAction`/`AccessChallengePageAction` com
`getCurrentGalaxyTrail` (`404` para estrela bloqueada).

### Concluir uma estrela (JN-04)

Fluxos de lição e desafio enviam as recompensas existentes. Cadeia: auth → `appendUserInfoToBody` →
`appendUserTrailFactsToBody` → `appendStarCompletionToBody` (`403` bloqueada) → validação →
controller: `CompleteStarUseCase` (grava e, se fechou o planeta, publica `PlanetCompletedEvent`) →
cálculo da recompensa (metade se `isAlreadyCompleted`) →
`CompleteSpaceUseCase` (primeira galáxia, última estrela, primeira vez) → `RewardUserUseCase` (e, no
desafio, `CompleteChallengeUseCase`). Os passos não compartilham transação, como hoje; repetir após
falha parcial é seguro porque a conclusão é idempotente. No retorno à Galáxia, a derivação mostra o
novo estado.

### Migrations e ambientes

Local: `db:test` aplica `0000`–`0008`; `db:seed` limpa e carrega o catálogo novo. Staging: o workflow
aplica as migrations pendentes e o seed a cada push; a primeira execução é o `initial_cutover`
manual. Produção: o gate `PRODUCTION_RELEASES_PAUSED` continua bloqueando o CD do Server; liberar
exige backup e o release conjunto com a Web (RF-18).

# Verification Contract

## Shared setup

- **Server e integração:** Docker local; `pnpm --filter @stardust/server run db:test` (reset sem seed e
  `db:migrate` com `0000`–`0008`). Rotas usam `HonoFixture`, `SupabaseFixture.clearDatabase()`,
  `AuthFixture` (contas efêmeras confirmadas pelo Mailpit), `SpaceFixture` (`createGalaxy`,
  `createPlanet`, `createStar`, cleanup) e `ProfileFixture` (`completeStar`, `openPlanet`,
  `countCompletedStars`). Nenhum teste depende das linhas inseridas por `0007`.
- **Migration e seed:** `eval "$(node ./scripts/export-local-database-env.mjs)"`; os testes usam
  `STARDUST_LOCAL_MIGRATION_TEST=1` ou `STARDUST_LOCAL_SEED_TEST=1` e não deixam efeito residual
  (transação com `ROLLBACK` ou reset local).
- **Web integração:** `apps/web/playwright.config.ts` (Web em `http://127.0.0.1:3100`, `MODE=testing`);
  `ServerMock` registra `/auth/account`, `/profile/users/id/:id` (fakers com `completedStarsIds` e
  `openedPlanetsIds`), `/space/galaxies/current`, `/space/galaxies/:slug/planets`,
  `PUT /profile/users/planets/:planetId/open`, `/challenging/challenges/star/:starId` e as rotas de
  lição; cookie `@stardust:access-token` para `127.0.0.1`.
- **Manual:** `.env.local` raiz; `pnpm --filter @stardust/server run db:test` e
  `pnpm --filter @stardust/server run db:seed`; Server `pnpm --filter @stardust/server run dev`
  (`http://localhost:3334`) e Web `pnpm --filter @stardust/web run dev` (`http://localhost:3000`);
  conta Explorer do seed por `eval "$(node ./scripts/export-web-app-e2e-env.mjs --seed)"` (sem fatos
  iniciais). Repetir `db:seed` restaura o estado inicial.
- **Qualidade web:** `pnpm --filter @stardust/web run build` e `pnpm --filter @stardust/web run start`
  com o Server local e a mesma conta.
- **Staging:** environment `staging` e Coolify configurados pelo usuário; nenhum acesso a produção.
- **Doop:** Doop MCP conectado ao canvas `StarDust` (`get_canvas`); revisão 9 em diante, no lugar do Penpot.

## Automated

### AV-01 — Objetos de domínio

**Criteria:** CA-05, CA-06, CA-07, CA-08, CA-22
**Target / boundary:** `packages/core/src/space/domain/structures/tests/GalaxyTrail.test.ts`,
`StarProgressState.test.ts`, `PlanetProgressState.test.ts`, `packages/core/src/space/domain/entities/tests/Star.test.ts`,
`Planet.test.ts`, `packages/core/src/profile/domain/entities/tests/User.test.ts`
**Command:** `pnpm --filter @stardust/core run test:unit -- src/space/domain/structures/tests/GalaxyTrail.test.ts src/space/domain/structures/tests/StarProgressState.test.ts src/space/domain/structures/tests/PlanetProgressState.test.ts src/space/domain/entities/tests/Star.test.ts src/space/domain/entities/tests/Planet.test.ts src/profile/domain/entities/tests/User.test.ts`
**Approval condition:** As seis suítes executam e passam; cobrem conta nova, abertura, progressão,
liberação do próximo planeta, conclusão total, catálogo vazio, estrela inserida, contadores e a
idempotência de `completeStar`/`openPlanet`.

### AV-02 — Casos de uso

**Criteria:** CA-09, CA-10, CA-11, CA-14, CA-15, CA-16, CA-17, CA-21
**Target / boundary:** `packages/core/src/space/use-cases/tests/GetPlanetOpeningUseCase.test.ts`,
`GetStarCompletionUseCase.test.ts`; `packages/core/src/profile/use-cases/tests/CompleteStarUseCase.test.ts`,
`OpenPlanetUseCase.test.ts`, `CalculateRewardForStarCompletionUseCase.test.ts`, `CompleteSpaceUseCase.test.ts`,
`GetUnlockedStarsKpiUseCase.test.ts`, `ObserveNewUnlockedAchievementsUseCase.test.ts`, `EnterGalaxyUseCase.test.ts`
**Command:** `pnpm --filter @stardust/core run test:unit -- src/space/use-cases/tests/GetPlanetOpeningUseCase.test.ts src/space/use-cases/tests/GetStarCompletionUseCase.test.ts src/profile/use-cases/tests/CompleteStarUseCase.test.ts src/profile/use-cases/tests/OpenPlanetUseCase.test.ts src/profile/use-cases/tests/CalculateRewardForStarCompletionUseCase.test.ts src/profile/use-cases/tests/CompleteSpaceUseCase.test.ts src/profile/use-cases/tests/GetUnlockedStarsKpiUseCase.test.ts src/profile/use-cases/tests/ObserveNewUnlockedAchievementsUseCase.test.ts src/profile/use-cases/tests/EnterGalaxyUseCase.test.ts`
**Approval condition:** As nove suítes executam e passam, com mocks de repositório (`ts-jest-mocker`) e
fakers; `GetStarCompletionUseCase` não publica evento; `CompleteStarUseCase` publica
`PlanetCompletedEvent` uma única vez, só após gravar; metade da recompensa em estrela concluída.

### AV-03 — Controllers e jobs do Server

**Criteria:** CA-09, CA-15, CA-18, CA-19
**Target / boundary:** `apps/server/src/rest/controllers/profile/users/tests/AppendUserTrailFactsToBodyController.test.ts`,
`OpenPlanetController.test.ts`, `RewardUserForStarCompletionController.test.ts`,
`RewardUserForStarChallengeCompletionController.test.ts`;
`apps/server/src/rest/controllers/space/planets/tests/AppendOpenablePlanetToBodyController.test.ts`;
`apps/server/src/rest/controllers/space/stars/tests/AppendStarCompletionToBodyController.test.ts`;
`apps/server/src/queue/jobs/profile/tests/CreateUserJob.test.ts` (planejado, `Amqp` mockado, conforme
`handlers-testing-rules.md`).
**Command:** `pnpm --filter @stardust/server run test:unit -- src/rest/controllers/profile/users/tests/AppendUserTrailFactsToBodyController.test.ts src/rest/controllers/profile/users/tests/OpenPlanetController.test.ts src/rest/controllers/profile/users/tests/RewardUserForStarCompletionController.test.ts src/rest/controllers/profile/users/tests/RewardUserForStarChallengeCompletionController.test.ts src/rest/controllers/space/planets/tests/AppendOpenablePlanetToBodyController.test.ts src/rest/controllers/space/stars/tests/AppendStarCompletionToBodyController.test.ts src/queue/jobs/profile/tests/CreateUserJob.test.ts`
**Approval condition:** As sete suítes executam e passam; controllers de recompensa chamam
`CompleteStarUseCase` e nunca um desbloqueio; `CreateUserJob` não grava fato de progresso e executa
criação, foguetes, avatares e `FinishUserCreationUseCase`.

### AV-04 — Rotas HTTP do Server

**Criteria:** CA-09–CA-18, CA-21, CA-43
**Target / boundary:** `apps/server/src/tests/routes/profile/users/OpenPlanetRoute.test.ts`,
`RewardUserForStarCompletionRoute.test.ts`, `RewardUserForStarChallengeCompletionRoute.test.ts`,
`FetchUnlockedStarsKpiRoute.test.ts`, `FetchUserByIdRoute.test.ts`;
`GenerateUsersXlsxFileRoute.test.ts`, `EnterGalaxyRoute.test.ts`;
`apps/server/src/tests/routes/space/galaxies/ListGalaxyPlanetsRoute.test.ts`, `ListGalaxiesRoute.test.ts`,
`FetchCurrentGalaxyRoute.test.ts`
**Command:** `pnpm --filter @stardust/server run db:test` e depois
`pnpm --filter @stardust/server run test:integration src/tests/routes/profile/users/OpenPlanetRoute.test.ts src/tests/routes/profile/users/RewardUserForStarCompletionRoute.test.ts src/tests/routes/profile/users/RewardUserForStarChallengeCompletionRoute.test.ts src/tests/routes/profile/users/FetchUnlockedStarsKpiRoute.test.ts src/tests/routes/profile/users/FetchUserByIdRoute.test.ts src/tests/routes/space/galaxies/ListGalaxyPlanetsRoute.test.ts src/tests/routes/space/galaxies/ListGalaxiesRoute.test.ts src/tests/routes/profile/users/GenerateUsersXlsxFileRoute.test.ts src/tests/routes/profile/users/EnterGalaxyRoute.test.ts src/tests/routes/space/galaxies/FetchCurrentGalaxyRoute.test.ts`
**Approval condition:** As dez suítes executam e passam contra o banco local real; cada CA listado tem
caso próprio, incluindo `401`, `403`, `404`, repetição idempotente, conta da sessão, persistência entre
sessões, metade da recompensa, liberação sem abertura, `has_completed_space`, `:userId` de outra
conta (`404`) e a coluna de estrelas concluídas da planilha; as suítes modificadas não perdem casos
nem asserções.

### AV-05 — Migrations e seed

**Criteria:** CA-01, CA-02, CA-03, CA-04, CA-40, CA-44
**Target / boundary:** `scripts/tests/galaxy-trail-migration.integration.test.mjs`,
`scripts/tests/galaxies-migration.integration.test.mjs`, `scripts/tests/seed-database.test.mjs`,
`scripts/tests/seed-database.integration.test.mjs`, `scripts/tests/seed-staging-assets.test.mjs` (planejado)
**Command:** `eval "$(node ./scripts/export-local-database-env.mjs)" && STARDUST_LOCAL_MIGRATION_TEST=1 node --test scripts/tests/galaxy-trail-migration.integration.test.mjs scripts/tests/galaxies-migration.integration.test.mjs`;
`node --test scripts/tests/seed-database.test.mjs scripts/tests/seed-staging-assets.test.mjs`;
`pnpm --filter @stardust/server run storage:seed` com o MinIO local;
`eval "$(node ./scripts/export-local-database-env.mjs)" && STARDUST_LOCAL_SEED_TEST=1 node --test scripts/tests/seed-database.integration.test.mjs`
**Approval condition:** Os testes executam (não são ignorados) e passam; confirmam catálogo, arquivo,
slugs, preservação das colunas de conta, remoção das tabelas, ausência de referências SQL às tabelas
removidas, privilégios, igualdade entre `0007` e `seed-catalog.json` e as quatro situações da guarda
de staging; as guardas de CA-44 recusam antes de qualquer rede; `storage:seed` envia as dez imagens
novas, remove as antigas e confirma todas as referências. `db:test` aplica `0000`–`0008` sem erro.

### AV-06 — Widgets, hooks, contexto e guardas RPC da Web

**Criteria:** CA-21–CA-37
**Target / boundary:** `apps/web/src/ui/space/contexts/SpaceContext/tests/useSpaceContextProvider.test.ts`;
em `apps/web/src/ui/space/widgets/pages/Space/`: `tests/SpacePageView.test.tsx`, `tests/useSpacePage.test.ts`,
`TrailLoading/tests/TrailLoadingView.test.tsx`, `TrailLoadFailure/tests/TrailLoadFailureView.test.tsx`,
`TrailEmpty/tests/TrailEmptyView.test.tsx`, `StarDetails/tests/StarDetailsView.test.tsx`,
`StarDetails/tests/useStarDetails.test.ts`, `StarDetailsSheet/tests/StarDetailsSheetView.test.tsx`,
`Planet/tests/PlanetView.test.tsx`, `Planet/tests/usePlanet.test.ts`, `Planet/PlanetLock/tests/PlanetLockView.test.tsx`,
`Planet/PlanetLock/tests/usePlanetLock.test.ts`, `Planet/Star/tests/StarView.test.tsx`, `Planet/Star/tests/useStar.test.ts`;
`apps/web/src/ui/profile/widgets/pages/Profile/Statistics/tests/StatisticsView.test.tsx`;
`apps/web/src/rpc/actions/space/tests/AccessStarPageAction.test.ts`,
`apps/web/src/rpc/actions/challenging/tests/AccessChallengePageAction.test.ts`
**Command:** `pnpm --filter @stardust/web run test:unit -- src/ui/space/contexts/SpaceContext/tests/useSpaceContextProvider.test.ts src/ui/space/widgets/pages/Space/tests/SpacePageView.test.tsx src/ui/space/widgets/pages/Space/tests/useSpacePage.test.ts src/ui/space/widgets/pages/Space/TrailLoading/tests/TrailLoadingView.test.tsx src/ui/space/widgets/pages/Space/TrailLoadFailure/tests/TrailLoadFailureView.test.tsx src/ui/space/widgets/pages/Space/TrailEmpty/tests/TrailEmptyView.test.tsx src/ui/space/widgets/pages/Space/StarDetails/tests/StarDetailsView.test.tsx src/ui/space/widgets/pages/Space/StarDetails/tests/useStarDetails.test.ts src/ui/space/widgets/pages/Space/StarDetailsSheet/tests/StarDetailsSheetView.test.tsx src/ui/space/widgets/pages/Space/Planet/tests/PlanetView.test.tsx src/ui/space/widgets/pages/Space/Planet/tests/usePlanet.test.ts src/ui/space/widgets/pages/Space/Planet/PlanetLock/tests/PlanetLockView.test.tsx src/ui/space/widgets/pages/Space/Planet/PlanetLock/tests/usePlanetLock.test.ts src/ui/space/widgets/pages/Space/Planet/Star/tests/StarView.test.tsx src/ui/space/widgets/pages/Space/Planet/Star/tests/useStar.test.ts src/ui/profile/widgets/pages/Profile/Statistics/tests/StatisticsView.test.tsx src/rpc/actions/space/tests/AccessStarPageAction.test.ts src/rpc/actions/challenging/tests/AccessChallengePageAction.test.ts`
**Approval condition:** As 18 suítes executam e passam; hooks testados com o helper `Hook()` e Views com
`View()` (widget-tests-rules); `index.tsx` não é testado; `useOpenPlanetAction` é coberto por
`usePlanet` (parâmetro) e por AV-07.

### AV-07 — Jornadas Playwright da Web

**Criteria:** CA-22, CA-24, CA-26, CA-27, CA-28, CA-29, CA-30, CA-31, CA-32, CA-33, CA-34, CA-35, CA-36
**Target / boundary:** `apps/web/src/app/tests/space/space.test.ts`, `apps/web/src/app/tests/space/galaxies.test.ts`,
`apps/web/src/app/tests/profile/profile.test.ts`
**Command:** `pnpm --filter @stardust/web run test:integration src/app/tests/space/space.test.ts src/app/tests/space/galaxies.test.ts src/app/tests/profile/profile.test.ts`
**Approval condition:** Os cenários executam e passam: estados do mapa; painel por hover e por foco
(1440×900); painel inferior abre, fecha e devolve o foco (390×844, sem scroll horizontal); abrir
planeta (requisição `PUT` aguardada, cadeado some, estrela 1 disponível) e a variante de movimento
reduzido; começar história → `/lesson/<slug>`; desafio sem desafio → toast; estrela bloqueada não
selecionável; FAB; falha com "Tentar novamente"; vazio; trilha concluída sem FAB com
"Agradecimentos"; navegação obrigatória por controle visível e redirecionamento sem sessão
(web-app-routes-testing-rules 6.1.1).

### AV-08 — Workflow de staging

**Criteria:** CA-38, CA-45
**Target / boundary:** `.github/workflows/server-app-staging-cd.yml`
**Command:** não há validador de workflows no repositório (`documentation/tooling.md`); inspeção do
arquivo contra `server-app-production-cd.yml` e CA-38, sem introduzir ferramenta nova.
**Approval condition:** Os itens de CA-38 conferidos linha a linha no Evaluation, com o diff
comparado ao workflow de produção. A execução real é MV-03.

### AV-09 — Verificações de baseline aplicáveis

**Criteria:** CA-20, CA-21, CA-42
**Scope:** `@stardust/core`, `@stardust/server`, `@stardust/web`, `@stardust/backoffice` (consumidor das
interfaces de profile) e `scripts/`.
**Checks:** conforme `documentation/tooling.md` ("Execução local escopada"):
- `pnpm run check:code -w <workspace>` nos quatro workspaces;
- `pnpm run check:types -w <workspace>` nos quatro workspaces (projeto inteiro);
- `pnpm --filter @stardust/<workspace> run check:complexity` nos quatro (arquivos novos, inclusive Views);
- `pnpm --filter @stardust/<workspace> run check:architecture` em core, server e web;
- `pnpm run check:test-integrity` (testes adicionados, movidos e removidos);
- `pnpm run test:scripts` restrito aos arquivos de AV-05 que não exigem banco;
- `pnpm --filter @stardust/backoffice run test:unit -- src/ui/global/widgets/pages/Dashboard/Kpis/tests/KpisView.test.tsx`;
- busca de CA-20 (`StarUnlockedEvent`, `users_unlocked_stars`) registrada no Evaluation;
- `pnpm run check:spec-implementation documentation/features/space/galaxy-trail/spec.md --base <commit-base> --require-plan`.
**Approval condition:** Todos passam; avisos de complexidade só são aceitos se constarem no baseline
ou em `origin/main`; seleções vazias não contam; revisão da documentação de CA-42 registrada.

### AV-10 — Qualidade web da página Galáxia

**Criteria:** CA-41
**Target / boundary:** rota `galaxy` de `scripts/web-quality.config.json`
**Command:** antes da mudança, a mesma medição da página atual com uma configuração temporária fora do
repositório; depois, `eval "$(node ./scripts/export-web-app-e2e-env.mjs --seed)" && pnpm run check:web-quality --route galaxy`
**Approval condition:** Mediana de 3 execuções dentro dos mínimos nos dois presets; se a página atual
já falhar um mínimo, os números são levados ao usuário antes de classificar como regressão.

## Manual

### MV-01 — Caminho feliz no desktop (1440×900)

**Criteria:** CA-27, CA-28, CA-32
**Tool / setup:** Playwright CLI no setup manual.
**Procedure:** login com a conta seed; `/space` redireciona para `/space/logica-de-programacao`; o mapa
mostra os dez planetas e Aurora como "Próximo passo", com o mapa posicionado nela; abrir Aurora;
passar o mouse na estrela 1 e usar "Começar história"; concluir a história provisória; voltar ao
mapa; usar "Revisar história" na estrela 1 e voltar.
**Approval condition:** `PUT …/open` `200`; animação do cadeado vista uma vez; estrela 1 "Concluída",
estrela 2 "Disponível", contador "1 de 4"; revisar não muda o progresso; `GET /auth/account`,
`GET /profile/users/id/:id`, `GET /space/galaxies/:slug/planets` e a recompensa `2xx`; capturas para
VV-01–VV-04 e VV-11.

### MV-02 — Caminho feliz no mobile (390×844)

**Criteria:** CA-26, CA-29, CA-36
**Tool / setup:** mesmo setup, viewport 390×844, estado após MV-01.
**Procedure:** tocar a estrela 2, fechar o painel, tocar de novo e usar "Começar história"; voltar,
rolar até o item atual sair da tela e usar o FAB.
**Approval condition:** painel inferior com fundo atenuado; fechar mantém a rolagem e o foco; a lição
abre; o FAB aparece só fora da área visível e traz a estrela atual; sem scroll horizontal; capturas
para VV-05–VV-10.

### MV-03 — Primeira execução em staging

**Criteria:** CA-39, CA-45
**Tool / setup:** GitHub Actions e Coolify de staging configurados pelo usuário; leitura somente
consultiva do resultado.
**Procedure:** disparar `initial_cutover` uma vez; depois um push em `main` que toque o Server.
**Approval condition:** ambos os runs verdes, migrations `0000`–`0008` no ledger, seed concluído,
deploy com o SHA esperado e health `2xx`; as dez imagens servidas por `STAGING_CDN_URL`. Fica `Blocked` no Evaluation até o staging existir; não
substitui AV-05.

## Visual

### VV-01 — Mapa com painel de detalhes, desktop

**Criteria:** CA-22, CA-24, CA-25
**Reference / setup:** `🖥️ Desktop` / `Espaço / Galáxia / Desktop`; 1440×900; captura de MV-01 com a
estrela 2 em hover após concluir a 1.
**Capture / comparison:** export atual pelo Doop MCP (`get_frame_screenshot`) contra a captura Playwright.
**Approval condition:** composição, hierarquia, espaçamentos, tipografia, cores, bordas, ícones e
estados conferem; divergências só as da matriz; o `GalaxyControl` não cobre nenhuma estrela e a
trilha pontilhada liga o último item de cada planeta ao planeta seguinte.

### VV-02 — Planeta liberado, desktop

**Criteria:** CA-22, CA-23
**Reference / setup:** `Espaço / Galáxia / planeta liberado / Desktop`; 1440×900; captura de MV-01
antes de abrir Aurora (Trívia na referência; Aurora na captura).
**Capture / comparison:** idem VV-01.
**Approval condition:** idem VV-01; "Abrir planeta" como rótulo dentro do botão único.

### VV-03 — Planeta recém-aberto, desktop

**Criteria:** CA-32
**Reference / setup:** `Espaço / Galáxia / planeta aberto / Desktop`; 1440×900; captura logo após abrir.
**Capture / comparison:** idem VV-01.
**Approval condition:** idem VV-01; placa "Aberto" sem "Rever vídeo".

### VV-04 — FAB, desktop

**Criteria:** CA-29
**Reference / setup:** `Espaço / Galáxia / FAB de retorno / Desktop`; 1440×900; item atual acima da área visível.
**Capture / comparison:** idem VV-01.
**Approval condition:** aparência do FAB, posição e seta; o `GalaxyControl` não cobre a trilha rolada.

### VV-05 — Mapa, mobile

**Criteria:** CA-22
**Reference / setup:** `📱 Mobile` / `Espaço / Galáxia / Mobile`; 390×844; captura de MV-02.
**Capture / comparison:** idem VV-01.
**Approval condition:** idem VV-01.

### VV-06 — Planeta liberado, mobile

**Criteria:** CA-22, CA-23
**Reference / setup:** `Espaço / Galáxia / planeta liberado / Mobile`; 390×844.
**Capture / comparison:** idem VV-01.
**Approval condition:** idem VV-02.

### VV-07 — Planeta bloqueado, mobile

**Criteria:** CA-23
**Reference / setup:** `Espaço / Galáxia / planeta bloqueado / Mobile`; 390×844.
**Capture / comparison:** idem VV-01.
**Approval condition:** cadeado parado, condição de liberação, opacidade reduzida.

### VV-08 — Planeta recém-aberto, mobile

**Criteria:** CA-32
**Reference / setup:** `Espaço / Galáxia / planeta aberto / Mobile`; 390×844.
**Capture / comparison:** idem VV-01.
**Approval condition:** idem VV-03.

### VV-09 — FAB, mobile

**Criteria:** CA-29
**Reference / setup:** `Espaço / Galáxia / FAB de retorno / Mobile`; 390×844.
**Capture / comparison:** idem VV-01.
**Approval condition:** idem VV-04; o FAB não cobre o painel inferior aberto.

### VV-10 — Painel inferior de detalhes, mobile

**Criteria:** CA-25, CA-26
**Reference / setup:** `Espaço / Galáxia / Detalhes da estrela / Mobile`; 390×844; captura de MV-02.
**Capture / comparison:** idem VV-01.
**Approval condition:** conteúdo, alvos de 44 px e encaixe definidos na matriz; sem recompensas.

### VV-11 — Abertura do cadeado

**Criteria:** CA-32, CA-34
**Reference / setup:** `Espaço / Galáxia / Planeta / animação de abertura do cadeado / Desktop`;
sequência de capturas de MV-01 durante a abertura.
**Capture / comparison:** quadros da captura contra os quatro quadros do storyboard.
**Approval condition:** cadeado fecha → abre → desfaz → planeta em cor plena, uma vez; arte provisória
aceita.

# Documentation alignment and revision history

## Alinhamento documental

- `documentation/architecture.md`: o fluxo "Galáxias" passa a dizer que o progresso vem de fatos
  (`users_completed_stars`, `users_opened_planets`) derivados por `GalaxyTrail`; novo fluxo "Trilha da
  galáxia" (abrir planeta, concluir estrela, guardas) e o CD de staging.
- `documentation/infrastructure.md`: serviço Server de staging, workflow, secrets do environment
  `staging`, seed a cada deploy, pré-condição de produção (pausa, backup, release conjunto).
- `documentation/github-flow.md`: seção Staging inclui o Server; implantação de produção registra a
  pré-condição.
- `documentation/tooling.md`: `db:seed:staging` e a guarda; a linha "Qualidade web" já foi
  acrescentada em 2026-11-17 a pedido do usuário, antes desta Spec.
- Os PRDs não mudam. Lacunas registradas: nenhuma Rule define testes de workflows de CI (AV-08 é só
  inspeção, sem ferramenta nova); nenhuma Rule cobre `packages/studio`.
- **Rule Pack:** `ui-layer-rules.md`, `widget-tests-rules.md`, `web-app-routes-testing-rules.md`,
  `web-application-rules.md`, `rest-layer-rules.md`, `rpc-layer-rules.md`, `core-package-rules.md`,
  `use-cases-testing-rules.md`, `domain-objects-testing-rules.md`, `server-application-rules.md`,
  `database-rules.md`, `handlers-testing-rules.md`, `server-routes-testing-rules.md`,
  `queue-layer-rules.md`, `provision-layer-rules.md`, `backoffice-application-rules.md`,
  `story-writing-rules.md`, `code-conventions-rules.md`, `penpot-rules.md`, `mcp-rules.md`.

## Histórico de revisões

| Revisão | Data | Mudança |
| --- | --- | --- |
| 1 | 2026-11-17 | Criação a partir da Issue #613 e dos PRDs; decisões Q1–Q20 e revisão de design em cinco seções. Design Contract pendente de `/review-design` dos cinco boards Desktop. |
| 2 | 2026-11-17 | Spec Reviewer na revisão 1 (`findings`): `ForbiddenError` + `HonoApp` para o `403`; `PlanetCompletedEvent` publicado por `CompleteStarUseCase` após gravar (`GetStarCompletionUseCase` só lê); `StarDetailsSheet` vira alias que renderiza o widget público `StarDetails`; `CreateUserJob.test.ts`; rotas `FetchCurrentGalaxy`, `EnterGalaxy` e `GenerateUsersXlsxFile` no mapa e em AV-04; remoção do teste proibido de `ExcelJsXlsxProvider`; `ObserveNewUnlockedAchievementsUseCase.ts`; `authorizeOwner` nas escritas e CA-43; `count_user_completed_stars` em DT-06; Rule Pack com Provision, Backoffice e Story writing; lacuna de Studio; AV-08 só inspeção; remoção de `HandleStarsNewOrderJob`/`UseCase` e `SpaceOrderChangedEvent`, cobertos por Q8. |
| 3 | 2026-11-17 | Reverificação do Spec Reviewer na revisão 2 (`findings`, um item baixo): CA-43, RF-05 e Ownership passam a esperar `404` (`UserNotFoundError`), coerente com `accountVisibility` em `findById`. Spec Reviewer na revisão 3: `clear` (arquitetura, ownership, dependências, Rules e paths aprovados). |
| 4 | 2026-11-17 | `/review-design` regravou o registro (revn 624, onze boards, `pass`); Design Contract sem bloqueio; desvios aprovados: `GalaxyControl` sem cobrir a trilha e trilha contínua entre planetas; diálogos de vídeo fora do registro e fora desta Spec. Spec Reviewer na revisão 4: `clear`. |
| 5 | 2026-11-18 | Imagens próprias dos dez planetas (`planet-<slug>-image.webp`) no seed, em `0007` e no R2 de staging pelo CD (RF-19, CA-44, CA-45, `seed-staging-assets.mjs`); `storage:seed` aceita WebP e remove obsoletos; sete SVGs antigos removidos; envio ao R2 de produção documentado como passo manual do release. Spec Reviewer na revisão 5: `clear`, com uma nota baixa aplicada (as três variables nomeadas nas linhas de `infrastructure.md` e `tooling.md`). |
| 5 | 2026-11-18 | Aprovada pelo usuário; status `open`. |
| 6 | 2026-11-19 | Amendment da implementação: o catálogo tem 41 estrelas (a soma da tabela de RF-01; "42" era erro de contagem); saem do mapa `DrizzleStar.ts`, `DrizzlePlanet.ts`, `DrizzleStarsRepository.ts` e `DrizzlePlanetsRepository.ts` (`description` e `concept` já chegam pelo model); entram no mapa `HonoHttp.ts` (corpo vazio do `PUT …/open`), `CompleteSpaceController.ts` e seu teste, o teste de montagem do Inngest e as três peças de `Animation` (`onLoadError`). `SpaceContext` também expõe `isStarDetailsOpen`/`openStarDetails`/`closeStarDetails` (painel inferior mobile) e o limite de 1024 px conta como mobile; `Image` aceita `.webp`; `Fab` sobe acima da navegação inferior no mobile e fica acima da lista (`z-50`); `CalculateRewardForStarCompletionUseCase` não divide por zero (estrela sem perguntas paga 0); `next.config.js` libera IP local para o otimizador só em desenvolvimento; o seed local de assets aceita galáxias que reutilizam a animação de outra (trilha anterior). |
| 7 | 2026-11-19 | Amendment da implementação: o planeta deixa de ter ícone. `icon` sai de `Planet`, `PlanetDto`, do faker, dos casos de uso `CreatePlanetUseCase`/`UpdatePlanetUseCase`, da interface `SpaceService`, do model e do mapper Drizzle, das rotas e controllers de planeta, do seed (`seed-catalog.json` e nove SVGs de ícone) e do formulário e da listagem do Backoffice; a migration `0009_drop_planet_icon` remove `planets.icon`; a Web renderiza a placa do planeta sem a miniatura e com a arte maior (88 px no mobile, 140 px no desktop). A coluna "Ícone provisório" do catálogo de RF-01 e o desvio de design "ícones provisórios" saem. Entram no mapa 34 paths (`0009` e snapshot, adapter legado, rotas, controllers e testes, Web, Backoffice). A migration `0007` mantém o `icon` nos `INSERT`, pois roda antes de `0009`. Pendentes: o PRD `space-management-planets-and-stars-prd.md` ainda pede ícone no cadastro, e os testes de rota e de migration não rodaram nesta revisão. |
| 8 | 2026-11-19 | Amendment da implementação: as dez imagens de planeta passam de WebP estático 512 × 512 para WebP animado 256 × 256 em loop (24 a 30 quadros, 221 a 373 KB cada, cerca de 3,2 MB no total), com o planeta parado e só os elementos ao redor se movendo (luzes, órbitas, água, engrenagens, brilhos e estrelas). Foram gerados por script a partir das imagens estáticas, sem arte nova; `PlanetView` serve a arte com `unoptimized` e 88 px (mobile) ou 140 px (desktop). Nenhum path novo no mapa. Pendentes: alternativo estático para `prefers-reduced-motion`, revalidação de AV-10 e das capturas visuais, e envio das imagens novas ao R2 de staging. |
| 9 | 2026-11-21 | Revisão visual pelo Doop MCP (Visual Reviewer, rodada 5, FAIL com três achados baixos): o usuário aceitou como adaptações o texto "Abra o planeta para liberar" nas estrelas de planeta não aberto (ACH-22), o painel de detalhes ancorado ao topo da coluna no desktop (ACH-23) e a cor lilás acinzentada da estrela bloqueada (ACH-24); registrados em "Precedência e mapeamento". A fonte canônica do design passa a ser o canvas Doop `StarDust`, com os mesmos nomes de frame. Nenhum path novo no mapa. |
| 10 | 2026-11-21 | Decisão do usuário após a falha de AV-10 no mobile: só o planeta atual anima. `usePlanet` expõe `isAnimated` (planeta que é o item atual ou que contém a estrela atual) e `PlanetView` aplica `unoptimized` só a ele; os outros nove planetas passam pelo otimizador do Next.js e mostram o primeiro quadro (em telas de densidade alta, onde a largura pedida passa de 256 px, o otimizador devolve o arquivo original e o planeta também anima). Nenhum path novo no mapa. |
| 11 | 2026-11-22 | Decisão do usuário ao resolver o feedback do PR: `getCurrentGalaxyTrail` deixa de ser arquivo próprio e vira função interna de `AccessStarPageAction.ts`, com cópia interna em `AccessChallengePageAction.ts`. O caminho `apps/web/src/rpc/actions/space/getCurrentGalaxyTrail.ts` sai do mapa; nenhum comportamento muda. O baseline de complexidade foi atualizado com aprovação do usuário (mesmo MI, novos arquivos). |
