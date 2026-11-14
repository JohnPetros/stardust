---
title: Histórias interativas
status: draft
source:
  - type: direct-request
    ref: Reformulação das histórias aprovada em 2026-10-11
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/23
  - type: direct-request
    ref: Medição do percurso da história, sem metas numéricas, aprovada em 2026-11-13
  - type: direct-request
    ref: Energia da nave, resposta como ação do aluno, ambiente por planeta e efeitos sonoros aprovados em 2026-11-13
  - type: direct-request
    ref: Troca de clima do som ambiente durante a história e diálogo de controles de áudio aprovados em 2026-11-13
  - type: direct-request
    ref: Volume individual e silenciamento de som ambiente e de efeitos, persistidos entre histórias, aprovados em 2026-11-13
  - type: direct-request
    ref: Som ambiente composto por cenário sonoro na base e música discreta nos climas, aprovado em 2026-11-13
last_updated_at: 2026-11-14
---

# PRD — Histórias interativas

Disponibiliza para: lesson, experiência de consumo de uma história vinculada a uma estrela; Trilha e Galáxia, continuidade e conclusão da estrela; resultado, encaminhamento da conclusão; analytics, eventos do percurso da história.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Histórias interativas são sequências de blocos que combinam narrativa, apresentação de conceitos e questões durante o aprendizado de programação no Stardust. O aluno autenticado acessa uma estrela de história, acompanha as explicações e pratica dentro da mesma sequência, sem um estágio separado de quiz.

A página deve oferecer progressão guiada, histórico consultável, elementos visuais em destaque e retomada da tentativa vinculada à conta. Questões exigem acerto para avançar; uma nova tentativa começa com dez vidas, apresentadas ao aluno como a energia da nave.

A página também aproxima a mecânica da ficção: o ambiente acompanha o planeta da estrela, o som ambiente muda de clima em viradas da história, a resposta aprovada aparece no histórico como ação do aluno e efeitos sonoros marcam respostas e acontecimentos. Um botão no cabeçalho abre os controles de áudio da história.

Este PRD define a experiência comum da história. A interação e a avaliação específicas de cada tipo de questão, suas versões de leitura, o enredo e o elenco das histórias, a autoria do conteúdo e a apresentação das recompensas pertencem a documentos próprios.

## 2. Problema e Oportunidade

A experiência anterior separa a história do quiz e mantém uma composição visual pouco variável. Sair da lição reinicia seu estado, dificultando a continuidade de uma sessão incompleta.

A reformulação aproxima explicações e atividades, permite praticar após conhecer um conceito e mantém os blocos anteriores disponíveis para consulta. O destaque visual acompanha o contexto da narrativa, enquanto a retomada permite continuar em outra sessão ou dispositivo.

