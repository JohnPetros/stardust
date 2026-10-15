# Consolidação — reformulação da trilha do Stardust

Registro da sessão, consolidado em 2026-10-11. Reúne decisões de produto,
comportamento e design; serve como base para a próxima revisão dos PRDs e
para uma futura Spec. Os desenhos não constituem implementação na aplicação.

Referências: [canvas](stardust.pen), [tokens de design](../documentation/design.md),
[PRD do editor de histórias](../documentation/features/lesson/story-editor/prd.md).
O handoff de onboarding em `design/handoff.md` pertence a outra entrega.

## 1. Vocabulário e organização da trilha

| Nome na interface | Significado pedagógico | Conteúdo |
| --- | --- | --- |
| Planeta | Tema, como variáveis, condicionais ou loops | Uma sequência de estrelas |
| Estrela | Etapa de aprendizagem | História ou desafio de código no desenho final trabalhado |
| História | Experiência guiada e interativa | Uma sequência de blocos da história |
| Bloco da história | Item da sequência | Texto, imagem, animação, exemplo ou questão |
| Questão de programação em blocos | Atividade com Blockly | Montagem com os blocos selecionados para aquela questão |
| Questão de programação em código | Atividade de escrita em Delégua | Escrever ou completar código |

- Os planetas têm ordem de conclusão. Concluir um planeta libera o seguinte.
- As estrelas também têm ordem de conclusão. É preciso concluir a anterior
  para avançar à próxima.
- A interface usa **planeta** e **estrela**, em vez de tema e etapa.
- Múltipla escolha permanece dentro das histórias. Quizzes independentes foram
  retirados: as estrelas contêm histórias ou desafios de código.

## 2. Histórias e storytelling

A história apresenta conceitos no contexto narrativo do Stardust, com o Panda
orientando o aluno e com situações que dão propósito aos exemplos e atividades.
A reformulação será feita por partes: organização dos planetas, storytelling e
conteúdo de cada história. O roteiro completo e a lista definitiva de planetas
precisam ser recuperados ou elaborados em um artefato próprio; não são inferidos
a partir dos nomes ilustrativos usados nos frames.

### Blocos disponíveis

| Bloco | Comportamento |
| --- | --- |
| Texto | Fala, explicação, dica ou aviso |
| Imagem | Ilustração estática, com possibilidade de destaque |
| Animação | Pode ser um Lottie; pode reagir aos eventos de uma atividade |
| Exemplo de código | Delégua de leitura, com execução quando aplicável |
| Exemplo de programação em blocos | Blockly de leitura; pode apresentar apenas a montagem ou permitir execução |
| Questão de múltipla escolha | Escolher uma alternativa e verificar a resposta |
| Questão de programação em blocos | Montar uma solução com Blockly e verificar a resposta |
| Questão de programação em código | Escrever ou completar Delégua, executar e enviar para análise |

### Blocos de texto

- Personagem e tipo pertencem ao mesmo bloco.
- O aluno também é um personagem, com aparência própria.
- O avatar é definido por bloco: o mesmo personagem pode aparecer com
  imagens ou expressões diferentes.
- Não é necessário repetir o nome “Panda” no balão.
- As cores dos blocos comuns são estáveis por personagem/tipo, independentemente
  do planeta atual. A fala do Panda mantém a identidade roxa trabalhada.
- Dicas e avisos mantêm a identificação amarela; blocos informativos podem
  preservar sua identidade azul.

## 3. Layout e progresso da história

- O layout muda conforme o progresso e o bloco em destaque.
- Texto e elemento visual podem ficar lado a lado, alternando os lados quando
  fizer sentido para a composição.
- As falas sempre fazem parte do histórico. Uma imagem ou exemplo em destaque
  não cria uma sequência separada de falas.
- Somente o elemento visual em destaque fica sticky: código, Blockly,
  imagem ou animação. Nenhuma fala fica fixada fora do scroll do histórico.
