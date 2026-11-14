---
title: Página de Galáxias
status: draft
source:
  - type: direct-request
    ref: Página de galáxias como mapa, acesso pelo topo da Galáxia, dados exibidos junto de cada galáxia e entrada direta, aprovados em 2026-11-14
  - type: direct-request
    ref: Controle de galáxia no mobile, falha ao entrar em uma galáxia e galáxia atual despublicada, decididos na entrevista de criação do PRD em 2026-11-14
last_updated_at: 2026-11-14
---

# PRD — Página de Galáxias

Disponibiliza para: space; escolha do curso que o aluno estuda, identificação da galáxia atual e entrada em cada galáxia.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Cada curso do Stardust é uma galáxia, conforme RP-13 de [Trilha e Galáxia](galaxy-page-prd.md). A Página de Galáxias é onde o aluno autenticado vê as galáxias publicadas e escolhe em qual delas estudar.

A página é um mapa: cada galáxia aparece como uma ilustração no fundo espacial, acompanhada do nome do curso, de uma descrição curta e do progresso do aluno em planetas. Escolher uma galáxia abre a página Galáxia com a trilha dela. O aluno chega à página por um controle no topo da Galáxia, que mostra a galáxia atual.

A página só existe quando há duas ou mais galáxias publicadas. Com uma única galáxia, o controle não aparece e o aluno usa a Galáxia como hoje.

Esta revisão é prospectiva: descreve o comportamento aprovado e não declara que ele esteja implementado. Os desenhos consideram duas galáxias, Lógica de Programação e Orientação a Objetos; a publicação da segunda galáxia e a arte final das ilustrações ficam fora desta entrega.

## 2. Problema e Oportunidade

O Stardust terá mais de um curso. Sem um lugar para vê-los, o aluno não saberia que outros cursos existem nem como passar de um para outro. A oportunidade é apresentar os cursos na mesma metáfora do produto, sem criar uma segunda forma de navegar: a Galáxia continua sendo a página de estudo, e a Página de Galáxias apenas troca a Galáxia que o aluno vê.

Pesquisa competitiva não é material para esta revisão: as decisões decorrem das escolhas confirmadas com o usuário. Não são feitas afirmações de mercado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | [Trilha e Galáxia](galaxy-page-prd.md), RP-13 | Define a galáxia como curso, o progresso por galáxia, o que pertence à conta e o acesso livre a todas as galáxias. |
| S2 | Decisões de produto aprovadas em 2026-11-14 | Definem o PRD próprio, o acesso pelo topo da Galáxia, o mapa, a ausência de página com uma única galáxia, os dados junto de cada galáxia e a entrada direta. |
| S3 | [Sistema de design](../../design.md) | Tokens e convenções visuais. |
| S4 | Entrevista de criação do PRD em 2026-11-14 | Define a faixa do controle de galáxia no mobile, o toast na falha ao entrar em uma galáxia e o comportamento quando a galáxia atual deixa de estar publicada. |
| S5 | Código de `apps/web` e `packages/core`, consultado em 2026-11-14 | Evidência auxiliar: não existe conceito de galáxia no código; a rota do aluno é `/space`; o progresso da trilha fica na conta do aluno; o cabeçalho mobile já exibe menu, logo, moedas e sequência. |
| S6 | [Registro da revisão de design](../../design-reviews/space/galaxies-page-prd.md) | Boards do Penpot desenhados para este PRD e decisões de desenho. |

## 3. Público-alvo

- **Principal:** alunos autenticados que estudam ou querem começar outro curso do Stardust.
- **Não público desta entrega:** autores e administradores que cadastram galáxias e visitantes sem sessão.
- **Contexto:** o aluno está na Galáxia e quer ver os outros cursos ou voltar a um curso em que já estudou; uso em desktop e mobile.

Jobs to Be Done:

