---
title: Roadmap de Desafios
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/43
last_updated_at: 2026-09-15
---

# PRD — Roadmap de Desafios

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

- **Contexto:** o usuário entra no módulo Challenging para praticar fora da
  trilha principal de planetas e estrelas.
- **Dor:** o catálogo completo exige que o usuário escolha sozinho entre muitos
  desafios e categorias.
- **Necessidade:** enxergar uma progressão recomendada, seu avanço e uma ação
  seguinte clara sem perder liberdade de navegação.

## 2. Problema e Oportunidade

A listagem tradicional oferece autonomia e filtros sobre todo o catálogo, mas
não comunica uma ordem pedagógica clara. Usuários iniciantes ou sem um plano de
estudo precisam decidir sozinhos qual categoria e qual desafio resolver em
seguida. Isso aumenta a carga de decisão e enfraquece a percepção de avanço.

A listagem tradicional oferece autonomia e filtros sobre todo o catálogo, mas
não comunica uma ordem pedagógica clara. Usuários iniciantes ou sem um plano de
estudo precisam decidir sozinhos qual categoria e qual desafio resolver em
seguida. Isso aumenta a carga de decisão e enfraquece a percepção de avanço.

Inferência baseada nas fontes: o Stardust pode diferenciar-se ao integrar a
orientação visual diretamente ao estado global de conclusão dos desafios e à
identidade de constelação já usada pelo produto, sem transformar a trilha em um
bloqueio obrigatório. A coexistência entre roadmap curado e catálogo completo
preserva orientação para iniciantes e autonomia para usuários experientes.

---

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/43 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

### Público principal

Estudantes autenticados do Stardust que desejam praticar programação com uma
sequência recomendada, especialmente aqueles que ainda não sabem qual desafio ou
categoria estudar em seguida.

### Públicos secundários

- Estudantes experientes que desejam visualizar lacunas e progresso por tema.
- Visitantes não autenticados que desejam conhecer a trilha e abrir desafios
  públicos, sem progresso pessoal ou recomendação baseada em conclusão.

### Não público

- Pessoas buscando uma preparação exclusiva para entrevistas técnicas.
- Autores que desejam montar roadmaps pessoais ou personalizados.
- Equipes que necessitam de currículos privados ou múltiplas trilhas.
- Administradores que esperam editar o grafo visualmente pelo Studio na V1.

### Contexto, dores e necessidades

- **Contexto:** o usuário entra no módulo Challenging para praticar fora da
  trilha principal de planetas e estrelas.
- **Dor:** o catálogo completo exige que o usuário escolha sozinho entre muitos
  desafios e categorias.
- **Necessidade:** enxergar uma progressão recomendada, seu avanço e uma ação
  seguinte clara sem perder liberdade de navegação.

### Jobs to Be Done

- Quando eu quiser praticar desafios sem saber por onde começar, quero visualizar
  uma sequência recomendada, para iniciar pelo fundamento adequado.
- Quando eu concluir um desafio, quero saber qual é o próximo desafio elegível,
  para continuar estudando sem reorganizar meu plano.
- Quando eu retornar ao roadmap, quero reencontrar o mesmo contexto com progresso
  atualizado, para retomar rapidamente.
- Quando eu quiser explorar além da trilha curada, quero acessar todos os
  desafios públicos, para escolher livremente o que praticar.

---

## 4. Objetivos e Métricas de Sucesso

- Aumentar a proporção de visitas ao módulo Challenging que iniciam um desafio.
- Aumentar a continuidade entre a conclusão de um desafio e o início do próximo
  desafio recomendado.
- Aumentar o retorno de usuários autenticados ao roadmap.
- Medir visitas, abertura de nós, uso de “continuar”, início e conclusão de
  desafios e retornos ao roadmap por meio da infraestrutura existente do
  PostHog.
- Registrar uma linha de base antes de definir metas numéricas posteriores.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

- Aumentar a proporção de visitas ao módulo Challenging que iniciam um desafio.
- Aumentar a continuidade entre a conclusão de um desafio e o início do próximo
  desafio recomendado.
- Aumentar o retorno de usuários autenticados ao roadmap.
- Medir visitas, abertura de nós, uso de “continuar”, início e conclusão de
  desafios e retornos ao roadmap por meio da infraestrutura existente do
  PostHog.