- O histórico continua rolável, com sombreado no overflow superior.
- O ponto em que um bloco entra ou sai de destaque é determinado pelo conteúdo
  da história. Ao sair de destaque, ele passa a integrar o histórico normal.
- O bloco em destaque pode ter dimensões maiores que sua representação no histórico.
- Mudanças de layout têm animação. A entrada começa em `opacity: 0` e termina
  visível. Essa regra foi decidida; a animação não foi implementada nesta sessão.

Durante uma questão, o histórico lateral deixa de aparecer. O enunciado fica
acima da atividade, como um bloco de texto. Exemplos de leitura e questões são
estados distintos da história.

Ao concluir uma questão, a resposta aprovada pode permanecer no histórico
para consulta, sem nova edição ou nova tentativa nesse estado de revisão.

## 4. Questões, avaliação e vidas

### Múltipla escolha

- Permanece para interpretação e compreensão de conceitos.
- O enunciado pode incluir código de leitura.
- Alternativas não usam letras como A, B ou C.
- Seleção ainda não avaliada tem marcação azul.
- Acerto e erro têm estados visuais próprios.
- Ao errar, o aluno tenta novamente até acertar, enquanto tiver vidas.

### Programação em blocos — Blockly

- Cada questão disponibiliza somente os blocos escolhidos pelo autor.
- O banco de blocos usa a aparência real dos blocos, em vez de apenas uma lista
  genérica de comandos.
- A aba **Blocos** apresenta a montagem; **Código** mostra o Delégua gerado
  em modo de leitura, sem cadeado na aba.
- Não há edição bidirecional entre Delégua e Blockly definida nesta proposta.
- Blockly pode aparecer como exemplo de leitura ou como questão.

| Modalidade | Avaliação | Ações |
| --- | --- | --- |
| Questão de execução | Resultado da execução, de forma determinística | Executar e Verificar resposta |
| Questão de montagem | Estrutura e organização da montagem, de forma determinística | Verificar resposta |
| Exemplo executável | Sem avaliação de resposta | Executar |
| Exemplo de montagem | Sem avaliação de resposta | Leitura da montagem e do código gerado |

- **Jev não participa da avaliação de Blockly.**
- Os critérios da proposta anterior foram retirados da UI de Blockly.
- Uma aba separada de resultado da avaliação não é necessária nessa proposta.
  O feedback pertence ao estado da atividade; saída do programa é outra coisa.
- O terminal segue a aparência atual do Stardust: seção “Saída”, recolhível,
  integrada ao editor.
- A aceitação de uma montagem única ou de montagens equivalentes depende da
  questão. A restrição do banco de blocos simplifica essa decisão, mas não
  demonstra que toda questão deve exigir uma única montagem.

### Escrita de código nas histórias

- O aluno também escreve código durante a história, em atividades menores e
  guiadas, antes de enfrentar os desafios.
- A atividade pode pedir escrita do zero ou complementação de um trecho.
- Deve ser possível executar o código e depois enviá-lo para análise.
- Código e contexto da execução ajudam o Jev a avaliar a resposta.
- A proposta convergiu para código executável antes da análise; a antiga regra
  de aceitar erros de sintaxe que impedem a execução foi abandonada.
- O editor fica congelado durante a análise do Jev.
- Todos os requisitos precisam ser cumpridos para avançar.
- Requisitos e seus estados de acerto/erro ficam visíveis. No frame trabalhado,
  essa seção ocupa o lado esquerdo e substitui a imagem da atividade.

### Vidas e novas tentativas

- O aluno começa a história com **10 vidas**.
- Uma resposta errada custa uma vida.
- Executar para experimentar não equivale a enviar uma resposta errada.
- O aluno pode tentar novamente até responder corretamente.
- Ao perder todas as vidas, reinicia a história inteira, com 10 vidas;
  não apenas a questão em que parou.

## 5. Desafios de código

- São estrelas próprias da trilha.
- Contêm somente escrita de código; Blockly não foi incluído nos desafios.
- Mantêm a avaliação atual por testes. A inclusão do Jev foi retirada por enquanto.
- A escrita de código dentro da história funciona como prática guiada;
  o desafio exige uma solução mais independente.
