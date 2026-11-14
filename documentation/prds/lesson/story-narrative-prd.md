---
title: Narrativa e universo das histórias
status: draft
source:
  - type: direct-request
    ref: Narrativa, elenco, trilha em dez planetas e reviravoltas aprovados em 2026-11-13
  - type: direct-request
    ref: Energia da nave, dicas na voz de Faísca, vídeos de planeta e de encerramento e substituição da trilha aprovados em 2026-11-13
last_updated_at: 2026-11-13
---

# PRD — Narrativa e universo das histórias

Disponibiliza para: lesson, enredo, elenco e arco narrativo das histórias; Trilha e Espaço, identidade, ordem e conceito dos planetas; autoria de conteúdo, base para a escrita das estrelas; universo Stardust, mitologia reutilizável por outros jogos.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

A narrativa das histórias do Stardust é um único mistério que atravessa a trilha inteira. O universo foi escrito em um Código Primordial, e algo está apagando partes dele. O aluno é um recruta que aprende a ler e escrever esse código em Delégua e descobre, planeta a planeta, o que aconteceu.

A trilha passa a ter dez planetas em três atos. Cada planeta possui identidade, mistério e desafio próprios, e seu funcionamento na ficção corresponde ao conceito de programação que ensina. O elenco fixo é pequeno: o aluno, Panda, Faísca, Cifra, a princesa Ária com Sharkorno e Lira.

A ameaça, o Nulo, não é um vilão: é Lira, uma Stardust que ficou sem valor. O aluno a recupera devolvendo seu valor, sem destruí-la. A responsabilidade de Panda pelo que ocorreu com Lira nunca é confirmada.

Cada planeta é apresentado por um vídeo curto, assistido no Espaço quando o aluno abre o planeta, e a trilha termina com um vídeo de encerramento. Esta trilha substitui a anterior: todos os alunos começam em Aurora.

Este PRD define o enredo, o elenco, o arco por planeta, as reviravoltas, a mitologia e o conteúdo dos vídeos. O texto das estrelas, a arte, o planeta Limbo e os personagens reservados a outros jogos ficam fora do escopo. O comportamento da página segue [Histórias interativas](lesson-page-prd.md) e a forma de escrever cada estrela segue as [Story Writing Rules](../../rules/story-writing-rules.md).

## 2. Problema e Oportunidade

A história atual é uma sequência de episódios independentes: calcular o custo de vida, comprar suprimentos, abastecer o foguete, resgatar uma princesa. Cada planeta resolve uma tarefa isolada, sem uma pergunta que acompanhe o aluno do início ao fim, e o conceito ensinado serve à tarefa do momento, não à trama.

Um arco único dá ao aluno um motivo para continuar além da próxima estrela. Quando a evidência do mistério é código, compreender o conceito passa a ser o que revela a história. Uma mitologia consistente também permite que outros jogos compartilhem o mesmo universo e os mesmos personagens.

