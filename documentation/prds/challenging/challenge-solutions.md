---
title: Soluções de Desafio
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/40
last_updated_at: 2026-07-31
---

# PRD — Soluções de Desafio

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O **Challenge Solutions** e a area da plataforma StarDust onde estudantes podem
consultar, publicar, editar e discutir solucoes de um desafio. A funcionalidade
permite que uma solucao tenha titulo, conteudo em MDX, autor, metricas de
upvotes, visualizacoes, comentarios e vinculo direto ao desafio resolvido.

**Objetivo:** transformar solucoes de usuarios em material educacional
consultavel, permitindo que estudantes comparem abordagens, aprendam com outras
pessoas e compartilhem a propria explicacao apos resolver um desafio.

**Problema resolvido:** depois de concluir um desafio, o estudante nao tem uma
forma estruturada de entender abordagens alternativas, avaliar solucoes de outras
pessoas ou publicar o raciocinio usado. A feature cria um espaco de aprendizado
pos-resolucao, sem misturar a tentativa individual com respostas prontas.

**Valor entregue:** aumenta a troca de conhecimento entre estudantes, incentiva a
escrita de explicacoes tecnicas, cria sinais sociais de qualidade por upvotes,
views e comentarios, e preserva o bloqueio de solucoes antes da resolucao do
desafio para reduzir spoiler.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/40 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

🚧 Em construção — objetivos e métricas estruturados não estão registrados no documento legado.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Acesso e Bloqueio de Solucoes

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Acesso e Bloqueio de Solucoes.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O sistema deve controlar quando um usuario pode visualizar a
listagem e os detalhes de solucoes de um desafio.

##### Regras de Negocio

- **Usuario nao autenticado:** nao pode acessar solucoes de outros usuarios e
  deve receber um dialogo solicitando login.
- **Usuario autenticado com acesso liberado:** pode abrir a aba `Solucoes` e
  visualizar a listagem e os detalhes das solucoes.
- **Conclusao do desafio:** concluir corretamente o desafio libera comentarios e
  solucoes para o usuario autenticado.
- **Autor do desafio:** o autor do desafio pode visualizar solucoes do proprio
  desafio.
- **Desbloqueio manual:** usuario autenticado com solucoes bloqueadas pode
  desbloquear o acesso pagando `10` starcoins.
- **Saldo insuficiente:** se o usuario nao tiver starcoins suficientes, o sistema
  deve exibir feedback de erro e manter as solucoes bloqueadas.
- **Tentativa de acesso direto:** ao acessar listagem ou detalhe sem permissao, o
  sistema deve abrir um dialogo explicando que o desafio precisa ser resolvido
  antes de ver solucoes.
- **Retorno ao desafio:** ao fechar o dialogo de conteudo bloqueado, o usuario
  deve voltar para a rota principal do desafio.

##### Regras de Experiência

- **Aba bloqueada:** a aba `Solucoes` deve aparecer com cadeado quando o acesso
  estiver bloqueado.
- **Dialogo de desbloqueio:** deve informar o custo em starcoins, o saldo atual e
  pedir confirmacao antes de liberar acesso.
- **Abertura pelo clique na aba:** clicar diretamente na aba `Solucoes` bloqueada
  deve abrir o dialogo de desbloqueio sem navegar antecipadamente.
- **Feedback imediato:** erro de saldo insuficiente deve aparecer sem navegar
  para a listagem.
- **Loading de verificacao:** enquanto a visibilidade e verificada, o conteudo
  protegido deve exibir estado de carregamento.
- **Consistencia:** a regra de bloqueio deve valer tanto para navegacao por abas
  quanto para acesso direto por URL.

---

#### RP-02 — Listagem de Solucoes

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listagem de Solucoes.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O usuario autorizado deve conseguir navegar pelas solucoes de um
desafio, buscar por titulo, alternar entre todas as solucoes e suas proprias
solucoes, ordenar resultados e carregar mais itens.

##### Regras de Negocio

- **Escopo do desafio:** a listagem deve apresentar solucoes associadas ao
  desafio atual.
- **Paginacao:** a listagem deve carregar `15` solucoes por pagina.
- **Busca por titulo:** o usuario pode filtrar solucoes pelo titulo informado no
  campo de busca.