- Quando quero aprender outro assunto, quero ver os cursos disponíveis, para escolher por onde seguir.
- Quando estudo em mais de um curso, quero ver meu progresso em cada um, para decidir qual retomar.
- Quando estou na Galáxia, quero saber em qual curso estou, para não confundir as trilhas.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Tornar os cursos disponíveis encontráveis | Nenhuma meta quantitativa aprovada | Validar que o aluno chega à página a partir da Galáxia e reconhece cada curso. |
| Permitir trocar de curso sem perder progresso | Nenhuma meta quantitativa aprovada | Validar que entrar em outra galáxia preserva o progresso de todas. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Existe uma única galáxia publicada hoje | A página e o controle da Galáxia não devem aparecer até que uma segunda galáxia seja publicada. |
| Catálogo e progresso vêm das áreas responsáveis | A página não cria progresso nem altera o catálogo. |
| As ilustrações das galáxias nos desenhos são provisórias | Não validar a arte; validar posição, legibilidade dos dados e destaque da galáxia atual. |
| Não há metas numéricas | Não inventar metas nem exigir novos eventos de analytics. |
| O mapa foi desenhado com duas galáxias | Validar com duas galáxias. Com três ou mais, vale a regra de RP-02, sem desenho de referência. |
| Uma galáxia publicada pode deixar de estar publicada | Validar que o aluno não fica sem galáxia atual e que o progresso na galáxia retirada é preservado. |
| O foco de teclado não tem board no Penpot | Validar o foco pela extensão aprovada em `documentation/design.md`. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Galáxia | Representa um curso; é identificada pelo nome do curso. |
| Página Galáxia | Página de estudo que mostra a trilha de planetas e estrelas da galáxia atual, definida em Trilha e Galáxia. Neste PRD, “Galáxia” com inicial maiúscula se refere a essa página. |
| Galáxia atual | Última galáxia publicada em que o aluno entrou; para o aluno novo, a primeira galáxia publicada na ordem do catálogo. |
| Progresso da galáxia | Planetas concluídos em relação ao total de planetas da galáxia. |
| Controle de galáxia | Elemento no topo da Galáxia que mostra a galáxia atual e leva à Página de Galáxias. No mobile, é uma faixa logo abaixo do cabeçalho. |

#### RP-01 — Carregamento das galáxias e recuperação

Necessidades do usuário:

- Como aluno, quero ver as galáxias publicadas e meu progresso em cada uma, para escolher onde estudar.

Resultado: galáxias e progresso apresentados, com estados de carregamento e de falha distinguíveis.

Atores: aluno autenticado.

##### Regras de Negócio

- A página deve apresentar todas as galáxias publicadas, na ordem definida pelo catálogo, com o progresso confirmado do aluno em cada uma.
- Galáxias não publicadas não devem ser apresentadas, nem como prévia.
- A página só deve existir quando houver duas ou mais galáxias publicadas. Com uma única galáxia, o acesso direto à página deve levar à Galáxia.
- Falha ao obter as galáxias ou o progresso não pode ser interpretada como ausência de galáxias nem como progresso zerado.
- Uma falha deve permitir tentar novamente a consulta, sem modificar progresso.

##### Regras de Experiência

- Durante o carregamento, a página deve indicar que os dados estão sendo obtidos.
- Falhas devem exibir mensagem compreensível e “Tentar novamente”.
- Erros não devem expor detalhes internos da aplicação ao aluno.

#### RP-02 — Mapa de galáxias

Necessidades do usuário:

- Como aluno, quero reconhecer cada curso e quanto já avancei nele, para decidir sem abrir cada um.

Resultado: mapa em que cada galáxia mostra ilustração, nome, descrição e progresso.

Atores: aluno autenticado.

##### Regras de Negócio

- Cada galáxia deve mostrar sua ilustração, o nome do curso, uma descrição curta e o progresso em planetas concluídos em relação ao total.
- Os dados de cada galáxia devem ser exibidos junto da ilustração e do nome. A página não deve abrir painel, diálogo ou tela de detalhes para uma galáxia.
- A galáxia não deve exibir estado como “não iniciada”, “em andamento” ou “concluída”. O progresso em planetas é a única indicação de avanço.
- Nenhuma galáxia deve aparecer bloqueada: todas as galáxias publicadas estão disponíveis, conforme RP-13 de Trilha e Galáxia.
- XP, moedas, nível, sequência, ranking e conquistas não devem ser apresentados por galáxia, porque pertencem à conta.

##### Regras de Experiência

- A página deve apresentar as galáxias como um mapa sobre o fundo espacial, na linguagem visual dos planetas, e não como grade de cartões ou lista.
- O nome e o progresso devem permanecer legíveis independentemente da ilustração.
- O progresso deve ser apresentado em texto, como “4 de 10 planetas”, e não apenas por cor ou barra.
- Com três ou mais galáxias, o mapa deve continuar para baixo, alternando os lados, com rolagem vertical. Nomes e descrições longos devem quebrar linha dentro da área de dados da galáxia, sem cortar o texto.
- A interface deve usar “galáxia” para se referir a um curso.

#### RP-03 — Galáxia atual e entrada em uma galáxia

Necessidades do usuário:

- Como aluno, quero entrar em uma galáxia com um clique e reconhecer em qual estou, para continuar sem etapas extras.

Resultado: a galáxia atual é destacada, e escolher uma galáxia abre a página Galáxia com a trilha dela.

Atores: aluno autenticado.

##### Regras de Negócio

