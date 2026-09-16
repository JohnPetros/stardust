---
title: Página de Espaço
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/11
last_updated_at: 2026-02-28
---

# PRD — Página de Espaço

Disponibiliza para: space; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

A Space Page e a tela principal de progressao da trilha espacial, onde o usuario visualiza planetas e estrelas, identifica o ponto atual da jornada e escolhe o proximo conteudo.

O problema que esta funcionalidade resolve e a falta de orientacao clara sobre onde continuar no fluxo de aprendizagem, reduzindo atrito para retomar estudos.

O objetivo principal desta versao e engajar progressao com foco em "entrar e continuar", refletindo a logica ja implementada de desbloqueio. O valor entregue e aumentar taxa de conclusao da trilha com navegacao orientada para a ultima estrela desbloqueada.

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/11 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Carregamento da Jornada Espacial

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Carregamento da Jornada Espacial.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Exibir planetas e estrelas da trilha com base nos dados oficiais de progresso ja existentes.

##### Regras de Negocio

- **Fonte Unica de Dados:** A pagina deve carregar a lista de planetas e estrelas a partir do servico de espaco, sem integracoes novas nesta versao.
- **Falha de Carregamento:** Em erro de obtencao dos planetas, o sistema deve interromper a renderizacao normal da pagina e retornar erro de execucao da rota.
- **Renderizacao Condicional da Trilha:** A listagem de planetas deve ser exibida apenas quando houver uma ultima estrela desbloqueada identificada para o usuario.

##### Regras de Experiência

- **Feedback de Conteudo:** A tela deve apresentar o mapa espacial com planetas e estrelas em sequencia vertical.
- **Responsividade:** A pagina deve permanecer funcional em mobile e desktop.
- **Compatibilidade:** O comportamento deve funcionar nos navegadores modernos suportados pelo produto.

---

#### RP-02 — Identificacao da Ultima Estrela Desbloqueada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Identificacao da Ultima Estrela Desbloqueada.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Determinar automaticamente o ponto de referencia da progressao atual do usuario para orientar navegacao e destaque de estado.

##### Regras de Negocio

- **Calculo da Ultima Estrela:** O sistema deve varrer planetas e estrelas da trilha e selecionar a ultima estrela desbloqueada para o usuario.
- **Fallback de Referencia Inicial:** Se nao houver desbloqueio explicito, o sistema deve usar a primeira estrela da trilha como referencia inicial.
- **Persistencia em Memoria de Sessao:** O identificador da ultima estrela desbloqueada deve permanecer disponivel durante a sessao da pagina para suportar scrolling e destaque.

##### Regras de Experiência

- **Foco na Progressao Atual:** A experiencia deve deixar claro qual estrela e o proximo ponto de continuidade.
- **Confiabilidade:** Se nao houver referencia valida de estrela, a pagina nao deve executar a navegacao assistida.

---

#### RP-03 — Navegacao Assistida ate a Ultima Estrela

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Navegacao Assistida ate a Ultima Estrela.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Facilitar que o usuario chegue rapidamente ao ponto atual da jornada sem scroll manual extenso.

##### Regras de Negocio

- **Auto-Centralizacao Inicial:** Ao entrar na pagina, o sistema deve rolar automaticamente ate a ultima estrela desbloqueada na primeira exibicao.
- **Acao Manual de Recentrar:** O usuario deve poder acionar um botao de acao flutuante para voltar ao ponto da ultima estrela desbloqueada.
- **Direcao Contextual do Botao:** O icone do botao deve indicar direcao de navegacao conforme a posicao da ultima estrela no viewport (acima, abaixo ou em tela).
- **Visibilidade do Botao:** O botao flutuante deve ficar oculto quando a ultima estrela ja estiver visivel na area atual da tela.

##### Regras de Experiência

- **Acessibilidade:** O botao flutuante deve possuir rotulo acessivel para leitores de tela.
- **Feedback de Interacao:** O botao deve responder visualmente ao toque/clique.
- **Performance:** A navegacao assistida deve ser percebida como fluida em condicoes normais de uso.

---

#### RP-04 — Acesso a Conteudo por Estrela

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Acesso a Conteudo por Estrela.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Encaminhar o usuario para o conteudo correto ao clicar em uma estrela desbloqueada.

##### Regras de Negocio

- **Clique Habilitado Somente para Estrela Desbloqueada:** Estrelas bloqueadas nao devem permitir interacao de navegacao.
- **Resolucao de Destino por Regra de Conteudo:** Ao clicar em estrela desbloqueada, o sistema deve verificar se ha desafio vinculado a estrela.
- **Destino com Desafio Vinculado:** Se houver desafio associado, redirecionar para a pagina do desafio da estrela.
- **Destino sem Desafio Vinculado:** Se nao houver desafio associado, redirecionar para a pagina de licao da estrela.
- **Validacao de Acesso ao Conteudo da Estrela:** O acesso ao conteudo por slug deve validar existencia da estrela e desbloqueio para o usuario; em falha, retornar nao encontrado.