- **Filtro de autoria:** o usuario pode alternar entre `Todas solucoes` e
  `Suas solucoes`.
- **Ordenacao:** a listagem deve suportar ordenacao por solucoes mais recentes,
  mais votadas, mais comentadas e mais visualizadas.
- **Fim da listagem:** quando nao houver mais itens, o controle de carregar mais
  nao deve ser exibido.
- **Estado vazio:** quando nenhum resultado for encontrado, a interface deve
  informar que nao ha solucoes.

##### Regras de Experiência

- **Busca visivel:** o campo de busca deve ficar no topo da listagem.
- **Menu de ordenacao:** o seletor deve deixar claro qual ordenacao esta ativa,
  como `Mais recentes`, `Mais votadas` ou `Mais comentadas`.
- **Segmentacao de autoria:** os botoes `Todas solucoes` e `Suas solucoes` devem
  indicar visualmente o filtro selecionado.
- **Cards de solucao:** cada item deve exibir avatar do autor, nome do autor,
  titulo da solucao, contagem de upvotes, visualizacoes, comentarios e data de
  postagem.
- **Skeletons:** enquanto a listagem carrega, a UI deve exibir placeholders dos
  cards.
- **Mobile:** em telas menores, a listagem deve manter navegacao para descricao e
  comentarios sem sobrepor filtros ou cards.

---

#### RP-03 — Visualizacao de Solucao

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Visualizacao de Solucao.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O usuario autorizado deve conseguir abrir uma solucao especifica,
ler seu conteudo e interagir com metricas, voto e comentarios.

##### Regras de Negocio

- **Acesso por slug:** cada solucao deve ser acessivel por slug dentro do desafio.
- **Incremento de view:** abrir uma solucao deve registrar uma visualizacao.
- **Conteudo MDX:** o conteudo da solucao deve ser renderizado em MDX.
- **Voltar para listagem:** a pagina de detalhe deve oferecer retorno para a lista
  de solucoes do desafio.
- **Solucao recem-criada:** quando a solucao for aberta logo apos a publicacao, a
  interface pode exibir celebracao visual.
- **Metricas:** o detalhe deve exibir upvotes, visualizacoes, comentarios e data
  de postagem.
- **Autor:** o detalhe deve exibir dados do autor, incluindo avatar e nome.

##### Regras de Experiência

- **Hierarquia visual:** titulo, autor e metricas devem aparecer antes do
  conteudo da solucao.
- **Leitura:** o conteudo MDX deve preservar quebras de linha e blocos de codigo.
- **Navegacao:** o link `Ver todas as solucoes` deve ser claro e permanecer no
  topo do detalhe.
- **Celebracao:** a animacao de confete deve ser discreta e aparecer somente no
  contexto de solucao nova.
- **Conteudo bloqueado:** se o usuario nao puder ver solucoes, o detalhe deve
  mostrar o dialogo de bloqueio em vez do conteudo.

---

#### RP-04 — Publicacao de Solucao

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Publicacao de Solucao.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Um usuario autenticado deve poder publicar sua propria solucao
para um desafio, com titulo e conteudo explicativo.

##### Regras de Negocio

- **Autenticacao obrigatoria:** apenas usuarios autenticados podem publicar
  solucoes.
- **Desafio existente:** a solucao so pode ser publicada para um desafio valido.
- **Titulo obrigatorio:** a solucao deve ter titulo preenchido.
- **Conteudo obrigatorio:** a solucao deve ter conteudo preenchido.
- **Titulo unico:** nao deve ser permitido publicar solucao cujo slug de titulo
  ja esteja em uso.
- **Autor da solucao:** a solucao publicada deve ser associada ao usuario atual.
- **Preenchimento inicial:** quando houver codigo salvo localmente para o
  desafio, o editor pode pre-preencher o conteudo com uma estrutura contendo
  `# Abordagem`, `## Codigo` e o bloco `<Code>`.
- **Redirecionamento apos publicar:** ao publicar com sucesso, o usuario deve ser
  levado para o detalhe da solucao recem-criada.

##### Regras de Experiência

- **CTA de publicacao:** a listagem deve exibir `Compartilhar sua solucao` quando
  o usuario ja tiver concluido o desafio.