- A página deve destacar a galáxia atual.
- Escolher uma galáxia deve abrir a página Galáxia com a trilha dela, no ponto de continuidade daquela galáxia, e torná-la a galáxia atual.
- Escolher a galáxia atual deve levar de volta à página Galáxia.
- Entrar em uma galáxia não deve alterar o progresso de nenhuma galáxia nem conceder recompensas.
- Ao abrir a aplicação, o aluno deve ir à página Galáxia, na galáxia atual, e não à Página de Galáxias.
- A galáxia atual deve acompanhar a conta entre sessões e dispositivos.
- Uma falha ao entrar em uma galáxia não deve trocar a galáxia atual nem alterar progresso; o aluno deve permanecer na Página de Galáxias e poder repetir a tentativa.
- Quando a galáxia atual deixar de estar publicada, a galáxia atual do aluno deve passar a ser a primeira galáxia publicada na ordem do catálogo.
- O progresso do aluno em uma galáxia que deixou de estar publicada deve ser preservado e voltar a valer se ela for publicada novamente.

##### Regras de Experiência

- O destaque da galáxia atual deve usar indicação além da cor, como o foguete e o texto “Você está aqui”.
- Cada galáxia, com sua ilustração e seus dados, deve formar um único elemento acionável, operável por teclado e com nome acessível que inclua o nome do curso e o progresso.
- Uma falha ao entrar em uma galáxia deve ser comunicada por um toast de erro que informe o nome da galáxia e a recuperação, como “Não foi possível entrar em Orientação a Objetos. Tente de novo.”. A página não deve abrir diálogo para essa falha.
- A troca da galáxia atual por despublicação não deve exigir ação do aluno nem apresentar erro.

#### RP-04 — Acesso pela Galáxia

Necessidades do usuário:

- Como aluno, quero saber em qual curso estou e ver os outros cursos a partir da Galáxia, para trocar quando quiser.

Resultado: o topo da Galáxia mostra a galáxia atual e leva à Página de Galáxias.

Atores: aluno autenticado.

##### Regras de Negócio

- A Galáxia deve apresentar, no topo, um controle com o nome da galáxia atual que leva à Página de Galáxias.
- O controle só deve aparecer quando houver duas ou mais galáxias publicadas.
- A navegação lateral e a navegação inferior não devem ganhar um item para as galáxias.
- A Página de Galáxias deve oferecer retorno à página Galáxia, na galáxia atual, sem exigir a escolha de uma galáxia.
- A ação de retorno deve mostrar o nome da galáxia atual, como “Voltar para Lógica de Programação”, e não um rótulo genérico.

##### Regras de Experiência

- O controle deve ser reconhecível como acionável, operável por teclado e com nome acessível que informe a galáxia atual e a ação de ver as galáxias.
- O controle não deve cobrir o mapa da Galáxia nem competir com o ponto de continuidade.
- No desktop, o controle deve ficar no cabeçalho da Galáxia.
- No mobile, o controle deve ser uma faixa de largura total logo abaixo do cabeçalho, no topo do mapa, com o nome da galáxia atual e a ação “Ver galáxias”. O cabeçalho mobile não deve ser alterado.
- O controle deve ser lido como uma única ação, e não como dois botões.

#### RP-05 — Qualidade, responsividade e acessibilidade

Necessidades do usuário:

- Como aluno, quero usar a página no meu dispositivo e com recursos de acessibilidade, para escolher um curso sem depender de mouse ou animação.

Resultado: mapa e ações utilizáveis em desktop e mobile.

Atores: aluno autenticado usando mouse, toque, teclado ou tecnologia assistiva.

##### Regras de Negócio

- Desktop e mobile devem apresentar as mesmas galáxias, na mesma ordem e com os mesmos dados.

##### Regras de Experiência

- As galáxias e seus dados devem caber na largura disponível, sem scroll horizontal necessário para leitura ou ações.
- Elementos acionáveis devem ter área de toque adequada e foco visível, conforme a extensão de foco aprovada em [Sistema de design](../../design.md).
- Animações devem ser dispensáveis: com preferência por movimento reduzido, a página deve apresentar o mesmo conteúdo sem movimento.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Catálogo de space | Página de Galáxias | Fornecer as galáxias publicadas, sua ordem, nome, descrição, ilustração e total de planetas. |
| Progressão da trilha | Página de Galáxias | Informar os planetas concluídos pelo aluno em cada galáxia. |
| Conta do aluno | Página de Galáxias e Galáxia | Preservar a galáxia atual entre sessões e dispositivos. |
| Trilha e Galáxia | Página de Galáxias | Apresentar o controle de galáxia e receber o aluno no ponto de continuidade da galáxia escolhida. |
| Design e shell da aplicação | Página de Galáxias | Fornecer tokens, navegação, assets e padrões acessíveis. |
| Notificações da aplicação | Página de Galáxias | Fornecer o toast de erro usado na falha ao entrar em uma galáxia. |

Esta tabela não define ordem de implementação.

## 7. Jornadas

#### JN-01 — Ver as galáxias a partir da Galáxia

