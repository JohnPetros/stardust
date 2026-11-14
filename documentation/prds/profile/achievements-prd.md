---
title: Conquistas
status: draft
source:
  - type: direct-request
    ref: Reformulação do catálogo, desbloqueio, celebração e crédito de conquistas aprovada em 2026-10-31
last_updated_at: 2026-11-13
---

# PRD — Conquistas

Disponibiliza para: perfil e página de conquistas, catálogo e progresso de conquistas do aluno; conta do aluno, StarCoins de recompensa; Espaço e demais páginas do layout Home, celebração de novas conquistas; Backoffice, gestão do catálogo.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Catálogo](#6-catálogo-inicial) · [Dependências](#7-grafo-de-dependências-do-produto) · [Jornadas](#8-jornadas) · [Escopo](#9-fora-do-escopo)

## 1. Resumo Executivo

Conquistas reconhecem marcos de aprendizagem, prática, hábito, coleção e criação. O catálogo é reorganizado em oito grupos e 26 trilhas. Cada trilha é uma conquista em níveis (I, II, III, IV), com exceção das conquistas Especiais, que são únicas e ocultas até o desbloqueio.

O desbloqueio ocorre no servidor, no momento da ação que gera progresso, e não ao carregar uma página. O aluno recebe um aviso imediato e não bloqueante. As StarCoins de cada conquista são creditadas automaticamente no desbloqueio. A celebração acontece no próximo acesso a uma página do layout Home e serve para notificar o aluno do que conquistou e recebeu.

O catálogo antigo, com 18 conquistas, é excluído. O progresso de todos os usuários será reiniciado, portanto não há migração de desbloqueios ou StarCoins anteriores.

## 2. Problema e Oportunidade

O modelo atual usa seis contadores genéricos (estrelas, foguetes, desafios, planetas, XP e streak) e uma meta numérica por conquista. Ele não reconhece a qualidade da aprendizagem nas histórias, a prática independente, a criação ou momentos especiais. A verificação de novos desbloqueios só ocorre quando o layout Home é montado, o que afasta a celebração do momento que a gerou.

A reformulação da trilha (histórias interativas com vidas e questões) e a redução do total de estrelas, entre 30 e 50, exigem metas relativas ao conteúdo e trilhas que valorizem o modo como o aluno aprende, não apenas quanto ele consome.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-31 | Autoridade versionada para catálogo, desbloqueio, celebração e crédito de conquistas. |
| S2 | Decisões de produto aprovadas em 2026-10-31 | Grupos, trilhas em níveis, Especiais ocultas, momento da celebração, crédito automático, arte por trilha e exclusão do catálogo antigo. |
| S3 | [Perfil](profile-page-prd.md), RP-05 | Lista de conquistas desbloqueadas no perfil; continua válida e passa a consumir o novo catálogo. |
| S4 | [Resultado e recompensas da história](../lesson/story-result-prd.md) | Mantém conquistas fora do fluxo de resultado; a celebração ocorre depois, no Espaço. |
| S5 | [Histórias interativas](../lesson/lesson-page-prd.md) | Define vidas, questões, tentativas e conclusão das histórias que alimentam a trilha Histórias. |
| S6 | Implementação existente (entidade Achievement, ObserveNewUnlockedAchievements, RescueAchievement) | Evidência auxiliar do modelo atual; não define as regras desta revisão. |

## 3. Público-alvo

O público principal é o aluno autenticado da Web App, em desktop ou mobile. O público secundário é o administrador do Backoffice que mantém o catálogo.

Jobs to Be Done:

- Quando eu avançar na trilha, praticar ou criar algo, quero ser reconhecido no momento certo, para sentir que meu esforço conta.
- Quando eu abrir a lista de conquistas, quero ver o que falta para o próximo nível, para escolher meu próximo objetivo.
- Quando eu desbloquear uma conquista, quero receber sua recompensa sem esforço, para usar as StarCoins na loja.
- Como administrador, quero ajustar nomes, descrições, ícones, metas e recompensas, para calibrar o catálogo sem alterar código.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Celebrar perto do momento do mérito | Nenhuma meta numérica aprovada | Verificar que o desbloqueio é registrado na ação e que o aviso aparece sem recarregar a página. |
| Reconhecer como o aluno aprende | Nenhuma meta numérica aprovada | Verificar que as trilhas de qualidade (Sem arranhões, Na mosca, Por conta própria) progridem apenas pelas condições definidas. |
| Tornar o próximo objetivo visível | Nenhuma meta numérica aprovada | Verificar que cada trilha mostra nível atual, próximo nível e progresso. |
| Conceder recompensa uma única vez | Nenhuma meta numérica aprovada | Verificar que cada nível é desbloqueado e creditado no máximo uma vez por conta. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| As metas numéricas do catálogo inicial são provisórias. | Tratá-las como valores iniciais editáveis no Backoffice, não como regra fixa. |
| A trilha terá entre 30 e 50 estrelas. | Metas de exploração usam valores pequenos ou relativos ao conteúdo publicado. |
| O progresso de todos os usuários será reiniciado. | Não há migração; todos começam o novo catálogo do zero. |
| Várias trilhas dependem de dados que hoje não são registrados (tentativas e vidas por questão, tipo de questão, uso do assistente por desafio, fuso horário). | Registrar esses dados no servidor faz parte desta entrega, sem aguardar a conclusão da reformulação da lição. Dados enviados pelo cliente não são confiáveis para progresso. |
| As tentativas e vidas registradas aqui são as mesmas que [Histórias interativas](../lesson/lesson-page-prd.md) vincula à conta. | Implementar um único registro de tentativas por questão e de vidas por história, compartilhado entre lição e conquistas, sem duplicação. |
| Os tipos de questão de programação em blocos e de escrita de código são definidos por seus próprios PRDs. | Arquiteto de blocos e Mão no código registram o tipo da questão desde já e passam a progredir quando esses tipos estiverem publicados. |
| Conquistas não fazem parte do resultado da história. | Não acrescentar etapa de conquistas ao fluxo de Resultado e recompensas da história. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Grupo | Agrupamento temático de trilhas: Exploração, Histórias, Desafios, Constância, Evolução, Coleção, Criação, Especiais. |
| Trilha | Conquista com uma métrica e níveis crescentes. Possui um único ícone. |
| Nível | Etapa de uma trilha com meta e recompensa próprias. Numerado I, II, III, IV. |
| Conquista especial | Conquista única, sem níveis, oculta até o desbloqueio. |
| Meta absoluta | Valor numérico fixo (ex.: 10 estrelas). |
| Meta relativa | Valor calculado sobre o conteúdo publicado no momento da verificação (ex.: todas as estrelas, metade dos planetas). |
| Desbloqueio | Registro permanente de que a conta alcançou um nível ou uma conquista especial. |
| Crédito | Concessão automática das StarCoins de um nível no momento do desbloqueio. |

#### RP-01 — Organizar o catálogo em grupos e trilhas

Necessidades do usuário:

- Como aluno, quero conquistas organizadas por tema, para entender o que cada uma reconhece.

Resultado: catálogo com oito grupos e trilhas em níveis.

Atores: aluno autenticado; administrador.

##### Regras de Negócio

- Cada trilha pertence a exatamente um grupo e mede exatamente uma métrica.
- Cada trilha possui de 2 a 4 níveis, com metas estritamente crescentes.
- Conquistas Especiais pertencem ao grupo Especiais, têm um único nível e são ocultas.
- O catálogo inicial é o da seção 6.
- O catálogo antigo, com 18 conquistas, e todos os registros de desbloqueio associados são excluídos.

##### Regras de Experiência

- A lista apresenta as trilhas agrupadas, na ordem dos grupos da seção 6 e na ordem definida no Backoffice dentro de cada grupo.

#### RP-02 — Calcular metas absolutas e relativas

Necessidades do usuário:

- Como aluno, quero metas coerentes com o tamanho da trilha e da loja, para que sejam alcançáveis.

Resultado: metas relativas acompanham o conteúdo publicado.

Atores: sistema.

##### Regras de Negócio

- Metas relativas são calculadas sobre o conteúdo publicado no momento de cada verificação.
  - "Todas" equivale ao total publicado.
  - "Metade" equivale à metade do total publicado, arredondada para cima.
- Se o conteúdo crescer, um nível já desbloqueado permanece desbloqueado.
- Se o conteúdo diminuir, o progresso exibido é limitado a 100%.

##### Regras de Experiência

- O progresso de metas relativas mostra o valor atual e o total calculado (ex.: 18/42 estrelas).

#### RP-03 — Desbloquear no momento da ação

Necessidades do usuário:

- Como aluno, quero que a conquista seja registrada quando eu a mereço, para não perdê-la ao fechar a página.

Resultado: desbloqueios registrados no servidor junto à ação que gera progresso.

Atores: sistema.

##### Regras de Negócio

- Cada ação que altera uma métrica do catálogo verifica as trilhas dessa métrica após ser confirmada:
  - concluir uma história;
  - concluir um desafio;
  - comprar um item;
  - registrar atividade diária;
  - subir de nível;
  - publicar uma solução ou um desafio;
  - receber um voto;
  - criar um snippet.
- A verificação desbloqueia todos os níveis cuja meta foi alcançada, inclusive vários níveis de uma vez.
- Cada nível é desbloqueado no máximo uma vez por conta, mesmo com repetição ou concorrência da ação.
- Falhas na verificação não desfazem a ação original. A próxima verificação da mesma métrica recupera os níveis devidos.
- A verificação ao montar o layout Home deixa de existir como mecanismo de desbloqueio.

##### Regras de Experiência

- O aluno não precisa visitar nenhuma página para que a conquista seja registrada.

#### RP-04 — Avisar imediatamente e celebrar no layout Home

Necessidades do usuário:

- Como aluno, quero saber na hora que desbloqueei algo, sem interromper o que estou fazendo.
- Como aluno, quero um momento de celebração quando parar para respirar.

Resultado: aviso imediato não bloqueante e celebração no próximo acesso ao layout Home.

Atores: aluno autenticado.

##### Regras de Negócio

- O aviso imediato aparece na página atual assim que o desbloqueio é confirmado, inclusive na aba de resultado de um desafio. Os desbloqueios retornam na resposta da ação que os gerou.
- Desbloqueios causados por terceiros, como receber um voto, não geram aviso imediato e aparecem apenas na celebração.
- A celebração aparece no próximo acesso a uma página do layout Home (Espaço, lista de desafios, perfil e afins).
- A celebração inclui todas as conquistas desbloqueadas desde a última celebração vista.
- Se vários níveis da mesma trilha foram desbloqueados, a celebração mostra apenas o nível mais alto, com a soma das StarCoins de todos os níveis desbloqueados.
- Uma celebração vista não é repetida, mesmo ao recarregar.
- Depois de uma história, a celebração aparece no Espaço, após o fluxo de resultado, novo nível e novo streak, sem alterar esse fluxo.

##### Regras de Experiência

- O aviso imediato é um toast com ícone, nome e nível ("Conquista desbloqueada: Leitor II"), fecha sozinho e leva à página de conquistas (RP-06), na trilha desbloqueada.
- A celebração é um diálogo apenas informativo: fechá-lo não altera o crédito. Sua única ação é Continuar.
- Com uma conquista, o diálogo apresenta:
  - o rótulo "Conquista desbloqueada";
  - o ícone da trilha em destaque, no frame do nível, com um selo do nível (ex.: II);
  - o nome com o nível (ex.: Leitor II) e a descrição do que foi alcançado;
  - um bloco "Recompensa recebida" com as StarCoins creditadas (ex.: +25 StarCoins).
- Com várias conquistas, o diálogo apresenta:
  - o rótulo "Conquistas desbloqueadas" e o título com a quantidade (ex.: 3 novas conquistas!);
  - uma linha por conquista, com ícone no frame do nível, nome com nível, descrição e StarCoins do nível;
  - o "Total recebido" com a soma das StarCoins.
- StarCoins são representadas pelo ícone de moedas da biblioteca Lucide (`coins`), na cor de recompensa.
- Conquistas Especiais são reveladas na celebração.
- Referência visual: frames "Conquistas / Desktop / Diálogo · Conquista desbloqueada" e "Conquistas / Desktop / Diálogo · Várias conquistas" em `design/stardust.fig`.

#### RP-05 — Creditar recompensas automaticamente

Necessidades do usuário:

- Como aluno, quero receber minhas StarCoins sem precisar de uma ação extra, para não perder recompensas.

Resultado: StarCoins creditadas automaticamente no desbloqueio, uma única vez por nível.

Atores: aluno autenticado.

##### Regras de Negócio

- O desbloqueio e o crédito das StarCoins do nível ocorrem na mesma operação, uma única vez, mesmo com repetição ou concorrência da ação.
- Não existe estado resgatável nem ação de resgate.
- Apenas a própria conta pode consultar suas celebrações pendentes.
- Recompensas iniciais por nível:
  - I: 10 StarCoins;
  - II: 25 StarCoins;
  - III: 50 StarCoins;
  - IV: 100 StarCoins;
  - Especiais: 50 StarCoins.
- Os valores são editáveis no Backoffice.

##### Regras de Experiência

- O saldo exibido é atualizado quando o desbloqueio é confirmado.
- A celebração informa as StarCoins recebidas como já creditadas, sem botão de resgate.

#### RP-06 — Exibir a página de conquistas e o progresso

Necessidades do usuário:

- Como aluno, quero ver o que já conquistei e quanto falta para o próximo nível.

Resultado: página dedicada de conquistas, com a lista agrupada e o estado e o progresso de cada trilha.

Atores: aluno autenticado.

##### Regras de Negócio

- A lista completa de conquistas fica em uma página dedicada, `/profile/[userSlug]/achievements`, dentro do layout Home.
- A página é acessível apenas ao dono da conta. O acesso à página de conquistas de outro usuário redireciona para o perfil desse usuário.
- O botão Conquistas da barra lateral do layout Home navega para a página. A lista de conquistas na gaveta lateral deixa de existir.
- O topo da página apresenta um resumo com os níveis desbloqueados sobre o total de níveis do catálogo.
- A página apresenta uma seção por grupo, na ordem da seção 6.
- Cada trilha exibe:
  - o nível mais alto desbloqueado;
  - a meta do próximo nível;
  - o progresso atual.
- Trilhas concluídas exibem o nível máximo, sem progresso.
- Conquistas Especiais não desbloqueadas aparecem como um espaço misterioso ("???"), sem nome, descrição ou condição.
- O perfil (RP-05 de Perfil) lista os níveis desbloqueados pelo dono do perfil e, para o próprio dono, leva à página de conquistas.

##### Regras de Experiência

- Cada trilha é um cartão com o ícone no frame do nível mais alto, o nome com o nível, a meta do próximo nível, uma barra de progresso com o valor atual e a meta (ex.: 18/25 estrelas) e marcadores dos níveis da trilha, preenchidos até o nível desbloqueado.
- Ao chegar pelo toast de desbloqueio, a página rola até a trilha desbloqueada e a destaca.

- O ícone da trilha usa um frame por nível:
  - I: bronze;
  - II: prata;
  - III: ouro;
  - IV: verde estelar.
- As cores dos frames são as variáveis `achievement/tier/bronze`, `silver`, `gold` e `stellar` do design, fixas nos dois temas.
- Trilhas ainda sem nível desbloqueado exibem o ícone esmaecido.
- A ordenação por "Ordem padrão", "Desbloqueadas" e "Bloqueadas" e a busca por nome continuam disponíveis.

#### RP-07 — Gerir o catálogo no Backoffice

Necessidades do usuário:

- Como administrador, quero calibrar o catálogo sem alterar código.

Resultado: edição de apresentação, metas e recompensas.

Atores: administrador (conta god).

##### Regras de Negócio

- O administrador pode editar:
  - nome, descrição e ícone de cada trilha;
  - ordem das trilhas dentro do grupo;
  - meta e recompensa de cada nível.
- Grupos e métricas são definidos pelo produto. O Backoffice não cria novas métricas.
- Uma meta pode ser absoluta ou relativa ("todas", "metade") quando a métrica tiver um total publicado correspondente.
- Alterar uma meta não remove desbloqueios existentes.

## 6. Catálogo inicial

As metas são valores iniciais e editáveis. "Todas" e "metade" são metas relativas (RP-02).

| Grupo | Trilha | Métrica | Níveis |
| --- | --- | --- | --- |
| Exploração | Desbravador | Estrelas desbloqueadas | 1 · 10 · 25 · todas |
| Exploração | Cartógrafo | Planetas concluídos | 1 · metade · todos |
| Histórias | Leitor | Histórias concluídas | 1 · 10 · 25 · todas |
| Histórias | Sem arranhões | Histórias concluídas pela primeira vez sem perder vida | 1 · 5 · 15 |
| Histórias | Na mosca | Questões acertadas na primeira tentativa | 10 · 50 · 150 |
| Histórias | Arquiteto de blocos | Questões de programação em blocos resolvidas | 5 · 20 · 50 |
| Histórias | Mão no código | Questões de escrita de código resolvidas | 5 · 20 · 50 |
| Histórias | Persistente | Histórias concluídas após ficar sem vidas nelas | 1 · 5 |
| Desafios | Solucionador | Desafios concluídos | 1 · 10 · 30 · 75 |
| Desafios | Escalada | Desafios difíceis concluídos | 1 · 5 · 15 |
| Desafios | De primeira | Desafios concluídos na primeira submissão | 1 · 10 · 30 |
| Desafios | Por conta própria | Desafios concluídos sem usar o assistente de IA | 5 · 20 · 50 |
| Desafios | Versátil | Categorias com ao menos um desafio concluído | 3 · 6 · todas |
| Constância | Chama acesa | Maior streak alcançado | 7 · 30 · 100 · 365 |
| Constância | Dedicado | Total de dias com atividade | 10 · 50 · 150 |
| Constância | Semana cheia | Semanas com atividade nos 7 dias | 1 · 4 · 12 |
| Evolução | Ascensão | Nível alcançado | 5 · 10 · 20 · 30 |
| Coleção | Identidade | Avatares adquiridos | 1 · 5 · todos |
| Coleção | Insígnias | Insígnias adquiridas | 1 · 3 · todas |
| Coleção | Investidor | StarCoins gastas na loja | 500 · 2.000 · 10.000 |
| Criação | Inventor | Snippets criados no Playground | 1 · 10 · 30 |
| Criação | Mentor | Soluções de desafio publicadas | 1 · 5 · 20 |
| Criação | Autor | Desafios criados e publicados | 1 · 3 · 10 |
| Criação | Reconhecido | Votos recebidos em soluções e desafios publicados | 10 · 50 · 200 |
| Especiais | Coruja | Concluir uma história entre 00:00 e 04:59 | única, oculta |
| Especiais | Madrugador | Concluir uma história entre 05:00 e 06:59 | única, oculta |

Regras de contagem:

- **Histórias:** contam apenas primeiras conclusões. Revisões de histórias concluídas não geram progresso.
- **Na mosca:** conta a primeira tentativa de cada questão durante a primeira conclusão da história.
- **Persistente:** conta uma história quando o aluno fica sem vidas nela e depois a conclui.
- **Desafios:** contam apenas a primeira conclusão de cada desafio.
- **De primeira:** conta um desafio concluído sem nenhuma execução anterior com resultado diferente de aceito naquele desafio.
- **Por conta própria:** exige que o aluno não tenha enviado nenhuma mensagem ao assistente de IA naquele desafio até a conclusão. Para isso, cada conversa com o assistente passa a registrar o desafio de origem.
- **Versátil:** "todas" considera as categorias com ao menos um desafio publicado.
- **Constância:** usa a mesma definição de dia com atividade do streak.
- **Semana cheia:** considera semanas de domingo a sábado, como a visualização semanal do streak.
- **Coleção:** conta itens adquiridos, não itens equipados. Itens iniciais gratuitos não contam. "Todos" considera apenas itens compráveis e não concedidos por padrão.
- **Investidor:** soma StarCoins efetivamente debitadas em compras, inclusive as gastas em foguetes antes de sua retirada da loja.
- **Criação:** Inventor conta snippets criados, inclusive privados. Mentor conta todas as soluções publicadas. Autor conta apenas desafios públicos.
- **Reconhecido:** conta apenas votos positivos. Votos negativos são ignorados e votos próprios não contam. Votos removidos deixam de contar, mas não removem níveis já desbloqueados.
- **Especiais:** o horário considera o fuso horário do aluno, registrado na conta a partir do navegador e atualizado automaticamente quando mudar.

Todas as métricas começam em zero após o reinício do progresso. Não há cálculo retroativo a partir de dados anteriores ao lançamento.

## 7. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Histórias interativas | Conquistas | Fornecer conclusões, vidas perdidas, tentativas por questão e tipo de questão, registradas no servidor por esta entrega. |
| Desafios | Conquistas | Fornecer conclusões, dificuldade, categoria, número de submissões e uso do assistente de IA. |
| Conta do aluno | Conquistas | Fornecer streak, dias com atividade, nível e saldo de StarCoins. |
| Loja | Conquistas | Fornecer itens adquiridos e StarCoins gastas. |
| Playground e soluções | Conquistas | Fornecer snippets, soluções e desafios publicados e votos recebidos. |
| Trilha e Espaço | Conquistas | Fornecer estrelas e planetas publicados e concluídos para metas relativas. |
| Conquistas | Conta do aluno | Creditar StarCoins no desbloqueio. |
| Conquistas | Layout Home | Fornecer celebrações pendentes. |
| Backoffice | Conquistas | Manter apresentação, metas e recompensas do catálogo. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 8. Jornadas

#### JN-01 — Desbloquear durante uma história e celebrar no Espaço

1. O aluno conclui sua 10ª história, sem perder vidas.
2. O servidor registra a conclusão e desbloqueia Leitor II e Sem arranhões I.
3. Um toast aparece enquanto o fluxo de resultado segue normalmente.
4. Ao retornar ao Espaço, após as celebrações de nível e streak, o diálogo apresenta as duas conquistas.
5. As 35 StarCoins já foram creditadas no desbloqueio. O aluno toca em Continuar.

#### JN-02 — Desbloquear ao concluir um desafio

1. O aluno conclui um desafio difícil na primeira submissão.
2. O servidor desbloqueia Escalada I e De primeira I.
3. Um toast aparece na aba de resultado.
4. Ao voltar à lista de desafios, o diálogo de celebração é apresentado.

#### JN-03 — Vários níveis de uma vez

1. Uma ação faz o aluno alcançar as metas dos níveis I e II de uma trilha.
2. O servidor desbloqueia os dois níveis.
3. A celebração mostra apenas o nível II.
4. O diálogo informa a soma das StarCoins dos dois níveis, já creditadas.

#### JN-04 — Fechar a celebração

1. O aluno fecha o diálogo.
2. As StarCoins continuam creditadas.
3. A celebração não se repete.

#### JN-05 — Descobrir uma conquista especial

1. O aluno vê dois espaços "???" no grupo Especiais.
2. Conclui uma história às 23h50 do seu fuso. Nada é desbloqueado.
3. Conclui outra às 00h20. Coruja é desbloqueada e revelada.

## 9. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Ranking | Conquistas relacionadas a ligas, divisões ou promoções. |
| Migração | Preservar desbloqueios ou StarCoins do catálogo antigo; o progresso de todos será reiniciado. |
| Resultado da história | Etapa de conquistas dentro do fluxo de resultado. |
| Comunidade | Conquistas de fórum ou interação social além de votos recebidos. |
| Arte por nível | Arte exclusiva para cada nível; cada trilha tem um ícone, e o nível é indicado pelo frame. |
| Novas métricas pelo Backoffice | Criação de métricas sem mudança de produto. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Conquistas avulsas, cada uma com uma meta | Trilhas em níveis. |
| Metas absolutas grandes para estrelas e planetas | Metas pequenas ou relativas, porque a trilha tem entre 30 e 50 estrelas. |
| Conquistas de ranking (Liga, Promovido) | Removidas. |
| Seis conquistas especiais | Apenas Coruja e Madrugador. |
| Trilha Frota, por foguetes adquiridos | Removida em 2026-11-13: o foguete passou a ser único e fixo, fora da loja. Quem já a desbloqueou mantém a recompensa recebida. |
| Substituir Frota por outra trilha de coleção | Sem substituição; Coleção fica com Identidade, Insígnias e Investidor. |
| Especiais invisíveis até o desbloqueio | Espaços "???" na lista. |
| Verificar ao montar o layout Home | Verificar no servidor, na ação. |
| Lista completa na gaveta lateral do layout Home | Página dedicada `/profile/[userSlug]/achievements`, acessível apenas ao dono. |
| Página de conquistas pública | Apenas o dono vê o progresso; os demais veem os níveis desbloqueados no perfil. |
| Apenas toast ou apenas diálogo | Toast imediato e diálogo no layout Home. |
| Resgate manual por toque | Crédito automático no desbloqueio; o diálogo apenas notifica. |
| Uma arte por nível | Um ícone por trilha, com frame por nível. |
| Migrar ou creditar o catálogo antigo | Excluir o catálogo antigo; o progresso de todos será reiniciado. |
| Recompensar velocidade nas histórias | Não recompensar, para não incentivar pressa na narrativa. |
| Lançar as trilhas de qualidade das histórias após a reformulação da lição | Construir o registro de tentativas, vidas e tipo de questão nesta entrega. |