- **Editor dedicado:** criacao deve acontecer em uma pagina de edicao com campo
  de titulo e editor de conteudo.
- **Botao de acao:** o botao deve indicar estados como `postar`, `postando...`,
  `postado` e `erro`.
- **Acao desabilitada:** o envio deve ficar desabilitado enquanto titulo ou
  conteudo estiverem vazios.
- **Retorno:** a pagina de publicacao deve oferecer link para voltar a listagem
  de solucoes.
- **Erro:** falhas de publicacao devem ser comunicadas por toast.

---

#### RP-05 — Edicao e Remocao da Propria Solucao

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Edicao e Remocao da Propria Solucao.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O autor de uma solucao deve conseguir atualizar ou remover sua
propria publicacao.

##### Regras de Negocio

- **Edicao pelo autor:** somente o autor deve acessar a pagina de edicao de uma
  solucao existente.
- **Bloqueio de nao autor:** se outro usuario tentar acessar a edicao, o sistema
  deve rejeitar a acao.
- **Atualizacao de titulo:** alterar o titulo deve atualizar tambem o slug da
  solucao.
- **Validacao de titulo unico:** ao editar, se o novo titulo ja estiver em uso por
  outra solucao, a alteracao deve ser rejeitada.
- **Atualizacao de conteudo:** alterar o conteudo deve substituir a versao atual
  da solucao.
- **Remocao pela UI:** a opcao de deletar deve aparecer apenas para o autor da
  solucao.
- **Confirmacao de exclusao:** excluir a solucao deve exigir confirmacao em
  dialogo.
- **Redirecionamento apos remover:** depois da exclusao, o usuario deve voltar
  para a listagem de solucoes do desafio.

##### Regras de Experiência

- **Botao de editar:** no detalhe, o autor deve ver `editar sua solucao`.
- **Botao de deletar:** no detalhe, o autor deve ver `deletar sua solucao` em
  destaque destrutivo.
- **Dialogo de confirmacao:** a exclusao deve explicar que outros usuarios nao
  poderao visualizar a solucao.
- **Botao de acao de edicao:** o editor deve indicar estados como `atualizar`,
  `atualizando...`, `atualizado` e `erro`.
- **Criar propria solucao:** usuarios autenticados que nao sao autores da solucao
  visualizada devem ver um caminho para criar sua propria solucao.

---

#### RP-06 — Upvote de Solucao

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Upvote de Solucao.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Usuarios autenticados devem conseguir avaliar solucoes de outros
usuarios com upvote.

##### Regras de Negocio

- **Toggle de upvote:** clicar em uma solucao ainda nao votada adiciona upvote;
  clicar novamente remove o upvote.
- **Contagem atualizada:** a contagem de upvotes deve refletir o retorno do
  servidor apos a acao.
- **Atualizacao otimista:** a UI pode atualizar a contagem imediatamente antes da
  confirmacao do servidor.
- **Autor nao vota:** o autor da solucao nao pode votar na propria solucao.
- **Usuario nao autenticado:** usuario sem autenticacao nao deve executar upvote.
- **Solucao inexistente:** tentar votar em solucao inexistente deve retornar erro
  de solucao nao encontrada.

##### Regras de Experiência

- **Estado votado:** quando o usuario ja deu upvote, o icone e a contagem devem
  usar destaque visual.
- **Estado neutro:** quando nao ha upvote do usuario, o botao deve aparecer em
  estado neutro.
- **Botao desabilitado para autor:** o autor deve visualizar o botao sem conseguir
  interagir.
- **Baixa friccao:** o voto deve ser acionado no detalhe da solucao, junto das
  metricas principais.

---

#### RP-07 — Comentarios em Solucao

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Comentarios em Solucao.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O detalhe de uma solucao deve permitir leitura e publicacao de
comentarios relacionados aquela solucao.

##### Regras de Negocio

- **Listagem por solucao:** comentarios devem ser carregados usando o identificador
  da solucao atual.
- **Publicacao:** usuarios autorizados devem poder postar comentario na solucao.
- **Erro de publicacao:** falhas ao comentar devem gerar feedback por toast.
- **Contagem:** a solucao deve exibir a quantidade de comentarios registrada nas
  metricas.