Atores: aluno autenticado. Requisitos: RP-01, RP-02 e RP-04.

1. Na Galáxia, o aluno vê o controle com o nome da galáxia atual e o aciona.
2. A página indica carregamento e obtém as galáxias e o progresso.
3. O mapa apresenta cada galáxia com ilustração, nome, descrição e progresso em planetas, e destaca a galáxia atual.
4. O aluno pode voltar à Galáxia sem escolher uma galáxia.

#### JN-02 — Entrar em outra galáxia

Atores: aluno autenticado. Requisito: RP-03.

1. No mapa, o aluno aciona uma galáxia diferente da atual.
2. O sistema torna essa galáxia a atual e abre a página Galáxia com a trilha dela, no ponto de continuidade daquela galáxia.
3. O topo da Galáxia passa a mostrar o nome da nova galáxia.
4. O progresso da galáxia anterior permanece inalterado.

#### JN-03 — Recuperar falha de carregamento

Atores: aluno autenticado. Requisito: RP-01.

1. A obtenção das galáxias ou do progresso falha.
2. A página comunica a falha e oferece “Tentar novamente”, sem apresentar galáxias ou progresso inventados.
3. O aluno aciona nova tentativa; o sucesso retorna a JN-01.

#### JN-04 — Usar a Galáxia com uma única galáxia

Atores: aluno autenticado. Requisitos: RP-01 e RP-04.

1. Existe uma única galáxia publicada.
2. A Galáxia não apresenta o controle de galáxia.
3. O acesso direto à Página de Galáxias leva à Galáxia.

#### JN-05 — Recuperar falha ao entrar em uma galáxia

Atores: aluno autenticado. Requisito: RP-03.

1. No mapa, o aluno aciona uma galáxia diferente da atual.
2. A entrada falha.
3. A página apresenta um toast de erro com o nome da galáxia e a orientação de tentar de novo.
4. O aluno permanece na Página de Galáxias; a galáxia atual e o progresso não mudam.
5. O aluno aciona a galáxia novamente; o sucesso segue JN-02.

#### JN-06 — Abrir a aplicação com a galáxia atual despublicada

Atores: aluno autenticado. Requisitos: RP-01 e RP-03.

1. A galáxia atual do aluno deixa de estar publicada.
2. O aluno abre a aplicação.
3. O sistema torna atual a primeira galáxia publicada na ordem do catálogo e abre a página Galáxia com a trilha dela.
4. O progresso do aluno na galáxia retirada permanece preservado.
5. Se restar uma única galáxia publicada, vale JN-04.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Catálogo e Studio | Cadastro, ordenação e publicação de galáxias; associação de planetas a galáxias. |
| Conteúdo | Planetas, estrelas e narrativa da galáxia Orientação a Objetos ou de qualquer outra galáxia além da primeira. |
| Arte | Ilustração final de cada galáxia. |
| Cadastro | Escolha de curso durante o cadastro. |
| Detalhes da galáxia | Painel, diálogo ou página de detalhes de uma galáxia. |
| Prévia de cursos | Apresentação de galáxias ainda não publicadas. |
| Recompensas | Qualquer recompensa por entrar em uma galáxia ou concluí-la. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Página de galáxias descrita dentro do PRD de Trilha e Galáxia | PRD próprio. |
| Item “Galáxias” na navegação lateral | Controle no topo da Galáxia. |
| Página de galáxias como entrada da aplicação | O aluno entra na página Galáxia, na galáxia atual. |
| Grade de cartões ou lista vertical | Mapa sobre o fundo espacial. |
| Galáxias “Em breve” | Apenas galáxias publicadas são apresentadas. |
| Painel de detalhes ao escolher uma galáxia | Os dados aparecem junto da galáxia, e escolher uma galáxia abre a página Galáxia com a trilha dela. |
| Estados “não iniciada”, “em andamento” e “concluída” | Apenas o progresso em planetas. |
| Ação de retorno com rótulo genérico, como “Voltar à galáxia” | A ação mostra o nome da galáxia atual. |
| Nome fictício para cada galáxia | A galáxia é identificada pelo nome do curso. |
| Controle de galáxia dentro do menu lateral do mobile | Faixa logo abaixo do cabeçalho mobile. |
| Controle de galáxia no lugar do logo no cabeçalho mobile | Faixa logo abaixo do cabeçalho mobile; o cabeçalho não muda. |
| Mensagem de falha dentro da placa da galáxia | Toast de erro. |
| Diálogo de erro ao falhar a entrada em uma galáxia | Toast de erro. |
| Levar o aluno à Página de Galáxias quando a galáxia atual é despublicada | A primeira galáxia publicada passa a ser a atual. |
| Declarar que uma galáxia publicada nunca é despublicada | O PRD define o comportamento nesse caso. |
