# Arquitetura Modular

Arquitetura modular é um estilo de design de software no qual o sistema é dividido em unidades independentes chamadas **módulos**. Cada módulo encapsula uma parte específica da lógica do sistema e pode ser desenvolvido, testado, mantido e evoluído de forma isolada, promovendo organização, escalabilidade e reuso.

No caso do StarDust, o sistema é dividido em **nove módulos de domínio**, além de um módulo especial chamado `global`.

## Módulo Global

Todos os módulos são independentes entre si, com exceção do módulo `global`, que centraliza **interfaces, componentes e recursos compartilhados** pelos demais. Em outros projetos, esse tipo de módulo costuma ser chamado de `shared`. No entanto, para manter o padrão de nomeação por substantivos, optou-se por nomeá-lo como `global`.

## Módulo de Autenticação (`auth`)

Responsável por lidar com a **autenticação e autorização** dos usuários no sistema. Ele garante que apenas usuários válidos possam acessar os recursos da plataforma, gerenciando tokens, permissões e sessões.

## Módulo de Progresso Espacial (`space`)

Responsável por **gerenciar a jornada do usuário no universo espacial** do StarDust. O espaço é composto por planetas, cada um representando um tema central de lógica de programação. Cada planeta contém estrelas, que por sua vez representam **conceitos específicos** dentro daquele tema.

Cada fase (estrela) do sistema vem bloqueada por padrão, ou seja, não permitindo que o usuário realize as tarefas propostas por ela. Para desbloqueá-la, o usuário deve completar a fase que a antecede.

Uma fase pode ser do tipo lição ou desafio.

Ao completar uma fase, o usuário é livre para repeti-la. Contudo, a quantidade de pontos de experiência a serem ganhos serão menores em comparação quando a uma fase está sendo completada pela primeira vez. Isso se dá porque dessa forma o usuário é impelido a fazer fases recém desbloqueadas, visto que será mais vantajoso completá-las em vez de refazer as que ele já completou

## Módulo de Lição (`lesson`)

Responsável por **gerenciar o conteúdo teórico e os quizzes** das lições. Cada lição é dividida em duas partes:
1. **História**: Parte teórica do conceito apresentada por meio de uma narrativa ficcional.
2. **Quiz**: Um conjunto de perguntas relacionadas ao conceito estudado com o intuito de reforçar o que acabou de ser estudado. O usuário possui até 5 chances para acertar todas as questões corretamente.

Ao final de cada fase, sendo do tipo lição ou de desafio, para que o usuário possa ter sempre o controle do seu rendimento geral e saber se está progredindo ou não será exibido, na etapa final, o desempenho que ele teve durante a realização da parte prática da fase. Nele será informado quantificações, como a quantidade de pontos de experiência e moedas obtidas, o tempo de duração que o usuário levou para completar a parte prática, como também a precisão medida em porcentagem das questões respondidas sem errar “de primeira”. 

## Módulo de Loja (`shop`)

Responsável por **permitir a compra de itens com moedas virtuais (`starcoins`)**. Basicamente, a loja oferece itens cosméticos, que são itens que em um contexto de jogo são itens virtuais que alteram a aparência do personagem do jogador ou de outros elementos do jogo, mas não têm efeito na jogabilidade ou nas habilidades do personagem, ou seja, eles são puramente estéticos e existem apenas para fins decorativos.

Na StarDust os itens cosméticos incluem o foguete pessoal, localizado em diversas partes no sistema, como perfil, barra de progresso e sobretudo como indicador da última estrela (fase) desbloqueada. Além disso, cada usuário possui um avatar, que nada mais é do que a sua representação visual dentro do sistema constituído pela mascote da StarDust com um traje característico.

O usuário tem a possibilidade de escolher qual foguete ou avatar ele quiser, contanto que ele tenha o cosmético disponível para ele dentro do sistema. Dessa maneira, embora os cosméticos não tenham o intuito de oferecer benefícios diretos ao desempenho do usuário, eles permitem que ele tenha um pouco mais de controle sobre a aparência do sistema, de modo que fique mais relacionado com o seu gosto ou personalidade.

