# PRD — Página de Espaço

- **Módulo:** `space`
- **Milestone:** [#11 — Página de Espaço](https://github.com/JohnPetros/stardust/milestone/11)
- **Status:** open
- **Atualizado em:** 2026-02-28T11:52:57Z

## Definição do produto

### 1. Visao Geral

A Space Page e a tela principal de progressao da trilha espacial, onde o usuario visualiza planetas e estrelas, identifica o ponto atual da jornada e escolhe o proximo conteudo.

O problema que esta funcionalidade resolve e a falta de orientacao clara sobre onde continuar no fluxo de aprendizagem, reduzindo atrito para retomar estudos.

O objetivo principal desta versao e engajar progressao com foco em "entrar e continuar", refletindo a logica ja implementada de desbloqueio. O valor entregue e aumentar taxa de conclusao da trilha com navegacao orientada para a ultima estrela desbloqueada.

### 2. Requisitos

#### [x] Carregamento da Jornada Espacial

**Descricao:** Exibir planetas e estrelas da trilha com base nos dados oficiais de progresso ja existentes.

##### Regras de Negocio

- **Fonte Unica de Dados:** A pagina deve carregar a lista de planetas e estrelas a partir do servico de espaco, sem integracoes novas nesta versao.
- **Falha de Carregamento:** Em erro de obtencao dos planetas, o sistema deve interromper a renderizacao normal da pagina e retornar erro de execucao da rota.
- **Renderizacao Condicional da Trilha:** A listagem de planetas deve ser exibida apenas quando houver uma ultima estrela desbloqueada identificada para o usuario.

##### Regras de UI/UX

- **Feedback de Conteudo:** A tela deve apresentar o mapa espacial com planetas e estrelas em sequencia vertical.
- **Responsividade:** A pagina deve permanecer funcional em mobile e desktop.
- **Compatibilidade:** O comportamento deve funcionar nos navegadores modernos suportados pelo produto.

#### [x] Identificacao da Ultima Estrela Desbloqueada

**Descricao:** Determinar automaticamente o ponto de referencia da progressao atual do usuario para orientar navegacao e destaque de estado.

##### Regras de Negocio

- **Calculo da Ultima Estrela:** O sistema deve varrer planetas e estrelas da trilha e selecionar a ultima estrela desbloqueada para o usuario.
- **Fallback de Referencia Inicial:** Se nao houver desbloqueio explicito, o sistema deve usar a primeira estrela da trilha como referencia inicial.
- **Persistencia em Memoria de Sessao:** O identificador da ultima estrela desbloqueada deve permanecer disponivel durante a sessao da pagina para suportar scrolling e destaque.

##### Regras de UI/UX

- **Foco na Progressao Atual:** A experiencia deve deixar claro qual estrela e o proximo ponto de continuidade.
- **Confiabilidade:** Se nao houver referencia valida de estrela, a pagina nao deve executar a navegacao assistida.

#### [x] Navegacao Assistida ate a Ultima Estrela

**Descricao:** Facilitar que o usuario chegue rapidamente ao ponto atual da jornada sem scroll manual extenso.

##### Regras de Negocio

- **Auto-Centralizacao Inicial:** Ao entrar na pagina, o sistema deve rolar automaticamente ate a ultima estrela desbloqueada na primeira exibicao.
- **Acao Manual de Recentrar:** O usuario deve poder acionar um botao de acao flutuante para voltar ao ponto da ultima estrela desbloqueada.
- **Direcao Contextual do Botao:** O icone do botao deve indicar direcao de navegacao conforme a posicao da ultima estrela no viewport (acima, abaixo ou em tela).
- **Visibilidade do Botao:** O botao flutuante deve ficar oculto quando a ultima estrela ja estiver visivel na area atual da tela.

##### Regras de UI/UX

- **Acessibilidade:** O botao flutuante deve possuir rotulo acessivel para leitores de tela.
- **Feedback de Interacao:** O botao deve responder visualmente ao toque/clique.
- **Performance:** A navegacao assistida deve ser percebida como fluida em condicoes normais de uso.

#### [x] Acesso a Conteudo por Estrela

**Descricao:** Encaminhar o usuario para o conteudo correto ao clicar em uma estrela desbloqueada.

##### Regras de Negocio

- **Clique Habilitado Somente para Estrela Desbloqueada:** Estrelas bloqueadas nao devem permitir interacao de navegacao.
- **Resolucao de Destino por Regra de Conteudo:** Ao clicar em estrela desbloqueada, o sistema deve verificar se ha desafio vinculado a estrela.
- **Destino com Desafio Vinculado:** Se houver desafio associado, redirecionar para a pagina do desafio da estrela.
- **Destino sem Desafio Vinculado:** Se nao houver desafio associado, redirecionar para a pagina de licao da estrela.
- **Validacao de Acesso ao Conteudo da Estrela:** O acesso ao conteudo por slug deve validar existencia da estrela e desbloqueio para o usuario; em falha, retornar nao encontrado.

##### Regras de UI/UX

- **Feedback Imediato no Clique:** Ao clicar na estrela desbloqueada, aplicar feedback audiovisual de confirmacao antes do redirecionamento.
- **Acessibilidade:** Estrelas bloqueadas devem permanecer semanticamente desabilitadas.
- **Seguranca:** O sistema nao deve expor conteudo de estrela bloqueada por navegacao direta sem validacao.
- **Confiabilidade:** Em erro ao buscar desafio da estrela, o sistema deve manter fallback para licao da estrela quando aplicavel.

#### [x] Indicacao de Novidade e Estados de Progresso

**Descricao:** Comunicar claramente se a estrela esta bloqueada, desbloqueada ou recem-liberada.

##### Regras de Negocio

- **Estado Bloqueada/Desbloqueada:** Cada estrela deve refletir o estado de desbloqueio do usuario no momento da exibicao.
- **Sinalizacao de Conteudo Novo:** Estrelas recem-desbloqueadas devem exibir indicativo de novidade.
- **Destaque da Ultima Estrela:** A estrela de referencia da progressao deve receber destaque de contexto para orientar continuidade.

##### Regras de UI/UX

- **Feedback Visual de Estado:** Bloqueio e desbloqueio devem ser perceptiveis com contraste e simbolos distintos.
- **Responsividade:** O estado visual deve se manter compreensivel em telas menores.
- **Acessibilidade:** Elementos de estado devem ser identificaveis sem depender apenas de cor.

#### [x] Encerramento da Jornada Completa

**Descricao:** Exibir acesso ao fluxo de encerramento quando o usuario concluir todo o espaco.

##### Regras de Negocio

- **Condicao de Conclusao Total:** Quando o usuario estiver marcado como concluinte do espaco, exibir acesso ao fluxo de agradecimentos.
- **Destino de Encerramento:** O acesso deve direcionar para a pagina final de encerramento da jornada.

##### Regras de UI/UX

- **Destaque de Conquista:** O acesso de encerramento deve aparecer de forma clara apos a lista de planetas.
- **Feedback de Navegacao:** A acao de abertura do encerramento deve ter resposta visual de hover/interacao.

#### [x] Requisitos Nao Funcionais Obrigatorios

**Descricao:** Definir criterios minimos de qualidade para a Space Page na versao atual documentada.

##### Regras de Negocio

- **Metrica de Sucesso de Produto:** Monitorar taxa de conclusao de estrelas/planetas como KPI principal da pagina.
- **Escopo de Entrega:** Esta PRD documenta comportamento funcional ja implementado, sem adicionar novas integracoes.

##### Regras de UI/UX

- **Performance:** A pagina deve manter resposta fluida em scroll, clique de estrela e recentralizacao.
- **Seguranca:** O acesso ao conteudo de estrela deve respeitar autenticacao e validacao de desbloqueio.
- **Confiabilidade:** Falhas de consulta de dados devem ter comportamento previsivel (erro controlado ou fallback definido).
- **Compatibilidade:** Suporte aos navegadores e dispositivos oficialmente adotados pelo produto.

### 3. Fluxo de Usuario (User Flow)

**Nome do fluxo:** Entrada e orientacao para continuidade.

1. O usuario acessa a pagina de espaco.
2. O sistema realiza carga da trilha de planetas e estrelas.
3. O sistema valida existencia da ultima estrela desbloqueada:
   - **Sucesso:** Exibe trilha e inicia foco na estrela de referencia.
   - **Falha:** Mantem comportamento de seguranca sem navegacao assistida.
4. O usuario usa scroll livre ou acao flutuante para chegar ao ponto atual da jornada.

**Nome do fluxo:** Clique em estrela desbloqueada.

1. O usuario localiza uma estrela desbloqueada.
2. O usuario realiza clique na estrela.
3. O sistema valida se existe desafio vinculado a estrela:
   - **Sucesso:** Redireciona para desafio da estrela.
   - **Falha:** Redireciona para licao da estrela.

**Nome do fluxo:** Tentativa de acesso indevido a estrela bloqueada.

1. O usuario tenta acessar conteudo de estrela bloqueada.
2. O sistema valida desbloqueio e existencia da estrela:
   - **Sucesso:** Permite acesso ao conteudo.
   - **Falha:** Retorna pagina nao encontrada e bloqueia continuidade.

**Nome do fluxo:** Jornada concluida e encerramento.

1. O usuario completa todo o espaco.
2. O usuario acessa o atalho de agradecimentos na Space Page.
3. O sistema valida condicao de espaco concluido:
   - **Sucesso:** Redireciona para pagina final de encerramento.
   - **Falha:** Nao exibe acao de encerramento.

### 4. Fora do Escopo (Out of Scope)

- Criacao de novas regras de desbloqueio de estrelas ou planetas nesta versao.
- Inclusao de novas integracoes externas para progressao, recomendacao ou analytics avancado.
- Alteracao de contratos existentes de conteudo de estrela, licao ou desafio.
- Reformulacao ampla da experiencia visual alem dos comportamentos funcionais ja implementados.
- Mecanismos de personalizacao de trilha (ordem dinamica por usuario, atalhos inteligentes, etc.).