- Registrar uma linha de base antes de definir metas numéricas posteriores.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Entrada principal e navegação entre visualizações

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Entrada principal e navegação entre visualizações.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O roadmap deve ser a entrada principal do módulo Challenging e
deve oferecer acesso explícito ao catálogo completo de desafios.

##### Regras de Negócio
- **Entrada:** o item de navegação “Desafios” deve direcionar para
  `/challenging/roadmap`.
- **Rotas:** `/challenging/roadmap` deve exibir o roadmap e
  `/challenging/challenges` deve continuar exibindo todos os desafios públicos.
- **Catálogo completo:** a lista tradicional deve incluir desafios pertencentes
  ou não ao roadmap, respeitando suas regras de visibilidade existentes.
- **Preferência:** o sistema não deve persistir a última visualização acessada;
  o roadmap permanece como entrada padrão.

##### Regras de Experiência

- **Interface:** o seletor deve apresentar `Roadmap | Todos os desafios`, nessa
  ordem, com a visualização atual destacada.
- **Consistência:** o seletor deve estar disponível nos estados relevantes do
  roadmap e do catálogo, sem botão adicional redundante para o mesmo destino.
- **Design:** os frames `GJpSw` e `b081p` constituem a referência visual.
- **Responsividade:** o seletor deve permanecer legível e operável em telas
  pequenas.
- **Acessibilidade:** cada opção deve comunicar nome, estado selecionado e
  destino a tecnologias assistivas.

---

#### RP-02 — Carregamento do roadmap publicado

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Carregamento do roadmap publicado.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O sistema deve carregar uma única revisão oficial e publicada do
roadmap, contendo todos os dados necessários para renderizar o grafo.

##### Regras de Negócio
- **Revisão ativa:** somente uma revisão pode estar publicada e ativa por vez na
  V1.
- **Snapshot completo:** a revisão deve conter nós, conexões, posições, ordens de
  recomendação e associações com desafios.
- **Imutabilidade:** uma revisão publicada não pode ser alterada; uma mudança
  deve criar uma nova revisão completa.
- **Publicação atômica:** a troca da revisão ativa deve ocorrer atomicamente.
- **Exposição:** o endpoint público nunca deve retornar rascunhos ou revisões
  incompletas.
- **Dependência:** a composição inicial deve ser criada por migration/seed
  versionado com identificadores estáveis.

##### Regras de Experiência

- **Carregamento:** a página deve exibir skeleton coerente com o mapa enquanto a
  revisão é buscada.
- **Estado vazio:** quando não existir revisão publicada ou ela não possuir nós,
  deve ser exibido um estado vazio explicativo.
- **Erro:** falhas de carregamento devem preservar a página e oferecer ação de
  tentar novamente.

---

#### RP-03 — Estrutura e integridade do grafo

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Estrutura e integridade do grafo.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Cada nó deve representar uma categoria existente e as conexões
devem expressar pré-requisitos recomendados.

##### Regras de Negócio
- **Categoria:** cada nó deve referenciar exatamente uma categoria existente.
- **Unicidade:** uma categoria não pode aparecer em mais de um nó da mesma
  revisão.
- **Pré-requisitos:** um nó pode ter zero, um ou vários pré-requisitos.
- **Aciclicidade:** o grafo publicado não pode conter ciclos.
- **Posição:** cada nó deve armazenar posições manuais genéricas `x` e `y`.
- **Independência:** o domínio não deve persistir objetos serializados específicos
  do React Flow.
- **Ordem:** a recomendação deve usar `recommendationOrder`; posições visuais
  não determinam a ordem pedagógica.
- **Validação:** a publicação deve falhar diante de IDs ausentes, categorias
  duplicadas, conexões inválidas ou ciclos.

##### Regras de Experiência

- **Interface:** os nós devem seguir a linguagem visual de constelação do
  Stardust, com conexões visíveis e estados diferenciados além da cor.
- **Posicionamento:** a V1 deve respeitar as posições editoriais persistidas e
  não executar auto-layout.
- **Interação:** o mapa deve suportar pan, zoom, ajuste à tela, teclado, toque e
  gesto de pinça.
- **Controles:** ícones devem usar a biblioteca nativa adotada pelo design, não
  SVGs avulsos.