- **Estado vazio:** quando nao houver comentarios, a UI deve informar que aquela
  solucao ainda nao tem comentarios.

##### Regras de Experiência

- **Posicao previsivel:** comentarios devem aparecer abaixo do conteudo da
  solucao.
- **Placeholder contextual:** o campo de comentario deve deixar claro que o
  comentario e sobre a solucao do desafio.
- **Mensagem vazia:** a listagem vazia deve incentivar o primeiro comentario.
- **Consistencia:** a experiencia deve reutilizar o componente global de
  comentarios da plataforma.

---

#### RP-08 — Responsividade, Navegacao e Estados

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Responsividade, Navegacao e Estados.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** A experiencia de solucoes deve funcionar dentro do layout de
desafio e tambem nas paginas dedicadas de criacao/edicao.

##### Regras de Negocio

- **Rota de listagem:** a listagem de solucoes fica associada a
  `/challenging/challenges/[challengeSlug]/challenge/solutions`.
- **Rota de detalhe:** o detalhe de solucao fica associado a
  `/challenging/challenges/[challengeSlug]/challenge/solutions/[solutionSlug]`.
- **Rota de criacao:** a criacao de solucao fica associada a
  `/challenging/challenges/[challengeSlug]/solution`.
- **Rota de edicao:** a edicao de solucao fica associada a
  `/challenging/challenges/[challengeSlug]/solution/[solutionSlug]`.
- **Aba ativa:** ao navegar para `solutions`, a aba ativa do desafio deve refletir
  o conteudo de solucoes.
- **Cache paginado:** a listagem deve evitar recarregamentos desnecessarios
  enquanto filtros e ordenacao nao mudarem.

##### Regras de Experiência

- **Desktop:** solucoes devem funcionar como aba dentro do layout de desafio,
  preservando contexto do enunciado/editor.
- **Mobile:** deve haver navegacao compacta entre descricao, comentarios e
  solucoes.
- **Sem sobreposicao:** abas, filtros, cards, conteudo MDX, dialogos e comentarios
  nao devem se sobrepor.
- **Feedback de carregamento:** listagem, verificacao de acesso e acoes de escrita
  devem ter estados visuais claros.
- **Links consistentes:** todos os links devem manter o usuario no contexto do
  desafio correto.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

### 3. Fluxo de Usuario (User Flow)

#### JN-01 — Usuario visualiza solucoes apos resolver um desafio

1. O usuario autenticado acessa a pagina de um desafio.
2. O usuario resolve o desafio corretamente.
3. O sistema marca o desafio como concluido e libera comentarios e solucoes.
4. O usuario abre a aba `Solucoes`.
5. O sistema exibe busca, filtros, ordenacao e lista paginada de solucoes.
6. O usuario clica em uma solucao.
7. O sistema registra a visualizacao e exibe o detalhe com conteudo, autor,
   metricas, upvote e comentarios.

#### JN-02 — Usuario desbloqueia solucoes antes de concluir

1. O usuario autenticado acessa um desafio com solucoes bloqueadas.
2. O usuario clica na aba `Solucoes` bloqueada.
3. O sistema abre o dialogo de desbloqueio informando custo e saldo.
4. O usuario confirma a acao:
   - **Saldo suficiente:** o sistema debita `10` starcoins, libera a visibilidade
     e navega para a listagem de solucoes.
   - **Saldo insuficiente:** o sistema exibe feedback de erro e permanece no
     desafio.

#### JN-03 — Usuario publica sua solucao

1. O usuario conclui o desafio.
2. O usuario abre a listagem de solucoes.
3. O sistema exibe o CTA `Compartilhar sua solucao`.
4. O usuario acessa a pagina de publicacao.
5. O sistema exibe campo de titulo e editor de conteudo.
6. Se houver codigo salvo localmente, o sistema sugere uma estrutura inicial com
   abordagem e bloco de codigo.
7. O usuario preenche titulo e conteudo.
8. O usuario clica em `postar`.
9. O sistema valida titulo unico, desafio existente e usuario autenticado:
   - **Sucesso:** cria a solucao e redireciona para o detalhe com indicacao de
     solucao nova.
   - **Falha:** exibe mensagem de erro.

#### JN-04 — Autor edita ou remove a propria solucao

