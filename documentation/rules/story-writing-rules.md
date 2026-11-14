# Regras de Escrita de Histórias

# Visão Geral

Uma história é o conteúdo de uma estrela de lição: uma sequência ordenada de
blocos de texto, visuais, exemplos somente leitura e questões. Estas regras
definem como uma história deve ser escrita para que o estudante passe mais
tempo praticando do que lendo.

## Objetivo

Padronizar o ritmo, a combinação de questões e a estrutura de toda história,
para que cada estrela ensine um conceito por meio de uma explicação seguida
imediatamente de prática.

## Responsabilidades

- Limitar a leitura contínua e intercalá-la com questões.
- Ordenar as questões de uma estrela do reconhecimento à escrita.
- Reutilizar conceitos anteriores para que não sejam esquecidos.
- Abrir e fechar toda estrela com um gancho narrativo.
- Manter as mecânicas dentro da ficção: energia da nave, dicas ditas pela
  Faísca, respostas que soam como ações do estudante.
- Manter toda história consistente com a narrativa aprovada.

## Limites

- Estas regras cobrem o **conteúdo** de uma história. O comportamento da página
  de lição (vidas, progresso, retomada, destaque, histórico) pertence aos PRDs
  em `documentation/prds/lesson/`.
- O enredo, o elenco e o que cada planeta revela pertencem a
  [Narrativa e universo das histórias](../prds/lesson/story-narrative-prd.md). Uma
  história não deve contradizê-la nem antecipá-la.
- Todo trecho de Delégua em uma história também segue as
  [Regras da Linguagem Delégua](delegua-rules.md).
- Os vídeos dos planetas são assistidos na Galáxia, não na história, e pertencem
  a [Trilha e Galáxia](../prds/space/galaxy-page-prd.md). O estudante pode pulá-los,
  portanto uma história deve se sustentar sem eles.
- Estas regras não cobrem as estrelas de desafio, que são avaliadas de forma
  independente.
- O conteúdo voltado ao estudante é escrito em PT-BR. Este documento também
  está em PT-BR, como as demais regras, e cita os termos do produto
  literalmente.

# Estrutura de Diretórios Globais

O conteúdo das histórias e as suas autoridades ficam em:

- `documentation/prds/lesson/story-narrative-prd.md`: enredo, elenco, planetas,
  reviravoltas e o código da história.
- `documentation/prds/lesson/lesson-page-prd.md`: sequência de blocos, questões,
  vidas, histórico e destaque.
- `documentation/prds/lesson/multiple-choice-prd.md`,
  `documentation/prds/lesson/block-programming-prd.md` e
  `documentation/prds/lesson/code-writing-prd.md`: os três tipos de questão.
- `documentation/prds/lesson/text-blocks-and-narration-prd.md` e
  `documentation/prds/lesson/visual-blocks-prd.md`: tipos de bloco de texto e
  visuais.
- `documentation/prds/space/galaxy-page-prd.md`: abertura do planeta, o vídeo de
  apresentação de cada planeta e o vídeo de encerramento da trilha.
- `apps/web/src/mocks/lesson/planets/planet<N>/star<N>/`: `texts.ts` e
  `questions.ts` de cada estrela.
- `apps/server/src/database/seeders/data/seed-catalog.json`: o snapshot do
  catálogo que popula planetas e estrelas localmente.

## Organização

- Uma estrela ensina um conceito. Um segundo conceito pertence a outra estrela.
- A ordem das estrelas dentro de um planeta segue a progressão pedagógica, não
  a ordem do enredo.
- Uma história é escrita para os tipos de bloco e os tipos de questão que os
  PRDs definem. Uma regra daqui não deve exigir uma capacidade que os PRDs não
  oferecem.

# Princípios Fundamentais

## Deve conter

### No máximo cinco blocos de texto consecutivos

Uma história não deve apresentar mais de cinco blocos de texto seguidos antes
de uma questão.

- Somente os blocos de texto contam. Exemplos somente leitura e visuais não
  contam nem reiniciam a contagem.
- A contagem reinicia a cada questão.
- Uma história que precisa de mais de cinco blocos de texto para explicar algo
  deve ser dividida por uma questão sobre o que acabou de ser explicado.

### Prever antes de executar

Antes que o estudante possa executar um exemplo somente leitura cuja saída
ensina o conceito, a história deve perguntar o que o código vai escrever.