A revisão é prospectiva: descreve o comportamento aprovado para a reformulação, sem afirmar que ele já existe na implementação. Pesquisa competitiva não é necessária para as decisões de funcionamento aprovadas neste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-11 | Autoridade versionada para a experiência comum das histórias interativas. Substitui a revisão de Página de Lição de 2026-07-06. |
| S2 | Pedido e decisões de produto aprovados em 2026-10-11 | Define blocos, destaque, questões integradas, dez vidas, reinício integral e retomada vinculada à conta. |
| S3 | [Trilha e Galáxia](../space/galaxy-page-prd.md) | Define planetas, estrelas, sequência, acesso e navegação pela Galáxia. |
| S4 | [Milestone 23](https://github.com/JohnPetros/stardust/milestone/23) | Contexto legado de história estruturada e consumo de narração persistida. |
| S5 | Fluxos existentes de Lesson, StoryStage e QuizStage na Web App | Evidência auxiliar do comportamento anterior e do diálogo de vidas esgotadas; não substitui as decisões desta revisão. |
| S6 | [Narrativa e universo das histórias](story-narrative-prd.md), revisão de 2026-11-13 | Define enredo, elenco, planetas e reviravoltas apresentados pela sequência de blocos. |
| S7 | [Story Writing Rules](../../rules/story-writing-rules.md) | Define ritmo, ordem das questões e estrutura do conteúdo de cada história. |
| S8 | Decisão de produto aprovada em 2026-11-13 | Define os eventos que medem o percurso da história, sem metas numéricas. |
| S9 | Decisões de produto aprovadas em 2026-11-13 | Definem a energia da nave como apresentação das vidas, a resposta aprovada como ação do aluno, o ambiente por planeta e os efeitos sonoros de sistema e de história. |
| S10 | Efeitos sonoros e preferência de som existentes na Web App | Evidência auxiliar dos sons já reproduzidos em acerto, erro, vidas esgotadas e erro de execução; não substitui as decisões desta revisão. |
| S11 | Decisões de produto aprovadas em 2026-11-13 | Definem a troca de clima do som ambiente por um conjunto compartilhado, apenas sonora, e o botão que abre o diálogo de controles de áudio. Revisam a decisão anterior de manter os controles fora da história. |
| S12 | Pedido de produto de 2026-11-13 | Define controles separados para som ambiente e efeitos sonoros, cada um com volume próprio e opção de ativar ou silenciar, persistidos e aplicados automaticamente entre as histórias. |
| S13 | Decisão de produto aprovada em 2026-11-13 | Define que o som de base de cada planeta é um cenário sonoro e que os climas são música discreta, ambos na categoria de som ambiente. |

## 3. Público-alvo

O público principal é o aluno autenticado que aprende programação pela trilha do Stardust. O contexto de uso inclui desktop, mobile, sessões interrompidas e alternância entre dispositivos.

Como público secundário, o aluno que retorna a uma história concluída pode consultar seu conteúdo conforme as regras de revisão da trilha. Autores de conteúdo e administradores não são o público deste fluxo; suas ferramentas ficam fora do escopo.

Jobs to Be Done:

- Quando estiver aprendendo um conceito, quero acompanhar explicações e praticar na mesma sequência, para verificar meu entendimento antes de continuar.
- Quando precisar consultar uma explicação anterior, quero encontrar os blocos já percorridos, para relacioná-los à atividade atual.
- Quando interromper uma história, quero retomar meu progresso e minhas vidas, para continuar em outra sessão ou dispositivo.
- Quando estiver em uma história, quero sentir que estou no planeta e que minhas respostas são ações minhas, para me envolver com a trama enquanto pratico.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Integrar aprendizado e prática | Nenhuma meta numérica aprovada | Verificar se explicações, exemplos e questões pertencem à mesma sequência. |
| Manter o histórico consultável | Nenhuma meta numérica aprovada | Verificar a consulta dos blocos anteriores e das respostas aprovadas após o avanço. |
| Permitir continuidade entre sessões e dispositivos | Nenhuma meta numérica aprovada | Verificar a retomada do ponto de continuidade, respostas aprovadas e vidas restantes. |
| Tornar o avanço compreensível | Nenhuma meta numérica aprovada | Verificar que a questão bloqueia o avanço até o acerto e que o feedback precede Continuar. |
| Medir o percurso da história | Nenhuma meta numérica aprovada | Verificar o registro dos eventos definidos em RP-10, para identificar onde o aluno erra, esgota as vidas ou interrompe a história. |
| Aproximar a mecânica da ficção | Nenhuma meta numérica aprovada | Verificar a energia da nave no cabeçalho e no diálogo, o ambiente do planeta, a resposta aprovada como ação do aluno e os efeitos sonoros previstos em RP-12. |
| Dar controle sobre o áudio dentro da história | Nenhuma meta numérica aprovada | Verificar que som ambiente e efeitos possuem volume e silenciamento separados no diálogo de RP-13, com efeito imediato, sem alterar a tentativa e mantidos ao abrir outra história. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| A revisão define comportamento futuro, diferente do fluxo anterior História → Quiz → Resultado. | A implementação atual não comprova os novos requisitos. |
| O destaque mobile deve preservar espaço para leitura. | Validar a altura limitada e a consulta do histórico em telas estreitas. |
| A tentativa acompanha a conta. | Validar a continuidade entre sessões e dispositivos, não apenas o estado local da página. |
| Cada atividade terá um PRD próprio. | Este documento valida o contrato comum de progressão, sem especificar algoritmos de avaliação. |
| Não foram aprovadas metas numéricas. | Não inferir metas de aprendizagem, conversão ou retenção a partir deste documento. |
| A medição precede a definição de metas. | Validar o registro dos eventos; metas por métrica dependem dos primeiros dados e de nova aprovação. |
| "Vida" é o termo da regra; "energia da nave" é o que o aluno vê. | Validar que a interface apresenta energia e que as regras de consumo, esgotamento e reinício são as das vidas. Os demais PRDs de lesson continuam usando "vida". |
| O som nunca é o único sinal de um estado. | Validar que acerto, erro, esgotamento e acontecimentos da história são compreensíveis com o som desligado. |
| A preferência de som existente é guardada por dispositivo. | Esta revisão reutiliza essa preferência para ativar e silenciar os efeitos, guarda o volume dos efeitos junto a ela e não define sua mudança para a conta. O silenciamento e o volume do som ambiente, novos, acompanham a conta. |
| O som ambiente vem silenciado por padrão e a troca de clima é apenas sonora. | A troca de clima alcança somente quem ativou o som ambiente; a história deve ser compreensível sem ela. |
| Ativar e silenciar no diálogo são as mesmas preferências das configurações. | Validar que uma mudança feita na história aparece nas configurações e vice-versa, sem criar uma preferência exclusiva da história. |
| O volume é ajustado apenas no diálogo da história. | Validar a persistência do volume entre histórias e sessões; oferecer o volume também nas configurações não faz parte desta revisão. |
| Com volume ajustável, o som ambiente e os efeitos podem ficar mais altos que a narração. | Validar a relação com a narração apenas no volume padrão; acima dele, a escolha é do aluno. |
| Ambiente e efeitos dependem de arquivos que podem falhar. | Validar que a ausência ou a falha de fundo, som ambiente ou efeito não impede leitura, resposta, avanço ou conclusão. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Planeta | Tema da trilha, conforme Trilha e Galáxia. |
| Estrela | Unidade ordenada da trilha; pode conter uma história ou um desafio de código. |
| História | Sequência de blocos de narrativa, apresentação de conceitos e questões. |
| Bloco da história | Item da sequência: texto, Lottie, exemplo de código, exemplo de programação em blocos ou questão. Imagens estáticas aparecem apenas em cenas de atividades. |
| Bloco de texto | Possui personagem, tipo e avatar próprios. O avatar pode variar entre blocos do mesmo personagem. |
| Histórico | Conjunto consultável dos blocos percorridos, incluindo falas e respostas aprovadas após o avanço. |
| Destaque | Apresentação temporária de um elemento visual, até um ponto definido da progressão. Não constitui uma sequência separada. |
| Questão | Atividade inserida na história que exige resposta aprovada para liberar o avanço. |
| Exemplo de leitura | Apresentação somente leitura; sua execução, quando disponível, é opcional. |
| Tentativa | Progresso de uma história e suas vidas, preservados na conta até conclusão ou reinício integral. |
| Vida | Unidade consumida por uma resposta incorreta. É o termo usado nas regras deste e dos demais PRDs de lesson. |
| Energia da nave | Nome e representação das vidas na interface. Cada vida corresponde a uma unidade de energia; não existe uma segunda contagem. |
| Ambiente do planeta | Fundo, cabeçalho e som ambiente opcional que identificam o planeta da estrela. Não altera as cores dos blocos de texto. |
| Som ambiente | Categoria de áudio que reúne o som de base do planeta e os climas, sob um mesmo volume e um mesmo silenciamento. |
| Som de base | Cenário sonoro próprio do planeta, sem música, com o qual toda história desse planeta começa. |
| Clima | Música discreta de um conjunto pequeno e compartilhado entre todas as histórias, que substitui o som de base em um trecho da história. |
| Troca de clima | Marcação de um bloco, definida pelo conteúdo, que muda o som ambiente a partir daquele ponto. |
| Controles de áudio | Diálogo aberto pelo cabeçalho da história, com volume e silenciamento separados para som ambiente e para efeitos sonoros, além da reprodução automática da narração. |
| Silenciado | Estado em que uma categoria de áudio não é reproduzida, preservando o volume escolhido para quando for reativada. |
| Efeito sonoro de sistema | Som curto associado a um resultado da página, igual em todas as histórias. |
| Efeito sonoro da história | Som curto e opcional associado a um bloco pelo conteúdo, para marcar um acontecimento da trama. |

#### RP-01 — Acesso à história

Necessidades do usuário:

- Como aluno, quero acessar a história da estrela escolhida, para estudar seu conteúdo.

Resultado: a história vinculada à estrela é apresentada ao aluno autorizado.

Atores: aluno autenticado.

##### Regras de Negócio

- A história deve pertencer a uma estrela e respeitar as regras de acesso, desbloqueio e revisão de Trilha e Galáxia.
- O acesso deve identificar a estrela e carregar a sequência da história.
- Uma tentativa incompleta deve ser apresentada conforme RP-08.

##### Regras de Experiência

- O cabeçalho deve identificar o progresso e a energia da nave restante, conforme RP-05, além de permitir sair.
- O cabeçalho deve oferecer o botão que abre os controles de áudio, conforme RP-13.
- O conteúdo deve identificar a história e sua estrela.
- A entrada deve usar uma transição que comece com opacidade zero e revele o conteúdo.

#### RP-02 — Sequência de blocos

Necessidades do usuário:

- Como aluno, quero acompanhar os blocos em ordem, para aprender e praticar em uma sequência guiada.

Resultado: o aluno percorre uma única sequência de narrativa, exemplos e questões.

Atores: aluno autenticado.

##### Regras de Negócio

- A história pode conter texto, Lottie, exemplos de código Delégua e de programação em blocos, além de questões de múltipla escolha, programação em blocos e escrita de código. Todo visual em destaque deve ser um Lottie, conforme Blocos visuais.
- Continuar deve permitir percorrer os blocos na ordem da história, respeitando o bloqueio de questões descrito em RP-04.
- Exemplos devem ser somente leitura. Quando executáveis, sua execução deve ser opcional para avançar.
- Não deve existir uma passagem para um estágio separado de quiz.

##### Regras de Experiência

- Cada bloco de texto deve usar seu personagem, tipo e avatar, permitindo imagens diferentes para o mesmo personagem.
- As cores dos blocos de texto devem ser fixas por personagem ou tipo, independentemente do tema atual.
- Não deve haver um rótulo redundante com o nome Panda nos blocos de fala desse personagem.
- Continuar deve permanecer no rodapé e ser operável por teclado.
- Os blocos percorridos devem permanecer consultáveis no histórico.

#### RP-03 — Narração disponível

Necessidades do usuário:

- Como aluno, quero ouvir a narração disponível, para acompanhar a explicação também por áudio.

Resultado: blocos elegíveis oferecem narração quando seu arquivo está disponível.

Atores: aluno autenticado.

##### Regras de Negócio

- A história deve consumir áudio previamente gerado e persistido.
- O player deve ser disponibilizado somente quando o áudio estiver concluído e a existência do arquivo estiver confirmada.
- Não deve haver geração de voz em tempo real como fallback.
- A ausência de áudio ou a falha na confirmação do arquivo não deve impedir a leitura do bloco.

##### Regras de Experiência

- Blocos sem áudio disponível devem ser apresentados normalmente, sem player indisponível.
- A narração não deve substituir o conteúdo textual.

#### RP-04 — Questões integradas à história

Necessidades do usuário:

- Como aluno, quero responder questões durante a história e receber feedback, para verificar meu entendimento antes de avançar.

Resultado: a resposta aprovada libera Continuar; a resposta incorreta permite nova tentativa enquanto houver vidas.

Atores: aluno autenticado.

##### Regras de Negócio

- Cada questão deve ocupar um ponto da sequência da história.
- O aluno deve acertar a questão antes de avançar.
- Uma resposta incorreta deve permitir nova tentativa, respeitando RP-05.
- Após a aprovação, o próximo bloco não deve aparecer automaticamente: o aluno deve acionar Continuar.
- A interação, a avaliação e o feedback específicos de cada tipo devem ser definidos em PRDs próprios.

##### Regras de Experiência

- A questão deve apresentar o enunciado como bloco de texto acima da atividade.
- Durante a questão, o histórico não deve ser exibido simultaneamente à atividade.
- O feedback deve permanecer disponível antes de Continuar.
- Após o avanço, a questão e sua resposta aprovada devem permanecer disponíveis para consulta no histórico.
- No histórico, a resposta aprovada deve ser apresentada como ação do personagem do aluno, com a identidade visual desse personagem, e não como um registro neutro de questão.
- Essa apresentação deve usar a própria resposta aprovada: a alternativa escolhida, o programa montado ou o código escrito. Ela não deve exigir uma fala adicional do conteúdo nem oferecer escolha de falas ao aluno.
- Acerto e erro devem ser compreensíveis por texto ou indicação visual além da cor.

#### RP-05 — Vidas e reinício integral

Necessidades do usuário:

- Como aluno, quero entender minhas vidas e como recomeçar, para continuar aprendendo após erros.

Resultado: a tentativa inicia com dez vidas e pode ser reiniciada integralmente quando elas acabam.

Atores: aluno autenticado.

##### Regras de Negócio

- Uma nova tentativa deve começar com dez vidas.
- Cada resposta enviada e considerada incorreta deve custar uma vida.
- Executar exemplos ou experimentar código não deve custar vidas.
- Ao zerar as vidas, o aluno não deve continuar a tentativa atual.
- Recomeçar história deve limpar toda a tentativa anterior e restaurar dez vidas, reiniciando a história inteira, não apenas a questão.
- Sair deve retornar à Galáxia. Essa ação não deve restaurar vidas nem reiniciar a tentativa.
- As vidas devem ser apresentadas ao aluno como a energia da nave. A mudança é de nome e de representação; quantidade, consumo, esgotamento e reinício permanecem os definidos acima.

##### Regras de Experiência

- O cabeçalho deve apresentar as vidas restantes como energia da nave, com nome e ícone próprios, em lugar do nome e do ícone de vidas.
- O diálogo existente de vidas esgotadas deve oferecer Recomeçar história e Sair.
- O texto do diálogo deve situar o esgotamento na ficção: a nave ficou sem energia e recua para a órbita do planeta.
- Os botões devem manter os rótulos literais Recomeçar história e Sair, sem substituição por termos da ficção.
- O diálogo deve deixar claro que recomeçar reinicia toda a história.
- A interface não deve apresentar ao aluno, na mesma tela, os termos vidas e energia como se fossem contagens diferentes.

#### RP-06 — Progresso único da história

Necessidades do usuário:

- Como aluno, quero acompanhar meu progresso na história, para saber quanto falta concluir.

Resultado: uma única barra representa os blocos concluídos da sequência completa.

Atores: aluno autenticado.

##### Regras de Negócio

- O progresso deve considerar os blocos concluídos em relação ao total de blocos da história, incluindo textos, exemplos e questões.
- Uma questão não deve contar como concluída antes da aprovação de sua resposta.
- O progresso deve chegar a 100% somente ao concluir a história.
- Executar um exemplo não deve ser requisito de conclusão do bloco.

##### Regras de Experiência

- A barra deve permanecer no cabeçalho e representar a mesma sequência durante leitura e questões.
- Não deve haver uma barra separada para quiz.

#### RP-07 — Conclusão e encaminhamento ao resultado

Necessidades do usuário:

- Como aluno, quero concluir a história e visualizar seu resultado, para reconhecer o avanço na trilha.

Resultado: concluir todos os blocos encaminha o aluno à experiência de resultado da estrela.

Atores: aluno autenticado.

##### Regras de Negócio

- A história deve ser concluída somente após percorrer a sequência e aprovar suas questões.
- A conclusão deve identificar a estrela e ser fornecida às áreas responsáveis por progresso e resultado.
- Cálculo de XP e moedas, apresentação de recompensas e streak devem pertencer ao PRD de resultado.
- Tempo e quantidade de erros não devem compor o cálculo da recompensa neste fluxo.

##### Regras de Experiência

- Ao terminar a sequência, o aluno deve ser encaminhado à experiência de resultado.
- Não deve existir uma confirmação intermediária para entrar em um quiz.

#### RP-08 — Saída e retomada vinculada à conta

Necessidades do usuário:

- Como aluno, quero interromper e retomar uma história, para continuar em outra sessão ou dispositivo.

Resultado: a tentativa incompleta é retomada com seu ponto de continuidade e suas vidas preservados.

Atores: aluno autenticado.

##### Regras de Negócio

- Sair ou recarregar uma história incompleta deve preservar o ponto de continuidade, os blocos percorridos, as respostas aprovadas e as vidas restantes.
- A tentativa deve acompanhar a conta entre dispositivos, não ficar restrita ao dispositivo usado anteriormente.
- Sair deve retornar à Galáxia sem reiniciar a tentativa.
- O reinício integral deve ocorrer pela ação Recomeçar história descrita em RP-05.

##### Regras de Experiência

- Ao retornar, o aluno deve continuar do ponto preservado, com o histórico correspondente disponível.
- A retomada não deve exigir repetir questões já aprovadas na mesma tentativa.

#### RP-09 — Histórico, destaque e composição responsiva

Necessidades do usuário:

- Como aluno, quero consultar as falas anteriores enquanto observo o elemento em destaque, para relacionar a narrativa ao exemplo apresentado.

Resultado: o destaque permanece visível durante seu trecho da história, enquanto todas as falas pertencem ao histórico rolável.

Atores: aluno autenticado.

##### Regras de Negócio

- Um elemento visual pode permanecer em destaque até um ponto definido da progressão.
- Ao atingir esse ponto, o elemento deve sair do destaque e passar a integrar o histórico como bloco normal.
- Nenhuma fala deve ficar sticky; todas devem fazer parte do histórico rolável.
- A apresentação de questões deve seguir RP-04, sem histórico simultâneo.

##### Regras de Experiência

- No desktop, o elemento em destaque deve ficar sticky ao lado do histórico; a composição pode alternar os lados durante a história.
- No mobile, o elemento em destaque deve ficar sticky no topo, abaixo do cabeçalho, com altura limitada para preservar espaço de leitura. As falas devem rolar abaixo.
- O topo da área rolável do histórico deve apresentar sombreamento de overflow.
- Mudanças de composição devem ser animadas; a entrada dos elementos deve começar com opacidade zero.
- A composição deve permitir consultar os blocos anteriores sem fixar uma fala fora da área de rolagem.

#### RP-10 — Medição do percurso da história

Necessidades do usuário:

- Como aluno, quero que as histórias melhorem com o tempo, para encontrar menos trechos confusos ou cansativos.

Resultado: o percurso de cada tentativa produz eventos que permitem identificar onde os alunos erram, esgotam as vidas ou interrompem a história.

Atores: aluno autenticado; equipe de produto e de conteúdo, como consumidora dos eventos.

##### Regras de Negócio

- A história deve registrar os seguintes eventos:

| Evento | Momento | Informação associada |
| --- | --- | --- |
| História iniciada | Início de uma nova tentativa | Estrela |
| Questão respondida | Cada resposta enviada e avaliada | Estrela, posição da questão na sequência, tipo de questão e resultado: aprovada ou incorreta |
| Vidas esgotadas | Resposta incorreta que consome a última vida | Estrela e posição da questão |
| História recomeçada | Acionamento de Recomeçar história | Estrela |
| Saída com história incompleta | Acionamento de Sair antes da conclusão | Estrela e ponto de continuidade |
| História concluída | Conclusão da sequência | Estrela |

- A retomada de uma tentativa incompleta não deve ser registrada como história iniciada.
- Os eventos não devem incluir o conteúdo das respostas, como o código escrito ou o texto das alternativas.
- A identificação do aluno e o envio dos eventos devem seguir [Analytics de Produto](../analytics/product-analytics-prd.md).
- Falha no registro de um evento não deve impedir, atrasar ou alterar a progressão, as vidas ou a conclusão.
- Este PRD não define metas numéricas para as métricas derivadas desses eventos.

##### Regras de Experiência

- A medição não deve ser perceptível ao aluno nem acrescentar etapas, confirmações ou estados de carregamento.
- Uma falha de registro não deve apresentar mensagem de erro ao aluno.

#### RP-11 — Ambiente do planeta

Necessidades do usuário:

- Como aluno, quero perceber em que planeta estou, para sentir que cada parte da trilha acontece em um lugar diferente.

Resultado: a página da história apresenta o ambiente do planeta ao qual a estrela pertence, sem alterar a identidade dos blocos de texto.

Atores: aluno autenticado.

##### Regras de Negócio

- O ambiente deve ser determinado pelo planeta da estrela, conforme Trilha e Galáxia.
- O ambiente deve compreender o fundo da página, o cabeçalho e um som ambiente opcional.
- O fundo e o cabeçalho devem permanecer os mesmos durante toda a história, em leitura e em questões.
- Toda história deve começar com o som de base do seu planeta.
- O som de base deve ser um cenário sonoro do lugar, e não uma música.
- Os climas devem ser música discreta, sem voz cantada e sem melodia que dispute a atenção com a leitura ou com a narração.
- Som de base e climas devem pertencer à mesma categoria de som ambiente, com um único volume e um único silenciamento, conforme RP-13.
- Um bloco pode marcar uma troca de clima, definida pelo conteúdo. O novo clima deve valer até a próxima troca ou até o fim da história.
- Os climas devem pertencer a um conjunto compartilhado entre todas as histórias; um planeta possui apenas o seu som de base. O conteúdo não deve indicar um áudio fora desse conjunto.
- Uma troca também pode devolver o som ambiente ao som de base do planeta.
- A troca de clima deve alterar apenas o som. Ela não deve alterar o fundo, o cabeçalho nem as cores dos blocos.
- As questões devem manter o clima em vigor no ponto em que aparecem.
- Ao retomar uma história incompleta, o som ambiente deve ser o clima em vigor no ponto de continuidade.
- Consultar o histórico não deve alterar o clima em vigor.
- Recomeçar história deve devolver o som ambiente ao som de base.
- As cores dos blocos de texto devem permanecer fixas por personagem ou tipo, conforme RP-02 e [Blocos de texto e narração](text-blocks-and-narration-prd.md).
- O som ambiente deve vir silenciado por padrão. O aluno deve poder ativá-lo, silenciá-lo e ajustar seu volume pelos controles de áudio de RP-13, e essas preferências devem acompanhar a conta entre sessões e dispositivos.
- O som ambiente não deve reproduzir enquanto estiver silenciado nem substituir a narração ou os efeitos sonoros.
- A ausência ou a falha de carregamento do fundo ou do som ambiente não deve impedir leitura, resposta, avanço ou conclusão.
- O ambiente não deve alterar vidas, progresso, avaliação ou recompensas.

##### Regras de Experiência

- O ambiente não deve reduzir a legibilidade dos blocos, das questões ou do cabeçalho.
- Sem o ambiente do planeta disponível, a página deve usar a apresentação padrão, sem indicar erro ao aluno.
- Com preferência por movimento reduzido, o fundo deve ser apresentado sem animação.
- No volume padrão, o som ambiente deve permanecer inferior ao da narração.
- A passagem de um clima a outro deve ser gradual, sem corte abrupto.
- A troca de clima não deve ser o único sinal de uma virada da história: o texto ou o visual do bloco devem transmiti-la.
- Sem o clima disponível, o som ambiente deve permanecer no som de base ou em silêncio, sem indicar erro ao aluno.

#### RP-12 — Efeitos sonoros de sistema e da história

Necessidades do usuário:

- Como aluno, quero ouvir o resultado das minhas respostas e os acontecimentos da trama, para acompanhar a história com mais envolvimento.

Resultado: resultados da página e acontecimentos da história podem ser acompanhados por efeitos sonoros curtos, controlados pela preferência de som.

Atores: aluno autenticado.

##### Regras de Negócio

- A página deve preservar os efeitos sonoros de sistema nos seguintes momentos:

| Momento | Efeito |
| --- | --- |
| Resposta aprovada | Efeito de acerto |
| Resposta incorreta | Efeito de erro |
| Vidas esgotadas | Efeito do diálogo de vidas esgotadas |
| Execução de código com erro | Efeito de erro de execução |

- Acionar Continuar não deve reproduzir efeito sonoro.
- Qualquer bloco da história, de texto ou Lottie, pode possuir um efeito sonoro definido pelo conteúdo. O efeito é opcional: a maioria dos blocos não possui um.
- Os efeitos da história devem pertencer a uma biblioteca compartilhada entre as histórias, de modo que o mesmo acontecimento ou personagem use o mesmo som.
- O efeito da história deve reproduzir uma única vez, quando o bloco for revelado depois de Continuar.
- O efeito da história não deve reproduzir na consulta ao histórico nem no bloco reapresentado ao retomar uma história incompleta, e não deve oferecer ação de nova reprodução.
- Um efeito sonoro não deve interromper nem atrasar a narração, e o aluno não deve precisar esperar seu término para continuar.
- Efeitos de sistema e da história devem obedecer à preferência de som já existente na aplicação, ativa por padrão, e ao volume de efeitos definido em RP-13.
- A ausência ou a falha de carregamento de um efeito não deve apresentar erro nem impedir leitura, resposta, avanço ou conclusão.
- Um efeito sonoro não deve alterar vidas, progresso, avaliação ou recompensas.

##### Regras de Experiência

- O som não deve ser o único sinal de acerto, de erro, de esgotamento ou de um acontecimento da história: a informação deve existir também em texto ou em indicação visual.
- Os efeitos devem ser curtos e, no volume padrão, permanecer em volume inferior ao da narração.
- Com a preferência de som desligada, nenhum efeito deve ser reproduzido e a história deve permanecer compreensível.

#### RP-13 — Controles de áudio da história

Necessidades do usuário:

- Como aluno, quero ajustar o som ambiente e os efeitos separadamente sem sair da história, para deixar o áudio do meu jeito e não precisar ajustá-lo de novo em cada história.

Resultado: um botão no cabeçalho abre um diálogo com volume e silenciamento próprios para o som ambiente e para os efeitos sonoros; as configurações valem imediatamente, persistem e se aplicam às demais histórias.

Atores: aluno autenticado.

##### Regras de Negócio

- O cabeçalho da história deve oferecer um botão que abre o diálogo de controles de áudio, disponível durante a leitura e durante as questões.
- O diálogo deve tratar som ambiente e efeitos sonoros como categorias separadas: ajustar uma não deve alterar a outra.
- Cada categoria deve possuir um controle de volume próprio e uma opção de ativar ou silenciar.
- A categoria de efeitos deve abranger os efeitos de sistema e os efeitos da história de RP-12. A categoria de som ambiente deve abranger o som de base e os climas de RP-11.
- Silenciar uma categoria deve preservar o volume escolhido, restaurado quando ela for reativada.
- Uma mudança de volume ou de silenciamento deve valer imediatamente, inclusive sobre o som em reprodução, sem recarregar a página nem reiniciar a história.
- Ativar o som ambiente deve iniciar o clima em vigor; silenciá-lo deve interrompê-lo.
- As configurações devem ser persistidas e aplicadas automaticamente ao abrir qualquer outra história, sem nova ação do aluno.
- O silenciamento e o volume do som ambiente devem acompanhar a conta entre sessões e dispositivos, conforme RP-11. O silenciamento dos efeitos deve ser a preferência de som já existente na aplicação, e o volume dos efeitos deve ser guardado junto a ela.
- Os padrões devem ser: som ambiente silenciado e efeitos ativos. O volume inicial de cada categoria deve ser o volume padrão.
- O diálogo deve oferecer também a reprodução automática da narração, como a mesma preferência definida em [Blocos de texto e narração](text-blocks-and-narration-prd.md). Ativá-la não deve iniciar a narração do bloco atual; ela vale para os blocos revelados depois de Continuar. O diálogo não ajusta o volume da narração.
- Ativar e silenciar devem ser as mesmas preferências disponíveis fora da história; o diálogo não deve criar preferências exclusivas de uma história.
- Abrir, usar ou fechar o diálogo não deve alterar vidas, progresso, resposta em andamento ou estado da questão, nem ser tratado como saída da história.
- Uma falha ao guardar uma configuração não deve impedir a leitura, a resposta ou o avanço; a configuração deve continuar valendo na história em andamento.

##### Regras de Experiência

- O botão deve possuir nome acessível e ser operável por teclado.
- Cada categoria deve ser identificada por nome e deixar compreensível, além da cor, se está ativa ou silenciada e qual é seu volume.
- Os controles de volume devem ser operáveis por teclado e anunciar seu valor a leitores de tela.
- Com a categoria silenciada, seu controle de volume deve continuar mostrando o volume preservado.
- O aluno deve poder perceber o resultado de um ajuste de volume enquanto o faz, sem precisar fechar o diálogo.
- Ao fechar o diálogo, o foco deve voltar ao botão que o abriu.
- No mobile, o diálogo deve caber na largura disponível, sem scroll horizontal.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Trilha e Galáxia | Histórias interativas | Fornecer identidade da estrela, ordem, desbloqueio e regras de acesso e revisão. |
| Conteúdo da história | Histórias interativas | Fornecer a sequência de blocos, personagens, avatares, tipos, pontos de encerramento do destaque, o efeito sonoro dos blocos que o possuem e as trocas de clima; a autoria fica fora deste PRD. |
| Trilha e Galáxia | Ambiente do planeta | Fornecer o planeta ao qual a estrela pertence. |
| Biblioteca de efeitos e ambientes | Histórias interativas | Fornecer os efeitos, o som de base de cada planeta, o conjunto compartilhado de climas e os fundos; sua produção fica fora deste PRD. |
| Preferências de som | Histórias interativas | Fornecer a preferência de som existente e o volume dos efeitos, o silenciamento e o volume do som ambiente vinculados à conta e a preferência de reprodução automática da narração, todos ajustáveis pelos controles de áudio. |
| Narrativa e universo das histórias | Conteúdo da história | Fornecer enredo, elenco, planetas e reviravoltas que o conteúdo apresenta. |
| Histórias interativas | Analytics de Produto | Fornecer os eventos do percurso da história definidos em RP-10. |
| Histórias interativas | Questões e exemplos de leitura | Fornecer o contexto da sequência e aplicar o contrato comum de progressão, vidas e histórico. |
| Múltipla escolha, programação em blocos e escrita de código | Histórias interativas | Fornecer interação, avaliação e feedback específicos por meio de PRDs próprios. |
| Conta do aluno | Histórias interativas | Preservar e disponibilizar a continuidade da tentativa entre sessões e dispositivos. |
| Áudio persistido | Histórias interativas | Fornecer arquivos disponíveis para os blocos elegíveis, sem geração em tempo real. |
| Histórias interativas | Trilha e Galáxia; resultado e recompensas | Fornecer a conclusão da estrela para progressão e apresentação do resultado. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Percorrer uma história

1. O aluno acessa uma estrela de história autorizada pela trilha.
2. O sistema apresenta a sequência, o progresso e as vidas da tentativa.
3. O aluno acompanha os blocos usando Continuar.
4. Quando houver narração disponível, pode ouvi-la; sem áudio, continua lendo normalmente.
5. Quando houver exemplo executável, pode executá-lo ou continuar sem executar.
6. Ao encontrar uma questão, segue JN-02; ao terminar a sequência, segue JN-06.

#### JN-02 — Responder uma questão

1. O sistema apresenta o enunciado acima da atividade, sem o histórico simultâneo.
2. O aluno responde e envia sua resposta para avaliação.
3. Se a resposta estiver incorreta, perde uma vida, recebe a indicação de erro definida pelo PRD do tipo de questão e pode tentar novamente enquanto houver vidas.
4. Se a resposta estiver aprovada, recebe feedback e pode acionar Continuar.
5. Após Continuar, a sequência prossegue e a resposta aprovada permanece consultável no histórico.
6. Se as vidas acabarem, segue JN-05.

#### JN-03 — Consultar o histórico e acompanhar o destaque

1. A história apresenta um elemento visual em destaque.
2. No desktop, o elemento permanece ao lado do histórico; no mobile, permanece no topo abaixo do cabeçalho.
3. O aluno rola todas as falas e os blocos anteriores na área do histórico.
4. Ao atingir o ponto definido da progressão, o elemento sai do destaque e passa a integrar o histórico normalmente.
5. A história prossegue com a composição correspondente ao próximo conteúdo.

#### JN-04 — Interromper e retomar

1. O aluno sai ou recarrega uma história incompleta.
2. O ponto de continuidade, os blocos percorridos, as respostas aprovadas e as vidas restantes são preservados na conta.
3. Ao sair, o aluno retorna à Galáxia.
4. Ao abrir novamente a história, na mesma sessão ou em outro dispositivo, retoma o ponto preservado.
5. O aluno consulta seu histórico e continua sem repetir questões já aprovadas na tentativa.

#### JN-05 — Ficar sem vidas

1. Uma resposta incorreta consome a última vida da tentativa, apresentada como a última unidade de energia da nave.
2. O sistema impede o avanço e apresenta o diálogo de vidas esgotadas, informando que a nave ficou sem energia e recua para a órbita.
3. O aluno escolhe uma ação:
   - Recomeçar história: toda a tentativa anterior é limpa; a história reinicia com dez vidas.
   - Sair: o aluno retorna à Galáxia, sem restaurar as vidas da tentativa esgotada.
4. A ação Recomeçar história não preserva apenas a questão atual nem as respostas aprovadas da tentativa anterior.

#### JN-06 — Concluir a história

1. O aluno percorre todos os blocos e aprova as questões da sequência.
2. A barra chega a 100% e a conclusão identifica a estrela correspondente.
3. O sistema encaminha o aluno à experiência de resultado.
4. O resultado e o retorno à Galáxia seguem seus PRDs próprios.

#### JN-07 — Acompanhar o ambiente e os sons da história

1. O aluno abre uma história e encontra o fundo e o cabeçalho do planeta da estrela.
2. Com o som ambiente ativo, ouve o som de base do planeta no volume que escolheu; silenciado, a história segue sem som ambiente.
3. Ao chegar a um bloco que marca uma troca de clima, o som ambiente passa gradualmente ao novo clima, que permanece até a próxima troca.
4. Ao acionar Continuar, um bloco que possui efeito sonoro o reproduz uma única vez, sem interromper a narração.
5. Ao responder uma questão, ouve o efeito de acerto ou de erro, além da indicação visual; o clima em vigor é mantido.
6. Ao consultar o histórico ou retomar a história, os efeitos dos blocos já percorridos não são reproduzidos; na retomada, o som ambiente volta no clima do ponto de continuidade.
7. Com a preferência de som desligada, percorre a mesma história sem efeitos e sem perder informação.

#### JN-08 — Ajustar o áudio durante a história

1. O aluno aciona o botão de áudio no cabeçalho, durante a leitura ou durante uma questão.
2. O diálogo apresenta o som ambiente e os efeitos sonoros como categorias separadas, cada uma com seu volume e seu estado, além da reprodução automática da narração.
3. O aluno ativa o som ambiente; o clima em vigor começa a tocar imediatamente.
4. O aluno reduz o volume do som ambiente e ouve a mudança enquanto ajusta; o volume dos efeitos permanece o mesmo.
5. O aluno silencia os efeitos sonoros; nenhum efeito é reproduzido a partir desse momento, e o volume escolhido é preservado.
6. O aluno fecha o diálogo e continua do mesmo ponto, com vidas, progresso e resposta em andamento inalterados.
7. Ao abrir outra história, encontra o áudio com as mesmas configurações, sem precisar ajustá-las de novo.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP deste PRD |
| --- | --- |
| Autoria | Cadastro, edição e publicação de planetas, estrelas, histórias, questões, soluções e cenas. |
| Atividades | Algoritmos e regras específicos de avaliação, incluindo avaliação determinística e Jev; interfaces específicas e versões de leitura serão documentadas separadamente. |
| Desafios | Funcionamento das estrelas de desafio independente de código. |
| Resultado e recompensas | Cálculo de XP e moedas, apresentação do resultado e streak. |
| Áudio | Geração, cancelamento ou gerenciamento de arquivos e novas vozes. |
| Implementação | Contratos de armazenamento, sincronização, concorrência entre dispositivos e infraestrutura de execução. |
| Narrativa | Enredo, elenco, planetas e reviravoltas, definidos em [Narrativa e universo das histórias](story-narrative-prd.md). |
| Metas de medição | Metas numéricas para tempo por estrela, taxa de erro, abandono ou conclusão. |
| Produção de som e ambiente | Criação, seleção e gerenciamento dos efeitos sonoros, dos sons de base, dos climas e dos fundos de cada planeta; a definição de quais climas compõem o conjunto. |
| Volume da narração e volume geral | Ajuste do volume da narração e um controle único de volume para todo o áudio; o diálogo ajusta apenas som ambiente e efeitos. |
| Volume nas configurações | Oferta dos controles de volume fora da história, nas configurações da aplicação. |
| Vídeos | Vídeos de apresentação dos planetas e de encerramento da trilha, definidos em [Trilha e Galáxia](../space/galaxy-page-prd.md). A história não reproduz vídeos. |
| Preferência de som existente | Mudança da preferência de som da aplicação para a conta ou alteração de seu controle nas configurações. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| História seguida de um estágio separado de quiz | Questões integram a própria sequência da história. |
| Cinco vidas iniciais | Uma nova tentativa começa com dez vidas. |
| Reiniciar apenas a questão após esgotar vidas | Recomeçar reinicia toda a história e restaura dez vidas. |
| Reiniciar o estado ao sair | A tentativa incompleta é preservada na conta. |
| Retomada restrita ao dispositivo | A tentativa acompanha a conta entre dispositivos. |
| Avançar automaticamente após o acerto | O aluno lê o feedback e aciona Continuar. |
| Exigir execução dos exemplos para avançar | Exemplos são somente leitura e sua execução é opcional quando disponível. |
| Fixar uma fala fora do histórico rolável | Todas as falas pertencem ao histórico; somente o elemento visual fica sticky. |
| No mobile, o destaque acompanhar a rolagem | O destaque fica sticky no topo abaixo do cabeçalho, com altura limitada. |
| Usar tempo e erros para compor a recompensa | Tempo e quantidade de erros não compõem o cálculo da recompensa deste fluxo. |
| Gerar narração em tempo real quando faltar arquivo | Consumir apenas áudio previamente gerado e disponível. |
| Definir metas numéricas junto com a medição | Registrar os eventos primeiro; definir metas após os primeiros dados. |
| Adiar a medição | Registrar os eventos do percurso desde esta revisão. |
| Falas escolhíveis para o aluno durante a história | A resposta aprovada aparece no histórico como ação do aluno; não há escolha de falas. |
| Trocar os botões do diálogo por termos da ficção, como Voltar à órbita | Botões literais Recomeçar história e Sair; apenas o nome, o ícone e o texto do diálogo usam a ficção. |
| Manter vidas na interface e levar a ficção apenas ao conteúdo | A interface apresenta as vidas como energia da nave. |
| Cena que reage ao código escrito ou aos exemplos executáveis | Cenas por evento permanecem nas questões que já as possuem; a consequência do código escrito é um Lottie em destaque. |
| Efeito sonoro ao acionar Continuar | Continuar não reproduz som. |
| Efeitos sonoros da história apenas em Lotties | Qualquer bloco, de texto ou Lottie, pode possuir um efeito opcional. |
| Um único controle para efeitos e som ambiente | Efeitos seguem a preferência de som existente, ativa por padrão; o som ambiente possui preferência própria, silenciada por padrão. |
| Manter os controles de som apenas nas configurações | Decisão revista em 2026-11-13: um botão no cabeçalho abre o diálogo de controles de áudio, com as mesmas preferências das configurações. |
| Controles que apenas ligam e desligam cada tipo de som | Volume individual para som ambiente e para efeitos, além de ativar ou silenciar. |
| Configurações de áudio válidas apenas na história em andamento | Persistidas e aplicadas automaticamente nas demais histórias. |
| Som ambiente composto apenas por cenário sonoro, sem música | Cenário sonoro na base de cada planeta e música discreta nos climas. |
| Um tema musical para cada planeta, com climas como variações | A base é cenário sonoro; a música fica nos climas compartilhados. |
| Climas próprios de cada planeta | Conjunto pequeno e compartilhado; cada planeta possui apenas o som de base. |
| Qualquer áudio indicado livremente pelo conteúdo como som ambiente | O conteúdo escolhe entre os climas do conjunto compartilhado. |
| Troca de clima também visual, com variação do fundo | Apenas sonora nesta versão; o fundo permanece fixo por planeta. |
| Vídeo de abertura e de gancho em cada estrela | Abertura e gancho são texto da história; vídeos existem apenas por planeta, na Galáxia. |