1. O autor abre o detalhe da propria solucao.
2. O sistema exibe botoes de editar e deletar.
3. Para editar, o usuario abre a pagina de edicao, altera titulo ou conteudo e
   confirma a atualizacao.
4. O sistema valida permissao de autoria e titulo unico:
   - **Sucesso:** atualiza a solucao e redireciona para o detalhe.
   - **Falha:** exibe erro e mantem o usuario na edicao.
5. Para deletar, o usuario abre o dialogo de confirmacao.
6. Ao confirmar, o sistema remove a solucao e redireciona para a listagem.

#### JN-05 — Usuario interage com uma solucao

1. O usuario abre uma solucao de outro autor.
2. O usuario clica em upvote.
3. O sistema atualiza a contagem de forma otimista e confirma a contagem com o
   servidor.
4. O usuario le ou publica comentarios no final da solucao.
5. Se a publicacao de comentario falhar, o sistema exibe toast de erro.

#### JN-06 — Acesso direto sem permissao

1. O usuario acessa diretamente uma URL de listagem ou detalhe de solucao.
2. O sistema verifica se as solucoes estao liberadas para o usuario.
3. Se nao estiverem liberadas, o sistema abre dialogo informando que o desafio
   deve ser resolvido antes de ver solucoes.
4. Ao fechar o dialogo ou clicar em `Resolver desafio`, o usuario volta para a
   pagina principal do desafio.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Geracao automatica de solucoes por IA. |
| Escopo | Revisao automatica de qualidade da solucao. |
| Escopo | Execucao do codigo publicado dentro da propria solucao. |
| Escopo | Comparacao automatica entre solucoes. |
| Escopo | Deteccao de plagio ou similaridade entre solucoes. |
| Escopo | Ranking global de autores de solucoes. |
| Escopo | Moderacao, denuncia ou ocultacao de solucoes por conteudo inadequado. |
| Escopo | Versionamento historico de edicoes da solucao. |
| Escopo | Solucoes privadas, nao listadas ou compartilhadas por permissao. |
| Escopo | Colaboracao em tempo real na escrita de solucoes. |
| Escopo | Internacionalizacao automatica do conteudo publicado. |
| Escopo | Persistencia de progresso de leitura da solucao. |
| Escopo | **Nao identificado:** a auditoria da codebase nao encontrou registro formal de |
| Escopo | [x] **Solução Oficial da Plataforma** |
| Escopo | Um desafio pode possuir uma solução oficial cadastrada. |
| Escopo | Quando não houver solução oficial, nenhuma chamada ou rota específica para a solução oficial deve ser exibida. |
| Escopo | Quando houver solução oficial e a área de soluções estiver disponível, a interface deve exibir uma chamada destacada para ela. |
| Escopo | A solução oficial deve ser exibida em um slot próprio da plataforma, separado do detalhe das soluções publicadas por usuários. |
| Escopo | O slot deve renderizar o código usando o Code Playback, incluindo input, passos, linha ativa, estado das estruturas, explicação e controles de reprodução. |
| Escopo | O acesso à solução oficial deve respeitar as mesmas regras de disponibilidade da área de soluções. |
| Escopo | Quando a área de soluções estiver bloqueada, o acesso direto ou indireto à solução oficial não deve expor seu conteúdo. |
| Escopo | Quando a área de soluções for liberada, a chamada e o slot da solução oficial devem ficar disponíveis. |
| Escopo | A visualização da solução oficial é educacional e não deve executar o código real do desafio. |
| Escopo | A chamada da solução oficial deve aparecer em destaque na área de soluções quando existir. |
| Escopo | O acesso deve levar o usuário ao slot dedicado da solução oficial, mantendo o contexto do desafio. |
| Escopo | O Code Playback deve preservar o layout padrão, o modo expandido, os controles de reprodução, a timeline, a velocidade e o destaque da linha ativa. |
| Escopo | Desafios sem solução oficial devem manter o comportamento atual da área de soluções, sem exibir estados vazios específicos para a solução oficial. |

### Decisões descartadas durante a definição

- **Nao identificado:** a auditoria da codebase nao encontrou registro formal de
  comportamentos considerados e descartados durante a implementacao desta
  feature.


---