- **Acessibilidade:** deve existir uma representação linear equivalente para
  navegação e leitura por tecnologias assistivas.

---

#### RP-04 — Curadoria explícita de desafios por nó

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Curadoria explícita de desafios por nó.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Cada nó deve conter uma seleção editorial explícita de desafios,
independente da associação geral entre desafios e categorias.

##### Regras de Negócio
- **Relacionamento:** a associação deve ser representada por
  `RoadmapNodeChallenge`, contendo `roadmapNodeId`, `challengeId` e `order`.
- **Curadoria:** desafios não devem ser incluídos automaticamente por categoria,
  dificuldade ou data.
- **Categoria consistente:** todo desafio associado deve pertencer à categoria
  representada pelo nó.
- **Unicidade:** o mesmo desafio não pode aparecer em mais de um nó dentro da
  mesma revisão.
- **Elegibilidade:** somente desafios públicos e não vinculados como desafio de
  estrela podem participar da revisão publicada.
- **Ordem:** `order` deve ser única e determinística dentro de cada nó.
- **Catálogo:** desafios da categoria não selecionados continuam disponíveis no
  catálogo completo.
- **Validação:** o seed deve falhar quando uma referência esperada estiver
  ausente ou inválida.

##### Regras de Experiência

- **Contagem:** os totais exibidos no design devem ser calculados com as
  associações reais; valores como `4/7` e `30/79` são exemplos visuais.
- **Previsibilidade:** a ordem apresentada no drawer deve ser a ordem editorial,
  não dificuldade ou data de publicação.

---

#### RP-05 — Progresso por nó e progresso geral

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Progresso por nó e progresso geral.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Usuários autenticados devem visualizar o progresso calculado a
partir das conclusões globais dos desafios associados à revisão publicada.

##### Regras de Negócio
- **Progresso do nó:** deve ser `desafios associados concluídos / desafios
  associados válidos`.
- **Conclusão do nó:** um nó é concluído quando todos os seus desafios associados
  válidos estão concluídos.
- **Progresso geral:** deve ser `desafios únicos concluídos / desafios únicos
  associados e válidos`.
- **Nós vazios:** nós “Em breve” não entram no denominador.
- **Conclusão global:** o estado de conclusão pertence ao desafio; não deve ser
  duplicado no relacionamento do roadmap.
- **Nova revisão:** o sistema deve recalcular progresso e recomendação usando as
  conclusões globais existentes, sem preservar snapshots históricos de
  percentual.
- **Visitantes:** usuários não autenticados devem visualizar totais públicos,
  mas não progresso pessoal.

##### Regras de Experiência

- **Interface:** cada nó deve apresentar barra, valor concluído/total e estado
  textual ou iconográfico.
- **Resumo:** a página deve apresentar progresso geral e uma ação para continuar
  quando aplicável.
- **Revalidação:** o progresso deve ser atualizado ao retornar da resolução de um
  desafio e ao recuperar o foco da página.
- **Acessibilidade:** percentuais e estados não podem ser comunicados somente por
  cor.

---

#### RP-06 — Elegibilidade e recomendação do próximo desafio

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Elegibilidade e recomendação do próximo desafio.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O sistema deve recomendar uma continuação determinística, sem
bloquear o acesso a outros nós ou desafios.

##### Regras de Negócio
- **Nó elegível:** um nó é elegível para recomendação quando estiver incompleto,
  possuir desafios e todos os seus pré-requisitos estiverem concluídos.
- **Escolha do nó:** entre nós elegíveis, deve vencer o menor
  `recommendationOrder`.
- **Escolha do desafio:** dentro do nó escolhido, deve vencer o primeiro desafio
  incompleto por `RoadmapNodeChallenge.order`.
- **Raiz:** quando nenhum progresso existir, deve ser recomendado o primeiro nó
  raiz elegível.
- **Sem bloqueio:** pré-requisitos são recomendações; o usuário pode abrir
  qualquer nó ou desafio público.
- **Conclusão total:** quando todos os desafios válidos estiverem concluídos, a
  recomendação deve ser substituída por uma mensagem de conclusão.
- **Visitantes:** a recomendação pessoal não deve ser calculada para usuários não
  autenticados.

##### Regras de Experiência