##### Regras de Experiência

- **Feedback Imediato no Clique:** Ao clicar na estrela desbloqueada, aplicar feedback audiovisual de confirmacao antes do redirecionamento.
- **Acessibilidade:** Estrelas bloqueadas devem permanecer semanticamente desabilitadas.
- **Seguranca:** O sistema nao deve expor conteudo de estrela bloqueada por navegacao direta sem validacao.
- **Confiabilidade:** Em erro ao buscar desafio da estrela, o sistema deve manter fallback para licao da estrela quando aplicavel.

---

#### RP-05 — Indicacao de Novidade e Estados de Progresso

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Indicacao de Novidade e Estados de Progresso.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Comunicar claramente se a estrela esta bloqueada, desbloqueada ou recem-liberada.

##### Regras de Negocio

- **Estado Bloqueada/Desbloqueada:** Cada estrela deve refletir o estado de desbloqueio do usuario no momento da exibicao.
- **Sinalizacao de Conteudo Novo:** Estrelas recem-desbloqueadas devem exibir indicativo de novidade.
- **Destaque da Ultima Estrela:** A estrela de referencia da progressao deve receber destaque de contexto para orientar continuidade.

##### Regras de Experiência

- **Feedback Visual de Estado:** Bloqueio e desbloqueio devem ser perceptiveis com contraste e simbolos distintos.
- **Responsividade:** O estado visual deve se manter compreensivel em telas menores.
- **Acessibilidade:** Elementos de estado devem ser identificaveis sem depender apenas de cor.

---

#### RP-06 — Encerramento da Jornada Completa

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Encerramento da Jornada Completa.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Exibir acesso ao fluxo de encerramento quando o usuario concluir todo o espaco.

##### Regras de Negocio

- **Condicao de Conclusao Total:** Quando o usuario estiver marcado como concluinte do espaco, exibir acesso ao fluxo de agradecimentos.
- **Destino de Encerramento:** O acesso deve direcionar para a pagina final de encerramento da jornada.

##### Regras de Experiência

- **Destaque de Conquista:** O acesso de encerramento deve aparecer de forma clara apos a lista de planetas.
- **Feedback de Navegacao:** A acao de abertura do encerramento deve ter resposta visual de hover/interacao.

---

#### RP-07 — Requisitos Nao Funcionais Obrigatorios

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Requisitos Nao Funcionais Obrigatorios.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Definir criterios minimos de qualidade para a Space Page na versao atual documentada.

##### Regras de Negocio

- **Metrica de Sucesso de Produto:** Monitorar taxa de conclusao de estrelas/planetas como KPI principal da pagina.
- **Escopo de Entrega:** Esta PRD documenta comportamento funcional ja implementado, sem adicionar novas integracoes.

##### Regras de Experiência

- **Performance:** A pagina deve manter resposta fluida em scroll, clique de estrela e recentralizacao.
- **Seguranca:** O acesso ao conteudo de estrela deve respeitar autenticacao e validacao de desbloqueio.
- **Confiabilidade:** Falhas de consulta de dados devem ter comportamento previsivel (erro controlado ou fallback definido).
- **Compatibilidade:** Suporte aos navegadores e dispositivos oficialmente adotados pelo produto.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| space | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### [x] Carregamento da Jornada Espacial

**Descricao:** Exibir planetas e estrelas da trilha com base nos dados oficiais de progresso ja existentes.

##### Regras de Negocio

- **Fonte Unica de Dados:** A pagina deve carregar a lista de planetas e estrelas a partir do servico de espaco, sem integracoes novas nesta versao.
- **Falha de Carregamento:** Em erro de obtencao dos planetas, o sistema deve interromper a renderizacao normal da pagina e retornar erro de execucao da rota.
- **Renderizacao Condicional da Trilha:** A listagem de planetas deve ser exibida apenas quando houver uma ultima estrela desbloqueada identificada para o usuario.

##### Regras de UI/UX

- **Feedback de Conteudo:** A tela deve apresentar o mapa espacial com planetas e estrelas em sequencia vertical.
- **Responsividade:** A pagina deve permanecer funcional em mobile e desktop.
- **Compatibilidade:** O comportamento deve funcionar nos navegadores modernos suportados pelo produto.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Criacao de novas regras de desbloqueio de estrelas ou planetas nesta versao. |
| Escopo | Inclusao de novas integracoes externas para progressao, recomendacao ou analytics avancado. |
| Escopo | Alteracao de contratos existentes de conteudo de estrela, licao ou desafio. |
| Escopo | Reformulacao ampla da experiencia visual alem dos comportamentos funcionais ja implementados. |
| Escopo | Mecanismos de personalizacao de trilha (ordem dinamica por usuario, atalhos inteligentes, etc.). |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
