# Introdução

Stardust é uma aplicação educativa interativa criada com o propósito de ensinar lógica de programação de forma lúdica, acessível e envolvente. Seu principal diferencial está na utilização da [gamificação](https://www.ludospro.com.br/blog/o-que-e-gamificacao) como estratégia pedagógica — ou seja, o uso de elementos e dinâmicas comuns em jogos para promover o engajamento, a motivação e o aprendizado contínuo dos usuários.

A lógica de programação, muitas vezes vista como um assunto técnico e desafiador, é apresentada aqui por meio de mecânicas divertidas que estimulam o raciocínio, a resolução de problemas e o pensamento computacional. Em vez de enfrentar longas explicações teóricas, o usuário aprende enquanto joga, experimenta e se diverte.

Dentro do universo de Stardust, é possível encontrar recursos típicos de jogos, como pontuação, desbloqueio de fases, desafios progressivos, sistema de recompensas, loja de itens, ranking de jogadores e até uma narrativa imersiva que conecta as etapas da jornada de aprendizado. Esses elementos não apenas aumentam a imersão, mas também incentivam o usuário a continuar explorando e evoluindo dentro da plataforma.

O projeto foi idealizado e desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas da [ETEC de São José dos Campos](https://www.etecsjcampos.com.br/). Mais do que uma exigência acadêmica, Stardust nasceu como uma oportunidade de colocar em prática os conhecimentos adquiridos ao longo do curso e, ao mesmo tempo, contribuir com uma ferramenta educativa que pode beneficiar outras pessoas em sua trajetória no mundo da programação.

# História de Desenvolvimento

## Pré-TCC

Antes mesmo da fase de escolha de tema para o TCC, surgiu a inspiração para criar um aplicativo mobile gamificado a partir do reality show para desenvolvedores da Rocketseat, o [Show Me The Code](https://youtube.com/playlist?list=PL85ITvJ7FLoglgoqriHWXK9yE_N0qf4tO&si=8V8r-NwrT7F9PdEM), exibido em 2022. Mais especificamente, a ideia foi influenciada pela proposta do participante [Gabriel Lennon Soares](https://br.linkedin.com/in/gabriellennon/pt?trk=public_post_feed-actor-name), que apresentou um aplicativo para o ensino de Libras com uma dinâmica bastante semelhante ao Duolingo.

## Fase de Escrita do TCC

Na fase de definição do tema, a ideia inicial era seguir com um aplicativo voltado ao ensino de Libras. No entanto, essa proposta foi repensada e substituída por algo mais alinhado à área de tecnologia: o ensino de lógica de programação para iniciantes.

A princípio, o aplicativo teria um visual mais neutro e genérico. Mas, com o objetivo de torná-lo mais atrativo e lúdico, surgiu a ideia de incorporar uma temática espacial, dando origem ao universo de **Stardust**.

Durante a fase de escrita do TCC, que durou cerca de seis meses (_08/07/2022 a 12/12/2022_), foi realizado um estudo teórico aprofundado sobre gamificação: o que é, como funciona, por que e quando aplicá-la, sempre com foco em seu principal objetivo — engajar os usuários. Os principais autores utilizados como referência foram **Yu-Kai Chou**, **Brian Burke** e **Raul Inácio Bussarelo**.

Além da fundamentação teórica, uma das grandes inspirações práticas foi o aplicativo **SoloLearn**, uma plataforma mobile/web voltada para o ensino de diversas linguagens de programação, totalmente em inglês e com abordagem semelhante ao *Stardust*.

## Fase de Desenvolvimento do TCC

A fase de desenvolvimento também durou cerca de seis meses (_12/01/2023 a 06/07/2023_). As tecnologias escolhidas foram:

- **React Native**, por ser a principal ferramenta utilizada na disciplina de aplicativos móveis;
- **JavaScript puro**, como linguagem base para o código;
- **Supabase**, para a criação do backend, visto que a equipe não possui conhecimento suficiente de backend na época.

A fase de desenvolvimento também durou cerca de seis meses (12/01/2023 a 06/07/2023). As tecnologias escolhidas foram:

React Native, por ser a principal ferramenta utilizada na disciplina de aplicativos móveis.

JavaScript puro, como linguagem base para o código.

Supabase, para a criação do backend, visto que nenhum dos integrantes da equipe possuía conhecimento em back-end na época.

Inicialmente, o Stardust não permitiria a escrita ou execução de código. Os usuários apenas responderiam perguntas de múltipla escolha ou leitura. Posteriormente, surgiu a ideia de incluir a possibilidade de executar código diretamente no app, utilizando Portugol, uma linguagem pseudocodificada muito acessível para iniciantes.

No entanto, não foi possível encontrar bibliotecas que interpretassem Portugol integradas ao JavaScript — até que a equipe descobriu o projeto [Delégua](https://www.npmjs.com/package/delegua), uma linguagem interpretada em português, mantida por uma equipe brasileira extremamente competente e ativa no open source. A colaboração com os desenvolvedores do Delégua foi essencial para integrar essa funcionalidade ao aplicativo.

Ao final do desenvolvimento, o APK do Stardust foi gerado e disponibilizado para professores e alunos no dia da apresentação do TCC, por meio de um site próprio.

## Pós-TCC
Após a conclusão do TCC, o projeto ficou parado por alguns meses. Em seguida, foi tomada a decisão de reestruturar completamente o aplicativo, adotando o uso de TypeScript e melhores práticas de arquitetura de software, com o objetivo de torná-lo mais escalável, manutenível e resistente às atualizações constantes do ecossistema JavaScript — que frequentemente quebram compatibilidades em projetos mal estruturados.

A nova fase de desenvolvimento começou pela criação da versão web do Stardust, visando ampliar o alcance da aplicação e facilitar o processo de testes por usuários. A nova versão mobile está prevista para ser desenvolvida e lançada no próximo ano.

# Curiosidades
- O backend do *Stardust* quase foi escrito em **PHP**, mas a ideia foi descartada em favor de tecnologias mais modernas e integradas ao ecossistema JavaScript.
- Durante o **modo história**, há referências a pessoas reais que foram importantes de alguma forma para o desenvolvimento do projeto.
- Os desafios de código são inspirados em questões da plataforma **[Edabit](https://edabit.com/)**, semelhante ao LeetCode, que oferece exercícios de lógica e programação.
- A narrativa do modo história foi inicialmente pensada para ser inspirada no livro **O Guia do Mochileiro das Galáxias**.
- Existe um **easter egg** na tela de escolha de estrelas: se o usuário ficar olhando para a tela por algum tempo, algo especial acontece — mas essa funcionalidade ainda **não foi implementada na versão web** da aplicação.
-A arquitetura do StarDust Pós TCC foi inteiramente reescrito 3 vezes.