Cada item possui um preço baseado no nível de detalhe e raridade, embora esse nível seja subjetivo para os desenvolvedores por enquanto.

## Módulo de Ranqueamento (`ranking`)

Responsável por **manter o sistema de ranqueamento dos usuários**, distribuindo-os em divisões chamadas **tiers**, de acordo com a quantidade de XP obtida na semana atual. Ao final de cada semana:
- Os 5 usuários com mais pontos **sobem de tier**.
- Os 5 com menos pontos **são rebaixados**.

Os melhores colocados recebem recompensas em `starcoins`, cujo valor varia conforme o **nível de prestígio** do tier alcançado.

## Módulo de Perfil (`profile`)

Responsável por **registrar as informações pessoais do usuário e seu progresso em conquistas**. 

No StarDust o uso de conquistas é uma estratégia que usa a atribuição de recompensas simbólicas para incentivar os usuários a realizar determinadas ações ou atingir determinados objetivos dentro do sistema. Essas recompensas são geralmente exibidas em um painel de conquistas que pode ser acessado e visualizado pelo usuário. As tarefas a serem executadas para desbloquear as conquistas podem ser de vários tipos, como concluir uma determinada quantidade de desafios, alcançar uma quantidade específica de xp, streak etc.

Ao desbloquear a conquista, o usuário recebe uma certa quantidade de moedas conforme o nível de dificuldade atribuída a ela. Além disso, cada conquista possui uma medalha única referente ao tipo de ação que o usuário teve que executar para desbloqueá-la.

Além disso, esse módulo mantém o `streak` do usuário é uma palavra, que em inglês pode ser traduzida como "sequência" ou "série". Em geral, ele se refere a uma série contínua de ações ou eventos consecutivos de maneira ininterrupta. Logo, no contexto do StarDust uma `streak` está relacionada à sequência de dias estudados, ou seja, à quantidade de dias em que o usuário completou alguma fase interruptamente. A `streak` serve como uma ferramenta útil para incentivar o usuário a manter um hábito de progredir no seu aprendizado um pouco a cada dia.

## Módulo de Desafio (`challenging`)

Responsável por **oferecer desafios práticos de programação** para que os usuários testem e apliquem seus conhecimentos.

O usuário pode escolher realizar desafios de codificação livres, que nada mais são do que fases do tipo desafio, com mesmo sistema de recompensa com base no nível de dificuldade, só que não conectadas à trilha de aprendizagem, o espaço. O usuário pode filtrar os desafios livres pelo nome, se o usuário já o realizou ou não, nível de dificuldade, e/ou categoria envolvendo tópicos de lógica de programação, como variáveis, funções, dados de tipo texto, número etc. Assim, o usuário tem maior autonomia para praticar exercícios de temas que ele possui maior dificuldade ou interesse.

## Módulo de playground

O usuário pode criar códigos de forma livre em um editor, sem haver a necessidade de resolver um problema específico para, então, ganhar prêmios, assim como acontece em desafios. O editor em questão se comporta como um de desafio normal, porém o usuário poderá visualizar o resultado bruto do seu código executado, diferentemente de como acontece no tipo citado.

Playground em inglês significa área livre destinada para divertimento de crianças, ou seja, o intuito desse editor é possibilitar que usuário brinque com os seus códigos, criando e testando qualquer coisa que ele tenha aprendido ou visto na trilha de aprendizagem ou nos desafios livres, reforçando ainda mais a autonomia e a criatividade do usuário dentro do sistema.

## Módulo de Fórum (`forum`)

Responsável por **fornecer um espaço de interação e discussão entre os usuários**, permitindo comentários relacionados a desafios, perguntas de quiz ou tópicos gerais através de postagens e respostas.