O documento é prospectivo: descreve a narrativa aprovada, sem afirmar que o conteúdo das estrelas já foi escrito.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-11-13 | Autoridade versionada para enredo, elenco, arco por planeta, reviravoltas e mitologia. |
| S2 | Pedido e decisões de produto aprovados em 2026-11-13 | Define a liberdade em relação à história atual, o elenco, os nomes, a divisão de Listas, o planeta de tuplas, a reserva do Limbo e a ambiguidade sobre Panda. |
| S3 | [Histórias interativas](lesson-page-prd.md), revisão de 2026-11-13 | Define sequência de blocos, questões, vidas, histórico, destaque e conclusão da história. |
| S4 | [Trilha e Espaço](../space/space-page-prd.md) | Define planetas, estrelas, ordem, desbloqueio e navegação. |
| S5 | Catálogo atual de planetas e estrelas, exportado em 2026-10-10 | Evidência auxiliar da história anterior: oito planetas, 39 estrelas e os personagens Panda, a princesa, Sharkorno e os salmonenses. Não substitui as decisões desta revisão. |
| S6 | [Delegua Language Rules](../../rules/delegua-rules.md) | Define o vocabulário e a validação de todo código Delégua citado na narrativa. |
| S7 | [What is Ozaria](https://codecombat.zendesk.com/hc/en-us/articles/1500009116581-What-is-Ozaria), consultado em 2026-11-12 | Registra que outro jogo de ensino de programação possui uma personagem chamada Vega; fundamenta o descarte desse nome. |
| S8 | Decisões de produto aprovadas em 2026-11-13 | Definem a energia da nave, as dicas na voz de Faísca, o som próprio do Nulo, os onze vídeos e a substituição da trilha anterior. |

## 3. Público-alvo

O público principal é o aluno autenticado que percorre a trilha do Stardust em desktop ou mobile, estudando sozinho e em sessões curtas.

O público secundário é quem escreve o conteúdo das estrelas e precisa de uma referência única para enredo, personagens e pistas. Equipes de outros jogos do universo Stardust consultam a mitologia e o elenco reservado.

Jobs to Be Done:

- Quando terminar uma estrela, quero saber o que acontece em seguida, para ter um motivo para voltar.
- Quando aprender um conceito, quero usá-lo para entender algo da história, para sentir que o conhecimento serve para alguma coisa.
- Quando chegar ao final, quero que as pistas anteriores façam sentido, para perceber que a trilha foi uma única história.
- Quando escrever uma estrela, quero consultar o que já foi revelado e o que ainda é segredo, para não antecipar nem contradizer a trama.
- Quando chegar a um planeta, quero ver o lugar antes de começar, para entrar na história com uma pergunta em mente.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Manter um arco único do primeiro ao último planeta | Nenhuma meta numérica aprovada | Verificar que cada planeta avança o mistério central e que nenhuma estrela o contradiz. |
| Ligar a trama ao conceito ensinado | Nenhuma meta numérica aprovada | Verificar que o funcionamento de cada planeta e suas pistas dependem do conceito daquele planeta. |
| Manter o elenco compreensível | Nenhuma meta numérica aprovada | Verificar que apenas o elenco fixo possui arco próprio e que participações se limitam a um planeta. |
| Preservar a ambiguidade sobre Panda | Nenhuma meta numérica aprovada | Verificar que nenhum bloco, questão ou cena confirma quem executou a função que zerou Lira. |
| Sustentar a expansão do universo | Nenhuma meta numérica aprovada | Verificar que os ganchos permanecem abertos ao final e que o elenco reservado não aparece na trilha. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| A narrativa é prospectiva e o conteúdo das estrelas ainda não foi reescrito. | O catálogo atual não comprova os requisitos deste PRD. |
| Nomes de planetas e de participações de um planeta foram propostos e não individualmente revisados. | Tratar como nomes vigentes, sujeitos a troca em revisão futura sem alterar o arco. |
| A distribuição exata dos métodos de lista entre as estrelas do Comboio pertence ao conteúdo. | Validar apenas o recorte por parte definido em RP-04. |
| Todo código Delégua citado é ilustrativo. | Validar no interpretador do projeto antes de incluir em uma estrela, conforme S6. |
| A trilha passa de oito para dez planetas e substitui a anterior. | A criação dos planetas no catálogo e a operação sobre o progresso dos alunos pertencem ao gerenciamento e a [Trilha e Espaço](../space/space-page-prd.md), fora deste PRD. |
| Os vídeos são pulados por parte dos alunos. | Validar que nenhuma estrela depende de informação presente apenas em um vídeo. |
| Não foram aprovadas metas numéricas. | Não inferir metas de engajamento, retenção ou conclusão a partir deste documento. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Primeira Estrela | Origem do universo; continha o Código Primordial inteiro e explodiu, espalhando fragmentos. |
| Código Primordial | Código sobre o qual o universo funciona. Na ficção, está escrito em Delégua. |
| Fragmento | Pedaço de poeira estelar da Primeira Estrela. Cada planeta nasceu de um fragmento. |
| Stardust | Explorador que carrega um fragmento e, por isso, consegue ler e escrever o Código Primordial. |
| Nulo | Aquilo que ficou sem valor. O que ele toca perde o valor e mantém apenas o nome. É Lira. |
| Oco | Cópia sem valor de alguém ou de algo tocado pelo Nulo. É vítima, não inimigo. |
| Limbo | Lugar para onde vão os nomes sem valor. Existe na mitologia e não é visitável nesta versão. |
| Grande Arquivo | Registro, em Chavalor, do nome e do valor de cada coisa do universo. |
| Energia da nave | O que a nave gasta ao executar um comando errado. É a forma como a ficção apresenta as vidas da história. |
| Vídeo de apresentação | Vídeo curto que mostra o planeta ao aluno quando ele o abre no Espaço. |
| Vídeo de encerramento | Vídeo apresentado após a conclusão da trilha, antes dos agradecimentos. |
| Elenco fixo | Personagens com arco próprio ao longo da trilha. |
| Participação | Personagem local de um único planeta, sem arco próprio. |
| Pista | Elemento apresentado antes de uma reviravolta, compreensível em retrospecto. |
| Reviravolta | Revelação que muda o entendimento do aluno sobre fatos já apresentados. |

#### RP-01 — Mitologia do universo

Necessidades do usuário:

- Como aluno, quero entender as regras do universo em que estou, para acompanhar a história sem me perder.

Resultado: a trilha apresenta uma mitologia única e consistente, usada por todos os planetas.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- O universo deve funcionar sobre o Código Primordial, escrito na mesma linguagem que o aluno aprende.
- Cada planeta deve ter nascido de um fragmento da Primeira Estrela e funcionar, na ficção, segundo o conceito que ensina.
- O que o aluno escreve nas questões deve ser, na ficção, o que altera o universo.
- O Nulo deve retirar o valor do que toca, preservando o nome. Nada deve simplesmente desaparecer.
- O Limbo deve ser mencionado como destino do que foi apagado, sem ser visitado.
- A Primeira Estrela deve permanecer apagada ao final da trilha.
- Uma resposta incorreta deve ser, na ficção, um comando errado que a nave executa e que consome sua energia. Sem energia, a nave recua para a órbita do planeta e a história recomeça.
- A ficção deve referir-se a energia da nave, e não a vidas.

##### Regras de Experiência

- A mitologia deve ser apresentada aos poucos, pelas falas e pelas situações, sem um bloco expositivo único.
- Termos da mitologia devem manter o mesmo nome em toda a trilha.

#### RP-02 — Elenco fixo da trilha

Necessidades do usuário:

- Como aluno, quero reconhecer os mesmos personagens ao longo da trilha, para criar vínculo com eles.

Resultado: seis personagens acompanham o aluno com papel e segredo definidos.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- O elenco fixo deve ser composto por:

| Personagem | Papel | Segredo | Presença |
| --- | --- | --- | --- |
| O aluno | Recruta e novo piloto | Seu fragmento reacende Faísca | Toda a trilha |
| Panda | Guia paciente e brincalhão | Foi parceiro de Lira e não possui memória da primeira expedição | Toda a trilha |
| Faísca | Computador de bordo do foguete, impulsiva; é uma faísca da Primeira Estrela | Guarda uma variável cujo valor foi apagado | Toda a trilha |
| Cifra | Stardust rival e apressada, copia código sem entender | Procura a irmã, Lira | A partir de Kalkulon |
| Ária e Sharkorno | Princesa de Chavalor, guardiã do Grande Arquivo, e seu tubarão de estimação | Ela enviou o pedido de ajuda e leu o registro do que ocorreu com Lira | A partir de Arcana |
| Lira | A melhor Stardust da primeira expedição | É o Nulo | Como o Nulo até Chavalor |

- O aluno deve ser um personagem com falas próprias, conforme [Blocos de texto e narração](text-blocks-and-narration-prd.md).
- Faísca deve ser o computador de bordo do foguete do aluno, que é único e igual para todos, conforme [Página de Loja](../shop/shop-page-prd.md). A história e os vídeos devem mostrar sempre esse mesmo foguete.
- Faísca deve executar exatamente o que foi escrito, sem interpretar a intenção.
- As dicas das questões devem ser falas de Faísca.
- Cifra deve tornar-se aliada em Arcana, quando descobre que não consegue copiar uma função sem entendê-la.
- Sharkorno deve parecer uma ameaça antes de se revelar o protetor de Ária.

##### Regras de Experiência

- Panda deve explicar com paciência; Faísca deve agir com pressa. Os erros de Faísca devem originar situações que o aluno conserta.
- As dicas de Faísca devem ser curtas e diretas, coerentes com sua pressa, sem revelar a resposta.
- O tom deve permanecer bem-humorado, preservando a voz informal já usada nas histórias.
- Nenhum outro personagem deve receber arco próprio na trilha.

#### RP-03 — Participações de um planeta

Necessidades do usuário:

- Como aluno, quero que cada planeta tenha seus próprios moradores, para sentir que visitei lugares diferentes.

Resultado: cada participação dá identidade a um planeta e não reaparece com arco próprio.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- As participações devem ser:

| Participação | Planeta | Papel |
| --- | --- | --- |
| Aspas | Trívia | Poeta da lua dos Textuais, fala entre aspas. |
| Caso | Ifthenia | Guarda do Oráculo. |
| Tique | Cíclade | Relojoeira que viveu séculos no laço. |
| Zero | O Comboio | Capitão salmonense da primeira nave da fila. |

- Os salmonenses devem ser o povo do Comboio: refugiados que fogem do Nulo.
- Uma participação não deve possuir segredo que dependa de outro planeta para ser resolvido.

##### Regras de Experiência

- O aluno deve conhecer a participação, resolver a situação local e seguir viagem.
- A participação pode ser citada depois, sem exigir que o aluno se lembre dela para compreender a trama.

#### RP-04 — Trilha em dez planetas e três atos

Necessidades do usuário:

- Como aluno, quero avançar por planetas em uma ordem que faça sentido, para aprender um conceito de cada vez enquanto a história progride.

Resultado: a trilha possui dez planetas contíguos, agrupados em três atos.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- A trilha deve seguir esta ordem:

| Posição | Ato | Planeta | Conceito | Estrelas de história |
| --- | --- | --- | --- | --- |
| 1 | I | Aurora | Introdução | Lógica de programação; variáveis; escreva e leia |
| 2 | I | Trívia | Tipos de dados | Tipo texto; tipo número; tipo lógico |
| 3 | I | Kalkulon | Operadores | Aritméticos; relacionais; lógicos |
| 4 | II | Ifthenia | Condicionais | Se; senão; senão se; escolha caso |
| 5 | II | Cíclade | Laços | Para; enquanto; fazer enquanto |
| 6 | II | O Comboio, parte 1 | Listas: acessar e modificar | Índice; adicionar e remover |
| 7 | II | O Comboio, parte 2 | Listas: transformar e percorrer | Ordenar e fatiar; métodos de texto; laços com listas |
| 8 | III | Arcana | Funções | Criando funções; retorna; funções nativas; funções avançadas |
| 9 | III | Perene | Tuplas | Criar tuplas; imutabilidade; funções de lista em tuplas e escolha entre tupla e lista |
| 10 | III | Chavalor | Dicionários | Acessar e alterar valores; chaves e valores; desestruturação |

- A ordem dos conceitos deve ser preservada, porque cada um depende dos anteriores.
- Cada planeta deve terminar em uma estrela de desafio.
- O planeta de Listas deve ser dividido em duas partes, cada uma com seu desafio. A parte 1 exige um desafio novo.
- O planeta Perene deve vir depois de Arcana, porque tuplas usam funções.
- Esta trilha deve substituir a trilha anterior. Todos os alunos começam em Aurora, conforme [Trilha e Espaço](../space/space-page-prd.md).
- A ordem das estrelas dentro de cada planeta e a quantidade de estrelas por recorte devem seguir a progressão pedagógica do conteúdo.

##### Regras de Experiência

- O aluno não deve percorrer mais de cinco estrelas de história seguidas sem chegar a um desafio de fim de planeta.
- A passagem entre atos deve ser marcada por uma reviravolta, conforme RP-06.

#### RP-05 — Identidade, mistério e desafio de cada planeta

Necessidades do usuário:

- Como aluno, quero que cada planeta tenha um lugar, um enigma e um desafio próprios, para lembrar do que aprendi em cada um.

Resultado: cada planeta combina um cenário regido pelo seu conceito, um mistério e um desafio final.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- Cada planeta deve seguir esta definição:

| Planeta | Identidade | Mistério | Desafio final |
| --- | --- | --- | --- |
| Aurora | Academia dos Stardusts em um estaleiro orbital. | A memória de Faísca possui uma variável sem valor. | Decolar. |
| Trívia | Três luas em guerra fria: Textuais, Numéricos e Lógicos, cada povo entende um único tipo. | Cada lua guarda um pedaço de um mapa que nenhum povo lê sozinho. | Reunir os três pedaços. |
| Kalkulon | Planeta-balança de comerciantes, onde portas só abrem para expressões verdadeiras. | Os asteroides possuem ruas e janelas. | Atravessar a chuva de asteroides. |
| Ifthenia | Labirinto de estradas que se bifurcam; os habitantes falam em condições. | A profecia do Oráculo não possui o caso padrão. | Distinguir habitantes reais dos Ocos. |
| Cíclade | O mesmo dia se repete há séculos. | Uma condição mantém o laço ativo. | Fugir do que estava preso ali. |
| O Comboio, parte 1 | Fila de naves refugiadas, numeradas a partir do zero. | Naves somem da fila. | Reorganizar a fila e alcançar a nave zero. |
| O Comboio, parte 2 | O interior da nave zero e seu diário de bordo. | O diário e um pedido de ajuda estão truncados. | Resgatar os tripulantes antes que a lista esvazie. |
| Arcana | Ruínas da primeira expedição, com máquinas que funcionam quando chamadas pelo nome certo. | Alguém escreveu as funções antigas. | Abrir a Fortaleza e resgatar Ária. |
| Perene | O cofre do universo: o que é guardado ali não pode ser alterado. | Um registro intacto que ninguém consegue ler por inteiro. | Guardar o que precisa sobreviver. |
| Chavalor | O Grande Arquivo, onde cada coisa possui um nome e um valor. | Uma chave sem valor. | Devolver o valor a uma chave. |

- O mistério de um planeta deve ser resolvido ou transformado em pista até o desafio final desse planeta.
- O desafio final deve exigir o conceito do planeta.

##### Regras de Experiência

- O cenário deve tornar o conceito visível: caminhos que se bifurcam para condicionais, um dia que se repete para laços, uma fila numerada para listas.
- O nome do planeta e o de seu conceito devem aparecer juntos na navegação da trilha.

#### RP-06 — Reviravoltas e pistas

Necessidades do usuário:

- Como aluno, quero ser surpreendido por revelações que façam sentido, para reler o que já vi com outros olhos.

Resultado: seis reviravoltas, em ordem, cada uma sustentada por pistas anteriores.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- As reviravoltas devem ocorrer nesta ordem:

| Ordem | Planeta | Revelação |
| --- | --- | --- |
| 1 | Kalkulon | Os asteroides são restos de mundos apagados. |
| 2 | Cíclade | O laço era uma prisão; ao quebrá-lo para sair, o aluno libertou o Nulo. |
| 3 | O Comboio | A nave zero pertence à primeira expedição, e Cifra procurava a irmã, Lira. |
| 4 | Arcana | As funções antigas possuem a assinatura de Panda. |
| 5 | Perene | O registro do que ocorreu com Lira está intacto, mas a palavra que diz quem executou a função não possui tradução. |
| 6 | Chavalor | Os salmonenses pediam abrigo, e a suposta invasão era um erro de tradução; o Nulo é Lira. |

- Toda reviravolta deve possuir ao menos uma pista apresentada em planeta anterior.
- Uma estrela não deve antecipar uma reviravolta de planeta posterior.
- A variável sem valor de Faísca, apresentada em Aurora, deve ser a pista da reviravolta final.

##### Regras de Experiência

- A reviravolta deve ser revelada dentro da história, não na tela de resultado.
- Após a revelação, as pistas anteriores devem permanecer consultáveis no histórico das estrelas já concluídas.

#### RP-07 — O Nulo e a recuperação de Lira

Necessidades do usuário:

- Como aluno, quero resolver a ameaça usando o que aprendi, para sentir que programar foi o que salvou a história.

Resultado: o aluno recupera Lira devolvendo seu valor, sem derrotá-la.

Atores: aluno autenticado.

##### Regras de Negócio

- O Nulo deve ser Lira, que perdeu o valor ao tentar reescrever o Código Primordial para reacender a Primeira Estrela.
- O Nulo não deve ser destruído, preso ou vencido em combate.
- O desfecho deve ser uma atribuição escrita pelo aluno que devolve um valor à chave de Lira no Grande Arquivo.
- Após o desfecho, a variável de Faísca apresentada em Aurora deve deixar de ser `nulo`.
- A intenção de Lira ao tentar reacender a Primeira Estrela não deve ser classificada como ambição ou sacrifício.

##### Regras de Experiência

- O Nulo deve ser apresentado como uma figura triste, não assustadora.
- A presença do Nulo deve ser marcada pelo mesmo efeito sonoro em toda a trilha, de modo que o aluno a reconheça pelo som.
- Os Ocos devem ser tratados como vítimas a compreender, não como inimigos a eliminar.

#### RP-08 — A dúvida sobre Panda

Necessidades do usuário:

- Como aluno, quero formar minha própria opinião sobre o que Panda fez, para continuar pensando na história depois de terminá-la.

Resultado: a trilha termina sem confirmar quem zerou Lira.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- A história deve confirmar apenas três fatos: Lira perdeu o valor; Panda estava presente; a função que zera um nome possui a assinatura de Panda.
- A história não deve confirmar quem chamou a função, quem apagou a memória de Panda ou o que Lira pretendia.
- As pistas devem sustentar ao menos três leituras: Panda a impediu; Lira zerou a si mesma; foi um acidente de Faísca, que executa sem perguntar.
- Ária deve conhecer a resposta, por ter lido o registro, e não deve conseguir comunicá-la: a palavra que usa não possui tradução.
- Lira, ao ser recuperada, não deve dizer o que aconteceu.

##### Regras de Experiência

- Panda deve narrar o passado de formas ligeiramente diferentes ao longo dos planetas, sem perceber.
- Nenhuma questão deve ter como resposta correta a identidade de quem executou a função.

#### RP-09 — O código da trama

Necessidades do usuário:

- Como aluno, quero que as pistas fiquem legíveis conforme aprendo, para perceber meu próprio progresso.

Resultado: a evidência central do mistério é código Delégua, revelado por partes conforme o aluno domina cada conceito.

Atores: aluno autenticado; autor de conteúdo.

##### Regras de Negócio

- O código da trama deve aparecer nesta progressão:

| Planeta | O que o aluno vê | O que já consegue ler |
| --- | --- | --- |
| Aurora | Uma variável sem valor na memória de Faísca. | Existe uma variável vazia. |
| Cíclade | A condição que mantém o laço enquanto algo permanece vazio. | O laço dura enquanto um valor for `nulo`. |
| Arcana | A definição da função que zera um nome, assinada por Panda. | A função existe e quem a escreveu. |
| Perene | O registro da chamada, guardado em uma tupla. | O que foi feito e com quem; não quem fez. |
| Chavalor | A chave de Lira no Grande Arquivo, sem valor. | O que precisa ser devolvido. |

- O código deve seguir [Delegua Language Rules](../../rules/delegua-rules.md) e ser validado no interpretador do projeto antes de entrar em uma estrela.
- O registro em Perene não deve estar corrompido nem alterado: tuplas são imutáveis, e essa é a razão de ele ter sobrevivido.
- A função e o desfecho devem seguir esta forma ilustrativa:

```delegua
funcao anular(nome) {
  arquivo[nome] = nulo
}

anular("Lira")
```

```delegua
arquivo["Lira"] = "Stardust"
```

##### Regras de Experiência

- Um trecho do código da trama não deve ser apresentado antes de o aluno ter aprendido o conceito necessário para lê-lo no nível indicado.
- O código da trama deve ser apresentado como bloco de código da história, conforme [Bloco de Código](code-block-prd.md).

#### RP-10 — Ganchos para o universo expandido

Necessidades do usuário:

- Como aluno, quero terminar a trilha sabendo que o universo continua, para ter interesse nos próximos jogos.

Resultado: a trilha fecha seu arco e deixa ganchos abertos para outros jogos.

Atores: aluno autenticado; equipes de outros jogos do universo Stardust.

##### Regras de Negócio

- Devem permanecer abertos ao final: a Primeira Estrela apagada; o Limbo cheio do que foi apagado; a profecia de Ifthenia sem o caso padrão; a primeira expedição de Panda e Lira.
- Personagens reservados a outros jogos não devem aparecer na trilha, conforme a seção 8.
- Outros jogos devem usar lugares e termos já apresentados na trilha, mantendo os nomes definidos neste PRD.

##### Regras de Experiência

- Os ganchos devem ser percebidos como perguntas em aberto, não como história incompleta.
- A trilha não deve terminar em uma cena que exija outro jogo para ser compreendida.

#### RP-11 — Vídeos de apresentação dos planetas e de encerramento

Necessidades do usuário:

- Como aluno, quero ver cada planeta antes de começar suas estrelas e assistir ao desfecho ao terminar, para sentir que a trilha é uma viagem por lugares diferentes.

Resultado: onze vídeos curtos, um por planeta e um de encerramento, apresentam os lugares e fecham o arco sem antecipar revelações.

Atores: aluno autenticado; autor de conteúdo; produção de vídeo.

##### Regras de Negócio

- Cada planeta deve possuir um vídeo de apresentação com o seguinte conteúdo:

| Planeta | O que o vídeo mostra | Pergunta que deixa |
| --- | --- | --- |
| Aurora | O estaleiro orbital da academia, o foguete parado e Faísca acordando quando o recruta chega. | Por que Faísca acordou agora? |
| Trívia | As três luas e seus povos, cada um falando de um jeito que os outros não entendem. | O que cada lua guarda? |
| Kalkulon | O planeta-balança, o mercado e as portas que só abrem para quem acerta a conta; ao fundo, a chuva de asteroides. | O que há do outro lado dos asteroides? |
| Ifthenia | As estradas que se bifurcam sem parar e o Oráculo ao longe. | Qual caminho leva ao Oráculo? |
| Cíclade | A mesma manhã começando duas vezes, com os mesmos gestos dos habitantes. | Por que o dia não termina? |
| O Comboio, parte 1 | A fila de naves refugiadas, numeradas a partir do zero, atravessando o escuro. | Do que elas fogem? |
| O Comboio, parte 2 | A nave zero vista de perto e a escotilha se abrindo para um interior silencioso. | O que ficou guardado lá dentro? |
| Arcana | As ruínas e as máquinas adormecidas, que reagem quando alguém diz o nome certo. | Quem construiu tudo isso? |
| Perene | O cofre do universo, onde nada se move nem muda. | O que precisou ser guardado para sempre? |
| Chavalor | O Grande Arquivo, com suas fileiras de nomes e valores, e um espaço vazio entre eles. | De quem é o nome sem valor? |

- O vídeo de apresentação deve mostrar o lugar, a regra que o rege e uma pergunta. Não deve resolver o mistério do planeta nem apresentar sua reviravolta.
- O vídeo pode mencionar apenas o que já foi revelado nos planetas anteriores, porque só é assistido depois de concluí-los.
- O vídeo de encerramento deve mostrar o que acontece depois do final, conforme JN-04: Lira recuperada e em silêncio, Panda sem memória da primeira expedição, a Primeira Estrela apagada e o Limbo cheio.
- O vídeo de encerramento não deve confirmar quem executou a função que zerou Lira, conforme RP-08, nem apresentar personagens reservados a outros jogos.
- Nenhuma estrela deve depender de informação presente apenas em um vídeo: tudo o que o aluno precisa saber deve estar também na história.
- Os dois vídeos do Comboio devem ser distintos: o primeiro apresenta a fila; o segundo, o interior da nave zero.
- Reviravoltas e conclusões de planeta não possuem vídeo próprio nesta versão.

##### Regras de Experiência

- Os vídeos devem ser animações curtas em motion graphics, com áudio, compreensíveis apenas pela imagem: a compreensão não deve depender do som nem de texto explicativo. Um texto só deve aparecer quando for necessário, como parte da própria animação.
- Os vídeos devem seguir a reprodução definida em [Trilha e Espaço](../space/space-page-prd.md).
- O tom deve ser o mesmo das histórias: bem-humorado, sem assustar.
- Faísca, Panda e o aluno podem aparecer em qualquer vídeo. Cifra, Ária, Sharkorno e as participações só devem aparecer a partir do planeta em que entram na trama.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Narrativa e universo | Conteúdo das estrelas | Fornecer enredo, elenco, pistas, reviravoltas e o que permanece em segredo em cada planeta. |
| Narrativa e universo | Trilha e Espaço | Fornecer nome, ordem e conceito dos dez planetas e o conteúdo dos vídeos de apresentação e de encerramento. |
| Trilha e Espaço | Narrativa e universo | Fornecer a abertura do planeta, o diálogo em que o vídeo é reproduzido e o encerramento da trilha. |
| Histórias interativas | Narrativa e universo | Fornecer a sequência de blocos, questões, destaque e histórico em que a narrativa é apresentada. |
| Story Writing Rules | Conteúdo das estrelas | Definir ritmo, tipos de questão e estrutura de cada estrela. |
| Delegua Language Rules | Narrativa e universo | Definir o vocabulário e a validação do código da trama. |
| Blocos de texto e narração | Narrativa e universo | Fornecer personagens, tipos e avatares dos blocos de fala. |
| Blocos visuais | Narrativa e universo | Fornecer as animações em destaque que mostram cenários e consequências. |
| Narrativa e universo | Outros jogos do universo Stardust | Fornecer mitologia, lugares, termos e o elenco reservado. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Ato I: o chamado

1. O aluno é recrutado por Panda em Aurora e declara seu nome; Faísca acorda.
2. O aluno percebe uma variável sem valor na memória de Faísca.
3. Em Trívia, aprende a falar com cada povo usando o tipo de dado que ele entende e reúne o mapa.
4. Em Kalkulon, conhece Cifra, que passa à frente com respostas copiadas.
5. Ao atravessar a chuva de asteroides, descobre que eles são restos de mundos apagados.

#### JN-02 — Ato II: a perseguição

1. Em Ifthenia, o aluno percorre caminhos que se bifurcam, ouve a profecia sem o caso padrão e encontra os Ocos.
2. Em Cíclade, descobre a condição que mantém o dia em repetição e quebra o laço para sair.
3. Ao sair, descobre que o laço era uma prisão e que libertou o Nulo.
4. No Comboio, reorganiza a fila de naves refugiadas enquanto naves somem e alcança a nave zero.
5. Na nave zero, decifra o diário de bordo e o pedido de ajuda de Ária, e descobre que Cifra procura a irmã, Lira.

#### JN-03 — Ato III: a verdade

1. Em Arcana, o aluno aciona máquinas antigas chamando funções e encontra a assinatura de Panda.
2. Cifra não consegue copiar uma função sem entendê-la e alia-se ao aluno.
3. O aluno abre a Fortaleza e resgata Ária; Sharkorno revela-se seu protetor.
4. Em Perene, encontra o registro intacto do que ocorreu com Lira; a palavra que diz quem executou a função não possui tradução.
5. Em Chavalor, traduz Ária, descobre que os salmonenses pediam abrigo e que o Nulo é Lira.
6. O aluno escreve a atribuição que devolve o valor de Lira; a variável de Faísca deixa de ser `nulo`.

#### JN-04 — Depois do final

1. Lira é recuperada e não diz o que aconteceu.
2. Panda permanece sem memória da primeira expedição.
3. A Primeira Estrela continua apagada e o Limbo continua cheio.
4. O aluno retorna ao Espaço com a trilha concluída e os ganchos em aberto.
5. No encerramento, o vídeo de encerramento mostra essas cenas antes dos agradecimentos.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Texto das estrelas | Falas, enunciados, alternativas, dicas e código de cada estrela. |
| Arte e áudio | Avatares, animações, imagens de planetas, narração, efeitos sonoros e a produção dos vídeos. |
| Limbo | Planeta visitável e o ensino de tratamento de erros; permanece como expansão futura. |
| Elenco de outros jogos | Os heróis Soma e Retorno, e os Apagadores: Rasura, Barão Falso, Eterno, Estouro e Exceção. |
| Outros jogos | Mecânicas, enredo e personagens de qualquer jogo além da trilha. |
| Gerenciamento da trilha | Criação, reordenação e publicação de planetas e estrelas no catálogo. |
| Comportamento da página | Vidas, progresso, retomada, destaque, histórico, ambiente e efeitos sonoros, definidos em Histórias interativas. |
| Reprodução dos vídeos | Abertura do planeta, diálogo, som e falhas de carregamento, definidos em Trilha e Espaço. |
| Desafios | Funcionamento e avaliação das estrelas de desafio. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Seguir estritamente a base da história atual | Manter a ordem dos conceitos e Panda; reescrever o enredo como um arco único. |
| Tarefas avulsas por planeta (custo de vida, mercadão, posto de combustível) | Cada planeta avança o mistério central. |
| O Nulo como vilão a derrotar | O Nulo é Lira, recuperada por uma atribuição. |
| Faísca acompanhar o aluno em qualquer foguete adquirido na loja | Foguete único e fixo; os foguetes saíram da loja. |
| Confirmar que Panda zerou Lira | A responsabilidade de Panda permanece em aberto. |
| Registro com a linha de autoria corrompida | Registro intacto em uma tupla, com uma palavra sem tradução. |
| Princesa presa por um vilão | Sharkorno a protegia do Nulo. |
| Salmonenses como invasores | São refugiados; a invasão era um erro de tradução. |
| Computador de bordo chamado Núcleo, Eco, Pulsar, Cerne ou Órbi | Faísca. |
| Rival chamada Vega | Cifra, porque outro jogo de ensino de programação já possui uma personagem chamada Vega. |
| Princesa chamada Clave, Léxia, Glosa, Runa, Sonata, Valora ou Rima | Ária. |
| Listas em um único planeta de nove estrelas | Dois planetas, cada um com seu desafio. |
| Reduzir Listas a seis estrelas mais densas | Dois planetas, cada um com seu desafio. |
| Tuplas como estrelas dentro de Listas | Planeta próprio, Perene, depois de Arcana. |
| Incluir o Limbo agora, com tratamento de erros | Limbo reservado como expansão futura. |
| Apresentar na trilha todos os personagens do jogo de luta | Elenco fixo, participações de um planeta e elenco reservado. |
| Os Apagadores como antagonistas da trilha | Reservados a outros jogos, para não dividir a culpa com um vilão externo. |
| Vídeo de abertura e de gancho em cada estrela | Um vídeo por planeta e um de encerramento; a estrela abre e fecha com gancho em texto. |
| Vídeos para as reviravoltas e para a conclusão de cada planeta | Fora desta versão; as reviravoltas são reveladas dentro da história. |
| Manter a trilha anterior ou converter seu progresso | A nova trilha substitui a anterior e todos começam em Aurora. |