- **Destaque:** o caminho e o nó recomendado devem ter destaque visual que não
  dependa exclusivamente de cor.
- **Ação:** “Continuar próximo desafio” deve abrir diretamente o desafio
  recomendado.
- **Ausência:** quando não houver recomendação, a interface deve explicar se o
  roadmap foi concluído ou se ainda não possui conteúdo elegível.

---

#### RP-07 — Seleção de nó e drawer de desafios

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Seleção de nó e drawer de desafios.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Selecionar um nó deve abrir um drawer adaptado do componente
existente de navegação de desafios, restrito à curadoria daquele nó.

##### Regras de Negócio
- **Escopo:** o drawer deve consultar exclusivamente os IDs associados ao nó
  selecionado.
- **Conteúdo:** busca e filtros devem operar somente sobre esse conjunto.
- **Filtros:** a V1 deve oferecer busca, dificuldade e estado de conclusão.
- **Categoria:** o filtro de categoria não deve ser exibido, pois o nó já define
  o contexto.
- **Paginação:** o drawer não deve paginar na V1; deve carregar o conjunto curado
  completo preservando a ordem editorial.
- **Reuso:** a implementação deve adaptar o drawer existente sem alterar o
  comportamento da sidebar global usada na página de desafio.

##### Regras de Experiência

- **Interface:** o drawer deve seguir o frame `b081p`, exibindo título da
  categoria, progresso, filtros e desafios.
- **Abertura:** a seleção do nó deve permanecer visível na URL para permitir deep
  link e restauração.
- **Fechamento:** deve ser possível fechar pelo botão explícito, por `Esc` e pelo
  scrim quando aplicável.
- **Erro isolado:** uma falha no conteúdo do drawer não deve desmontar o mapa; o
  drawer deve exibir retry próprio.
- **Responsividade:** em telas pequenas, o drawer deve ocupar a largura
  disponível.
- **Acessibilidade:** foco deve entrar no drawer ao abrir, permanecer contido
  quando modal e retornar ao nó de origem ao fechar.

---

#### RP-08 — Nós sem desafios

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Nós sem desafios.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** A revisão pode comunicar categorias futuras por meio de nós sem
desafios, desde que não interrompam a progressão.

##### Regras de Negócio
- **Publicação:** um nó vazio somente pode ser publicado se for terminal e não
  possuir dependentes.
- **Recomendação:** um nó vazio nunca pode ser recomendado.
- **Progresso:** um nó vazio não pode bloquear, concluir artificialmente nem
  alterar o progresso geral.
- **Validação:** a publicação deve rejeitar um nó vazio que seja pré-requisito de
  outro nó.

##### Regras de Experiência

- **Estado vazio:** o nó deve exibir “Em breve”.
- **Drawer:** ao selecionar o nó, deve ser exibida uma mensagem de conteúdo em
  preparação, sem filtros vazios ou ação de continuar.

---

#### RP-09 — Abertura, resolução e retorno

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Abertura, resolução e retorno.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O roadmap deve integrar-se à experiência existente de resolução e
permitir o retorno ao mesmo contexto.

##### Regras de Negócio
- **Destino:** selecionar um desafio deve abrir sua rota existente de resolução.
- **Origem:** a navegação deve preservar uma origem de retorno ao roadmap e o nó
  selecionado.
- **Retorno:** após concluir ou sair, o usuário deve retornar ao mesmo nó quando
  usar “Voltar ao roadmap”.
- **Atualização:** no retorno, o sistema deve revalidar progresso antes de
  calcular a próxima recomendação.
- **Viewport:** pan e zoom devem ser preservados localmente; não fazem parte do
  domínio ou da revisão publicada.

##### Regras de Experiência

- **Contexto:** o retorno deve restaurar seleção e viewport sem impedir que o
  usuário use a navegação normal do navegador.
- **Feedback:** após a atualização, o desafio concluído, o progresso e a próxima
  ação devem refletir o estado atual.

---

#### RP-10 — Integridade de desafios publicados

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Integridade de desafios publicados.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Desafios usados pela revisão ativa devem permanecer compatíveis
com o contrato público do roadmap.

##### Regras de Negócio
- **Bloqueio:** exclusão, privatização ou associação como desafio de estrela deve
  ser bloqueada enquanto o desafio estiver presente na revisão ativa.