- O playback estático atual não motivou substituir os desafios por Blockly.

## 6. Cenas e animações

- A direção escolhida foi **cenas por evento**: a apresentação visual pode
  reagir aos acontecimentos da atividade.
- Imagens estáticas por estado e Lotties são possibilidades para esses blocos.
- Uma questão de Blockly pode interagir com um Lottie.
- Remotion foi discutido, mas não ficou adotado como dependência ou requisito.
- O catálogo é persistido remotamente. Contrato dos eventos, configuração das
  cenas e estratégia de armazenamento ainda precisam de desenho técnico.
- Nesta sessão, os desenhos de estrelas representam quadros estáticos dos
  assets; não reproduzem o Lottie em execução dentro do canvas.

## 7. XP, StarCoins e página de resultado

- XP e StarCoins são recompensas de conclusão, configuradas para a história.
- A recompensa é concedida uma vez; revisar uma história concluída não gera
  nova recompensa.
- Erros afetam as vidas, sem desconto adicional das recompensas nessa proposta.
- Os valores **60 XP** e **20 StarCoins** usados nos desenhos são exemplos,
  não uma fórmula geral de pontuação.
- O resultado destaca “História concluída!” e as recompensas.
- Não foram acrescentadas métricas de tempo ou precisão ao resultado.
- A ação principal retorna ao **Espaço**, em vez de abrir diretamente a
  próxima estrela. A revisão da história é uma ação secundária.
- Quando houver uma celebração de streak, o fluxo passa por recompensas,
  “Continuar”, celebração de streak e retorno ao Espaço.
- A celebração existente de nível permanece uma possibilidade do fluxo atual.
- A visualização de streak no resultado é semanal; a visualização mensal do
  perfil tem outro contexto. A refatoração desta sessão ficou no resultado.

## 8. Página Espaço

- Planetas representam temas; estrelas numeradas representam o progresso.
- A trilha entre as estrelas é **pontilhada**: trecho desbloqueado amarelo e
  trecho bloqueado cinza.
- A estrela desbloqueada preserva o asset `unlocked-star` do aplicativo.
- A estrela bloqueada preserva o desenho atual, que na codebase é um SVG,
  não um segundo Lottie.
- O planeta bloqueado mantém a ilustração com opacidade reduzida; no frame
  atual foi usada **35%**, substituindo o círculo com cadeado.
- Rótulos das estrelas distinguem tipo e estado com ícones e hierarquia de texto:
  concluída em verde, disponível em amarelo e bloqueada com aparência discreta.
- No desktop, os detalhes das estrelas disponíveis e concluídas aparecem ao
  lado ao passar o mouse; foco por teclado deve oferecer acesso equivalente.
- Estrelas concluídas permitem revisão. Estrelas bloqueadas continuam sem
  navegação, com a condição de desbloqueio indicada no mapa.
- A entrada no Espaço e o FAB têm como referência a primeira estrela ainda
  não concluída, enquanto existir conteúdo a concluir.
- Falha de carregamento apresenta mensagem com “Tentar novamente” e não deve
  ser confundida com uma trilha sem conteúdo.
- O reposicionamento usa o FAB existente, com seta para cima; o botão adicional
  “Minha posição” foi removido.
- A sidebar atual foi transformada em componente reutilizável.
- Ícones de navegação inativos continuam claros e legíveis; somente o item
  ativo recebe fundo verde.

### Mobile — referência canônica

O usuário definiu `jIgbf` como versão canônica mobile, de 390 × 844.
O toque na estrela apresenta os detalhes em um painel inferior. A sidebar
é acessada pelo menu no header e a trilha permanece pontilhada.
`iqvkE` registra o mapa sem o painel aberto. A alternativa `FlYnP`, com detalhes
abaixo da estrela no mapa, foi desenhada para avaliação e descartada em favor
de `jIgbf`.

## 9. Sistema visual