- Use uma questão de múltipla escolha em `modo previsão`, que
  mantém `Executar` indisponível até a questão ser aprovada.
- Após a aprovação, o estudante executa o código para confirmar a previsão.
- As alternativas devem ser saídas plausíveis, incluindo as saídas produzidas
  por leituras equivocadas comuns do código.

### Uma escada em toda estrela

As questões de uma estrela devem seguir esta ordem de dificuldade:

1. **Prever**: múltipla escolha sobre o que um trecho faz.
2. **Montar**: programação em blocos com um conjunto selecionado de blocos.
3. **Completar**: escrita de código que parte de um trecho inicial.
4. **Escrever**: escrita de código do zero.

Uma estrela pode pular um degrau que não se encaixa no seu conceito, mas não
deve reordenar os degraus e deve terminar com uma questão de escrita de
código.

**Exceção:** uma estrela que não ensina sintaxe está isenta do requisito de
escrita de código. Hoje a única é a estrela de lógica de programação do
primeiro planeta. Uma nova exceção deve ser adicionada a esta lista antes de a
estrela ser escrita.

### Questões de corrigir o erro

Cada planeta deve conter pelo menos uma questão de escrita de código cujo
trecho inicial é um código quebrado que o estudante conserta.

- Na ficção, o código quebrado é algo que a Faísca executou sem pensar.
- O trecho deve conter exatamente um tipo de erro, e esse erro deve ser comum
  para o conceito da estrela.
- Use a modalidade de completar da escrita de código. O editor inteiro
  permanece editável.

### Revisão embutida

- A primeira questão de toda estrela, exceto a primeira estrela da trilha,
  deve ser sobre o conceito da estrela anterior.
- A estrela de desafio que fecha um planeta deve exigir pelo menos um conceito
  de um planeta anterior.

### Alternativas erradas com propósito

- Toda alternativa incorreta de uma questão de múltipla escolha deve
  representar um erro específico e comum de iniciante. Uma alternativa que
  nenhum estudante escolheria deve ser substituída.
- Toda alternativa incorreta deve ter a sua própria `dica`. A dica trata
  do erro por trás daquela alternativa e não deve revelar nem apontar a
  correta.
- O feedback de acerto explica por que a alternativa correta está correta.

### Uma consequência visível após o código escrito

Após uma questão de escrita de código, o bloco seguinte deve ser um visual em
destaque que mostra o que o código aprovado causou na história: o foguete
decola, a porta se abre, a nave se reúne ao comboio.

### Um resumo no final

O último bloco de toda história deve ser um bloco de texto do tipo
`informação`, com no máximo três linhas, declarando o que o estudante aprendeu
na estrela.

### Um gancho nas duas pontas

Toda estrela deve abrir e fechar com um gancho narrativo, escrito como blocos
de texto.

- **Gancho de abertura.** Os primeiros blocos da estrela, antes da primeira
  questão, declaram o que está acontecendo no planeta neste momento e o que
  está em jogo. Eles contam para o limite de cinco blocos.
- **Gancho de encerramento.** O bloco imediatamente anterior ao resumo deixa
  uma pergunta em aberto sobre o que vem a seguir, para que o estudante tenha
  um motivo para voltar.
- Um gancho não deve recapitular o enredo. Ele faz a história avançar.
- Um gancho não deve repetir o que o vídeo do planeta mostra e não deve
  depender de o estudante tê-lo assistido.

### Dicas na voz da Faísca

Toda dica de uma questão deve ser uma fala dita pela Faísca, em um bloco do
tipo `dica`.