- **Correção:** a mensagem deve orientar a remoção do desafio em uma nova revisão
  do roadmap antes da alteração.
- **Revisão histórica:** revisões inativas continuam imutáveis, mas não impedem a
  evolução normal do desafio quando não forem a revisão ativa.
- **Inconsistência legada:** uma associação inválida encontrada em runtime deve
  ser excluída da resposta pública e registrada em observabilidade.

##### Regras de Experiência

- **Ação bloqueada:** interfaces administrativas existentes devem explicar a
  dependência com o roadmap ativo.
- **Degradação:** se a inconsistência afetar o nó aberto, o drawer deve mostrar
  um erro recuperável; os demais nós válidos devem continuar disponíveis.

---

#### RP-11 — Contrato de dados e desempenho

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Contrato de dados e desempenho.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O roadmap deve possuir um contrato de leitura dedicado e
eficiente, sem expor dados privados.

##### Regras de Negócio
- **Endpoint:** uma única requisição deve retornar o grafo publicado e, quando
  autenticado, os agregados de progresso necessários.
- **Drawer:** a listagem adaptada deve aceitar a restrição explícita pelos IDs
  associados ao nó.
- **Segurança:** desafios privados, de estrela ou fora das associações solicitadas
  não podem vazar no endpoint do roadmap.
- **Determinismo:** a mesma revisão e o mesmo conjunto de conclusões devem produzir
  a mesma ordem e recomendação.
- **Sessão:** falha ou ausência de sessão deve degradar para os dados públicos,
  sem expor progresso de outro usuário.

##### Regras de Experiência

- **Carregamento:** React Flow deve ser carregado sob demanda para reduzir o custo
  inicial do módulo.
- **Estabilidade:** atualizações de drawer, seleção ou progresso não devem
  reinicializar desnecessariamente o viewport.
- **Compatibilidade:** a experiência deve funcionar nos navegadores suportados
  pelo projeto.

---

#### RP-12 — Estados inválidos, observabilidade e analytics

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Estados inválidos, observabilidade e analytics.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O produto deve tratar entradas inválidas de forma segura e medir
seu uso por meio da infraestrutura existente.

##### Regras de Negócio
- **Seleção inválida:** um ID de nó inválido na URL deve ser removido ou ignorado
  sem quebrar o mapa.
- **Nó inválido:** dados de nó que não possam ser resolvidos devem ser omitidos e
  registrados; nenhuma informação privada pode ser usada como fallback.
- **Eventos:** devem ser registrados, no mínimo, visita ao roadmap, abertura de
  nó, início de desafio, uso de continuar, conclusão e retorno ao roadmap.
- **Dados:** eventos devem incluir somente identificadores e contexto necessários,
  seguindo as regras existentes de analytics.
- **Alertas:** falhas de integridade, revisão ausente e respostas parciais devem
  ser observáveis.

##### Regras de Experiência

- **Erro do mapa:** deve existir estado de erro completo com retry quando o grafo
  não puder ser usado.
- **Erro do drawer:** deve permanecer isolado no drawer.
- **Movimento reduzido:** animações, brilhos e transições devem respeitar
  `prefers-reduced-motion`.
- **Contraste e foco:** conexões, controles e nós devem manter contraste e foco
  visível segundo as regras do design system.

---

#### RP-13 — Responsividade e representação acessível

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Responsividade e representação acessível.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O roadmap deve permanecer utilizável por mouse, teclado, toque e
tecnologias assistivas em diferentes tamanhos de tela.

##### Regras de Negócio
- **Equivalência:** a representação linear deve oferecer as mesmas ações
  essenciais do grafo: identificar estado, abrir categoria e iniciar desafio.
- **Ordem:** a representação linear deve seguir a ordem pedagógica, não as
  coordenadas visuais.

##### Regras de Experiência

- **Desktop:** deve exibir o mapa completo, resumo de progresso e drawer lateral.
- **Mobile:** deve manter o mapa navegável por pan/pinch e abrir o drawer em
  largura total.
- **Teclado:** nós e controles devem ser alcançáveis, ativáveis e possuir rótulos
  localizados.
- **Leitor de tela:** nós devem anunciar categoria, estado, progresso e relação
  recomendada de pré-requisito.