- Os componentes criados usam os tokens canônicos do projeto, conforme
  `documentation/design.md`.
- Poppins é a fonte da interface; Roboto Mono é a referência para código.
- Cores de sintaxe seguem os tokens Monaco trabalhados.
- Cores narrativas e das categorias de Blockly preservam suas identidades;
  não são substituídas automaticamente pela cor do planeta.
- Cores originais de ilustrações e assets são preservadas.
- As ações do editor ficam no header do container da atividade.
- O ajuste final solicitado para os controles de header foi altura de 32;
  pedidos anteriores de 24 precisam ser reconciliados por componente na Spec.

## 10. Inventário dos desenhos da sessão

IDs registrados durante a sessão no canvas `design/stardust.pen`.
O canvas ativo estava em outro projeto no momento desta consolidação;
este inventário não afirma uma nova inspeção dos frames em 2026-10-11.
Alguns IDs citados inicialmente na conversa mudaram após a transferência
do desenho; a tabela usa os IDs registrados no arquivo Stardust.

| Referência | Node ID | Estado |
| --- | --- | --- |
| História com texto e imagem | `fglWW` | Referência desenhada |
| História com código em destaque | `NZaJd` | Referência desenhada |
| Questão de Blockly | `m5G9I` | Referência desenhada |
| Blockly com acertos e erros | `oZyQS` | Ajustado após a retirada dos critérios |
| Blockly com aba Código ativa | `sWPk3` | Referência desenhada |
| Exemplo Blockly de leitura em destaque | `W9JlW` | Referência desenhada |
| Banco de blocos e categorias | `YYidd` | Catálogo desenhado |
| Questão de escrita de código | `GV68P` | Referência desenhada |
| Escrita de código com acertos e erros | `mty3Q` | Referência desenhada |
| Múltipla escolha — resposta correta | `L4ZLNb` | Com código no enunciado |
| Múltipla escolha — seleção neutra | `n4OPA` | Seleção azul |
| Múltipla escolha — resposta errada | `TADST` | Referência desenhada |
| História com histórico completo | `HDJcy` | Consulta de exemplos e respostas |
| Resultado da história | `W6mTMv` | Retorno ao Espaço |
| Recompensas antes da celebração de streak | `H0W1KQ` | Ação Continuar |
| Celebração de streak no resultado | `uSana` | Visualização semanal |
| Componente semanal usado no resultado | `dz8qE` | Referência desenhada |
| Sidebar compacta | `h4jv5` | Componente reutilizável |
| Espaço desktop | `kryQ0` | 1440 × 1100 |
| Espaço mobile — mapa | `iqvkE` | Estado sem painel aberto |
| Espaço mobile — estrela selecionada | `jIgbf` | Referência canônica mobile |
| Espaço mobile — detalhes abaixo da estrela | `FlYnP` | Alternativa descartada |

## 11. Pendências para a próxima definição

1. Consolidar a lista final de planetas e os roteiros das histórias,
   começando pelo primeiro planeta; os nomes dos frames não substituem esse trabalho.
2. Incorporar aos PRDs a retirada de quizzes independentes e a divisão por
   modalidades de questão, cada uma com sua versão de leitura; autoria está
   fora do escopo desta entrega.
3. Definir por questão de montagem quais soluções equivalentes são aceitas.
4. Detalhar o contrato de execução e análise de código, incluindo o que ocorre
   quando a execução falha e quando o serviço de análise está indisponível.
5. Definir eventos e configuração das cenas/Lotties no catálogo remoto.
6. Definir persistência de progresso, retomada após saída e reinício ao zerar vidas.
7. Definir valores de recompensas e integração com os fluxos atuais de streak e nível.
8. Especificar as animações de entrada a partir de opacity zero e usar `jIgbf`
   como referência canônica mobile.
9. Reconciliar dimensões finais dos controles e revisar acessibilidade na futura implementação.

O próximo artefato de produto deve incorporar essas decisões aos PRDs afetados;
o planejamento técnico e a implementação dependem de uma Spec própria.