- A Faísca é impulsiva: as suas dicas são curtas e diretas, nunca uma aula.
- As regras de [Alternativas erradas com propósito](#alternativas-erradas-com-propósito)
  continuam valendo: a dica trata do erro e não revela a resposta.

### Energia da nave, nunca vidas

Na ficção, uma resposta errada é um comando errado que a nave executa, e ele
custa energia da nave. Sem energia, a nave recua para a órbita do planeta e a
história recomeça.

- O texto da história deve dizer `energia` ou `energia da nave`, nunca `vidas`.
- Executar um exemplo somente leitura ou testar código não custa energia, e a
  história não deve sugerir que custa.

### Efeitos sonoros que marcam eventos

Um bloco pode ter um efeito sonoro opcional, escolhido da biblioteca
compartilhada.

- Use um efeito sonoro somente em um bloco em que algo acontece na história:
  um alarme, uma porta, uma decolagem, uma chegada.
- Use o mesmo efeito para o mesmo evento ou personagem ao longo da trilha. A
  presença do Nulo sempre usa o seu próprio efeito.
- O texto ou o visual do bloco deve transmitir o evento por conta própria: o
  estudante pode estar com o som desligado.

### Mudanças de clima nos pontos de virada

Toda história começa com o som ambiente base do seu planeta, que é uma
paisagem sonora do lugar, não música. Um bloco pode marcar uma mudança de
`clima`, escolhido do conjunto compartilhado por todas as histórias. Um
clima é uma música discreta.

- Mude o clima somente quando a cena vira: uma ameaça chega, um perigo passa,
  algo é revelado.
- Um clima dura até a próxima mudança ou até o fim da estrela. Volte ao som
  base do planeta quando a virada terminar.
- Use cada clima para o mesmo tipo de momento ao longo da trilha, para que o
  estudante aprenda o que ele significa.
- O clima é apenas som, e o som ambiente vem desligado por padrão: o texto ou
  o visual deve sustentar a virada sem ele.

## Não deve conter

- Mais de cinco blocos de texto consecutivos.
- Um exemplo somente leitura cuja saída é o ponto central da lição, mostrado
  sem uma questão de previsão antes dele.
- Uma estrela que termina em uma questão de múltipla escolha ou de programação
  em blocos, a menos que seja uma exceção listada.
- Uma questão de múltipla escolha que só pode ser respondida por eliminação
  porque as suas alternativas erradas são implausíveis.
- Uma dica que declara a resposta correta ou exclui todas as alternativas
  menos uma.
- Uma questão cuja resposta depende de um conceito que a trilha ainda não
  ensinou.
- Um personagem, lugar ou revelação que contradiz o PRD de narrativa, ou uma
  reviravolta revelada antes do seu planeta.
- Uma questão cuja resposta correta é quem executou a função que apagou Lira.
  A narrativa mantém isso em aberto.
- Uma estrela que começa com uma questão ou termina sem um gancho de
  encerramento.
- Uma história que depende de algo mostrado somente em um vídeo de planeta.
- Uma dica dita por um personagem que não seja a Faísca, ou escrita como texto
  de interface sem personagem.
- A palavra `vidas` no texto da história.
- Um efeito sonoro em uma fala comum de diálogo, ou um evento que somente o
  som transmite.
- Um clima que não está no conjunto compartilhado, ou uma mudança de clima a
  cada poucos blocos.
- Código Delégua que não foi validado no interpretador do projeto.

# Padrões de Projeto

## Esqueleto da estrela

Use este esqueleto como ponto de partida de uma história. As sequências de
texto entre questões ficam dentro do limite de cinco blocos.

1. Gancho de abertura: o que está acontecendo no planeta neste momento.
2. Questão de revisão sobre a estrela anterior, ambientada nessa situação.
3. Explicação do conceito, com um exemplo somente leitura.
4. Questão de previsão sobre esse exemplo; em seguida, o estudante o executa.
5. Questão de programação em blocos que monta a mesma ideia.
6. Questão de escrita de código a partir de um trecho inicial. Quando o planeta
   ainda não tiver uma, faça dela uma questão de corrigir o erro.
7. Questão de escrita de código do zero.
8. Visual em destaque com a consequência na história.
9. Gancho de encerramento: a pergunta que a próxima estrela responde.
10. Bloco de resumo do tipo `informação`.

Evite esticar o esqueleto com etapas extras de explicação. Quando um conceito
precisar de um segundo exemplo, dê a ele a sua própria questão de previsão.

## Questão de previsão

- O enunciado pergunta o que o código escreve ou qual valor uma variável guarda
  ao final.
- O código de referência é o mesmo exemplo somente leitura que a história
  acabou de apresentar, ou uma pequena variação dele.
- Mantenha o trecho curto o suficiente para ser acompanhado mentalmente.

Evite questões de previsão para código cuja saída depende de uma entrada que o
estudante não pode ver.

## Questão de corrigir o erro

- O enunciado diz o que o código deveria fazer e o que aconteceu no lugar. Ele
  não diz onde está o erro.
- Os requisitos descrevem o comportamento esperado, não a edição específica.

Evite trechos com vários erros não relacionados: o estudante não consegue
saber de qual deles a estrela trata.

## Questão como ação

Após a aprovação, a resposta aparece no histórico como uma ação do personagem
do estudante.

- Escreva o enunciado de modo que a resposta seja algo que o estudante faz na
  história: o comando enviado à nave, a escolha feita em uma bifurcação, o
  programa que abre uma porta.
- Prefira enunciados ditos por um personagem que precisa daquela ação a
  enunciados que tratam o estudante como alguém fazendo uma prova.

Evite enunciados como "Marque a alternativa correta", que fazem a resposta
soar como um item de prova no histórico.

# Padrões de Uso Aplicados

## Contagem de blocos de texto

| Sequência | Válida | Motivo |
| --- | --- | --- |
| texto, texto, texto, exemplo, texto, texto, questão | Sim | Cinco blocos de texto; o exemplo não conta. |
| texto ×5, visual, texto, questão | Não | Seis blocos de texto; o visual não reinicia a contagem. |
| texto ×5, questão, texto ×5, questão | Sim | A contagem reinicia a cada questão. |

## Escrita de uma dica

Em uma questão que pergunta o que `escreva("2" + 2)` escreve, uma alternativa
`4` vem de tratar o texto `"2"` como um número.

- Dica correta: "Observe as aspas em volta do primeiro valor."
- Dica incorreta: "O resultado é um texto, não um número." Ela revela a
  categoria da resposta e exclui as outras alternativas.

A dica correta também combina com a Faísca: uma fala curta e direta.

## Escolha de um efeito sonoro

| Bloco | Efeito sonoro | Motivo |
| --- | --- | --- |
| O alarme da nave dispara enquanto Panda está falando | Sim | Um evento acontece neste bloco. |
| O Nulo aparece no fim de um corredor | Sim, o efeito do Nulo | O mesmo efeito marca o Nulo em todos os planetas. |
| Panda explica o que é uma variável | Não | Nada acontece; é uma fala comum. |
| Uma porta se abre, e o texto diz apenas "Ouça." | Não | Somente o som transmite o evento. Reescreva o texto primeiro. |

## Erros comuns

- **Explicar duas vezes antes de perguntar uma.** Pergunte após a primeira
  explicação e explique o restante no feedback de acerto.
- **Usar múltipla escolha como único tipo de questão.** O estudante termina a
  estrela reconhecendo código sem ter escrito nenhum.
- **Revisar com a mesma questão.** Uma questão de revisão deve aplicar o
  conceito anterior a uma situação nova, não repetir uma questão que o
  estudante já respondeu.
- **Visuais decorativos.** Um visual em destaque após o código escrito deve
  mostrar o efeito desse código, não uma cena sem relação.
- **Uma recapitulação no lugar de um gancho.** Uma abertura que reconta a
  estrela anterior gasta blocos de texto sem fazer a história avançar.
- **Som em todo lugar.** Quando a maioria dos blocos tem um efeito, o efeito
  deixa de significar que algo aconteceu.
- **Um clima que nunca termina.** Um clima de tensão mantido durante a
  explicação e as questões deixa de soar como tensão. Volte ao som base.

# Regras de Integração com Outras Camadas

- **PRDs da página de lição.** Uma história usa somente os blocos, os tipos de
  questão e os estados que esses PRDs definem. Quando uma regra daqui precisar
  de uma nova capacidade, altere o PRD primeiro, pelo workflow de SDD.
- **Vidas e energia da nave.** Os PRDs usam `vida` para a regra e a apresentam
  ao estudante como `energia da nave`, conforme definido em `lesson-page-prd.md`.
  O texto da história usa somente a segunda.
- **Som.** Os efeitos de sistema e o efeito opcional de um bloco são definidos
  em `lesson-page-prd.md`. O efeito de um bloco toca uma vez, quando o bloco é
  revelado, e nunca no histórico. O som ambiente base pertence ao planeta; um
  bloco só pode trocá-lo por um clima do conjunto compartilhado. O estudante
  controla a narração, os efeitos e o som ambiente pelo diálogo de áudio da
  história.
- **Vídeos dos planetas.** O seu conteúdo é definido em `story-narrative-prd.md` e
  a sua reprodução em `galaxy-page-prd.md`. Uma história não os reproduz nem os
  referencia.
- **Múltipla escolha.** O modo previsão e as dicas por alternativa são
  definidos em `multiple-choice-prd.md`. Toda questão de múltipla escolha fornece o
  enunciado, as alternativas ordenadas, uma alternativa correta, o feedback de
  acerto e uma dica para cada alternativa incorreta, dita pela Faísca.
- **Escrita de código.** As questões de corrigir o erro usam a modalidade de
  completar definida em `code-writing-prd.md`. Executar código nunca custa uma
  vida; somente uma resposta avaliada e reprovada custa.
- **Programação em blocos.** Cada questão oferece somente os blocos
  selecionados para a atividade, conforme definido em `block-programming-prd.md`.
- **Visuais.** Um visual em destaque é sempre um Lottie, conforme definido em
  `visual-blocks-prd.md`.
- **Narrativa.** O elenco, a identidade dos planetas, as pistas e as
  reviravoltas vêm de `story-narrative-prd.md`.
- **Delégua.** Palavras reservadas, valores lógicos e identificadores seguem
  `delegua-rules.md`.

# Checklist Rápido para Novas Features na Camada

- [ ] Nenhuma sequência de blocos de texto tem mais de cinco.
- [ ] Todo exemplo cuja saída importa é precedido por uma questão de previsão.
- [ ] As questões seguem a escada, em ordem.
- [ ] A estrela termina com uma questão de escrita de código, ou é uma exceção
      listada.
- [ ] O planeta tem pelo menos uma questão de corrigir o erro.
- [ ] A primeira questão revisa a estrela anterior.
- [ ] Toda alternativa incorreta é um erro plausível e tem a sua própria dica.
- [ ] Nenhuma dica revela ou aponta a alternativa correta.
- [ ] Um visual em destaque vem após cada questão de escrita de código.
- [ ] O último bloco é um resumo `informação` de no máximo três linhas.
- [ ] A estrela abre com um gancho e tem um gancho de encerramento logo antes
      do resumo.
- [ ] Nada na história depende do vídeo do planeta.
- [ ] Toda dica é uma fala curta dita pela Faísca.
- [ ] O texto da história diz `energia`, nunca `vidas`.
- [ ] Cada efeito sonoro marca um evento que o texto ou o visual também
      transmite.
- [ ] Cada mudança de clima marca uma virada da cena, usa o conjunto
      compartilhado e volta ao som base quando a virada termina.
- [ ] Cada enunciado faz a resposta soar como uma ação do estudante.
- [ ] Nada contradiz ou antecipa o PRD de narrativa.
- [ ] Todo o código Delégua foi validado no interpretador do projeto.

# Observações e Pendências

- **O conteúdo existente não está em conformidade.** As histórias do catálogo
  atual foram escritas antes destas regras e têm entre 34 e 59 blocos cada.
  Elas devem ser reescritas, não remendadas.
- **Explicação com IA em questões de previsão.** Os PRDs mantêm
  `explicar com IA` disponível no código de referência, inclusive em modo
  previsão, no qual ela pode descrever a saída antes de o estudante responder.
  Está previsto que o recurso seja desativado no código por enquanto. A regra
  deve ser revista antes de ele ser habilitado novamente.
- **Gancho de encerramento antes do resumo.** O resumo permanece como o último
  bloco, conforme aprovado, portanto o gancho de encerramento é o bloco
  anterior a ele. Colocar o gancho por último encerraria a estrela na pergunta
  em aberto; essa ordem não foi aprovada.
- **Biblioteca de sons.** A biblioteca compartilhada de efeitos das histórias
  e o conjunto compartilhado de climas ainda não existem. Até existirem, uma
  história registra o evento pretendido de cada efeito e o tipo de clima
  pretendido, não um arquivo.
- **Dicas fora da múltipla escolha.** Hoje somente a múltipla escolha define
  uma dica. Se outro tipo de questão ganhar uma, ela segue a mesma regra.
- **Medição.** `lesson-page-prd.md` define os eventos que medem uma história.
  Nenhuma meta numérica foi aprovada, portanto estas regras não estabelecem
  limite para o tempo por estrela nem para a taxa de erro.
- **Ferramentas de autoria.** Estas regras não dependem de como uma história é
  escrita. Quando o Backoffice validar uma história, o checklist acima é a
  referência.
- **Lista de exceções.** A única exceção ao requisito de escrita de código é a
  estrela de lógica de programação. A trilha está sendo reescrita, portanto a
  lista deve ser revista quando as novas estrelas forem definidas.