- **Sinais redundantes:** estados de recomendado, concluído, disponível e “Em
  breve” devem combinar texto, ícone ou forma, não apenas cor.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Entrar no módulo e continuar pelo roadmap

1. O usuário seleciona “Desafios” na navegação principal.
2. O sistema abre `/challenging/roadmap` e carrega a revisão publicada.
3. O sistema apresenta o grafo:
   - **Autenticado:** calcula progresso e próxima recomendação.
   - **Visitante:** apresenta conteúdo e totais públicos sem progresso pessoal.
4. O usuário seleciona “Continuar próximo desafio”.
5. O sistema abre o primeiro desafio incompleto do próximo nó elegível.
6. Se todos os desafios estiverem concluídos, o sistema apresenta o estado de
   conclusão em vez da ação de continuar.

#### JN-02 — Explorar uma categoria

1. O usuário seleciona um nó no grafo ou na representação linear.
2. O sistema registra o nó na URL e abre o drawer.
3. O drawer carrega somente os desafios explicitamente associados ao nó.
4. O usuário pode buscar ou filtrar por dificuldade e conclusão.
5. O usuário seleciona um desafio.
6. O sistema abre a experiência existente de resolução preservando a origem de
   retorno.

#### JN-03 — Concluir um desafio e retornar

1. O usuário resolve ou abandona o desafio aberto a partir do roadmap.
2. O usuário aciona “Voltar ao roadmap”.
3. O sistema retorna ao nó selecionado e restaura o viewport local.
4. O sistema revalida as conclusões.
5. O nó, o progresso geral e a próxima recomendação são atualizados.

#### JN-04 — Acessar o catálogo completo

1. O usuário seleciona “Todos os desafios” no seletor.
2. O sistema navega para `/challenging/challenges`.
3. A página apresenta todos os desafios públicos segundo as regras e filtros da
   listagem existente, inclusive desafios fora do roadmap.
4. Ao selecionar “Roadmap”, o sistema retorna para `/challenging/roadmap`.

#### JN-05 — Abrir um nó “Em breve”

1. O usuário seleciona um nó terminal sem desafios.
2. O sistema abre o drawer com o estado “Em breve”.
3. O drawer não apresenta filtros nem ação de continuar.
4. O usuário fecha o drawer e continua explorando o mapa.

#### JN-06 — Tratar erro ou dado inválido

1. O sistema detecta uma falha de carregamento ou referência inválida.
2. O sistema registra o evento de observabilidade sem expor dados privados.
3. O sistema preserva o maior escopo válido possível:
   - **Falha total do grafo:** apresenta erro da página com retry.
   - **Falha apenas do drawer:** mantém o mapa e apresenta retry no drawer.
   - **Nó inválido na URL:** remove ou ignora a seleção e mantém o mapa.
   - **Associação legada inválida:** omite a associação e sinaliza o nó afetado.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Editor visual ou gerenciamento do roadmap pelo Studio. |
| Escopo | Mais de um roadmap oficial na V1. |
| Escopo | Roadmaps pessoais, gerados por usuários ou por inteligência artificial. |
| Escopo | Personalização automática da sequência por desempenho, objetivo ou perfil. |
| Escopo | Bloqueio de nós ou desafios por pré-requisitos. |
| Escopo | Inclusão automática de todos os desafios de uma categoria. |
| Escopo | Calendário, streak, corações, metas diárias ou gamificação equivalente à |
| Escopo | Favoritos no drawer do roadmap. |
| Escopo | Edição, conexão ou arraste persistente de nós pela Web App. |
| Escopo | Auto-layout do grafo. |
| Escopo | Editor visual ou gerenciamento do roadmap pelo Studio. |
| Escopo | Mais de um roadmap oficial na V1. |
| Escopo | Roadmaps pessoais, gerados por usuários ou por inteligência artificial. |
| Escopo | Personalização automática da sequência por desempenho, objetivo ou perfil. |
| Escopo | Bloqueio de nós ou desafios por pré-requisitos. |
| Escopo | Inclusão automática de todos os desafios de uma categoria. |
| Escopo | Calendário, streak, corações, metas diárias ou gamificação equivalente à |
| Escopo | Favoritos no drawer do roadmap. |
| Escopo | Edição, conexão ou arraste persistente de nós pela Web App. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
