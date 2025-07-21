# Contribuindo com o projeto

Antes de seguir a diante não se esqueça de conferir primeiro a
[wiki do projeto](https://github.com/JohnPetros/stardust/wiki).

Clone esse repositório na sua máquina.

```bash
git clone https://github.com/JohnPetros/stardust.git
```

Crie uma ramificação (branch) com a funcionalidade/correção de erro que você
quer adicionar

```bash
git checkout -b minha-funcionalidade
```

Realize os commits seguindo o padrão utilizado no projeto e abra uma Pull
Request da sua cópia para o repositório oficial.

```bash
git push origin minha-feature
```

> Nunca de fazer a sua contribuição sempre com testes automatizados 😙

## Commits

No contexto de sistemas de controle de versão, como o Git, um commit é o ato de
registrar um conjunto de alterações no histórico do projeto. Pense nele como um
"ponto de salvamento" ou uma "fotografia" do seu trabalho em um determinado
momento. Cada commit representa uma mudança específica ou um conjunto de
mudanças relacionadas que você deseja preservar. Ele é a unidade fundamental do
histórico de um repositório Git.

Inspirado no
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), cada
commit é escrito em inglês e composto por três partes:

- prefixo: indentifica o tipo de commit e é sempre acompanhado por seu emoji
  respectivo.
- escopo (opcional): indica qual pacote ou aplicação esse commit é relacionado.
- corpo: uma mensagem concisa que diz o que esse commit altera

Exemplos:

1. Com escopo `🐛 fix(server): ensure only one achievement is unlocked at once`

2. Sem escopo `📑 interface: add AchievementsRepository`

- commits relacionados a use cases e testes, o corpo da mensagem não precisa
  começar por um verbo

Exemplos:

- ✨ use case: list all challenges
- ✨ use case: verify user name in use
- 🧪 test: list all challenges use case
- 🧪 test: useChallengePage hook

### Tabela de commits

| Tipo de commit                  | Prefixo   | Emoji |
| :------------------------------ | :-------- | :---- |
| Camada de domínio               | domain    | 🌐    |
| Camada de API REST              | rest      | 📶    |
| Camada de UI                    | ui        | 🖥️    |
| Camada de banco de dados        | db        | 💾    |
| Camada de fila/mensageria       | queue     | 🎞️    |
| Camada de provisão              | provision | 🧰    |
| Camada de BFF                   | server    | 📟    |
| Use cases                       | use case  | ✨    |
| Interfaces                      | interface | 📑    |
| Tipagem                         | type      | 🏷️    |
| Documentação                    | docs      | 📚    |
| Correção de bug                 | fix       | 🐛    |
| Refatoração de código           | refactor  | ♻️    |
| Teste automatizado              | test      | 🧪    |
| Configuração/infraestrutura     | config    | ⚙️    |
| Constantes                      | constants | 🪨    |
| Dependências                    | deps      | 📦    |
| Arquivos estáticos              | assets    | 🎴    |
| Merge de branches               | merge     | 🔀    |
| Reset de histórico de commits   | revert    | ⏪    |
| Estruturação de pastas/arquivos | ftree     | 🗃️    |
| Certificados e licenças         | cert      | 📜    |
| Trabalho em andamento           | wip       | 🚧    |
| Conserto de erro de emergencia  | hotfix    | 🚑    |
| Entrega contínua                | cd        | 🚚    |
| Integração contínua             | ci        | 🏎️    |
| Nova release                    | release   | 🔖    |
| Containers Docker               | docker    | 🐳    |

## Issues

No GitHub, uma Issue (ou "questão", em tradução livre) é uma forma padronizada e
eficiente de rastrear tarefas, bugs, melhorias e discussões relacionadas a um
projeto de software. Uma issue serve como um item em uma lista de afazeres
colaborativa para o repositório.

Nesse sentido, uma issue pode ser criada para:

- Identificar um bug: O código não está funcionando como esperado em determinada
  situação.
- Sugerir uma nova funcionalidade: Você tem uma ideia para adicionar algo útil
  ao projeto.
- Pedir uma melhoria: Algo já existe, mas poderia ser mais eficiente ou fácil de
  usar.
- Fazer uma pergunta: Você tem uma dúvida sobre o funcionamento de uma parte do
  código.
- Discutir um tópico: É preciso conversar com a equipe sobre uma decisão de
  design ou arquitetura.

### Issue de task

Geralmente, são itens de trabalho que contribuem para o progresso do projeto,
podendo ser uma nova funcionalidade ou melhoria/refatoração.

A descrição de uma issue de task deve conter as seções:

#### 📍 Motivação

Este é o ponto de partida da sua Issue, o "porquê" dela existir. Aqui você deve
descrever claramente o problema que está sendo resolvido ou a oportunidade que
está sendo aproveitada. Explique o cenário atual, os impactos negativos que ele
causa (se for um bug ou uma falha) ou os benefícios que serão gerados com a
implementação (se for uma nova funcionalidade ou melhoria). O objetivo é
garantir que todos que leiam a Issue compreendam sua relevância e o valor do
trabalho a ser realizado, estabelecendo o propósito antes de mergulhar nos
detalhes técnicos.

#### 🔍 Detalhes (opcional)

Este título serve para adicionar qualquer informação extra e contextual que seja
relevante e ajude a esclarecer a Issue. Pense em tudo que complementa a
motivação e a sugestão de implementação, mas que não se encaixa perfeitamente
nas seções anteriores. Isso pode incluir links para documentações, logs de erro,
capturas de tela, exemplos específicos, dados de testes, ou qualquer outro
recurso que forneça clareza adicional. O objetivo é munir a pessoa que for
trabalhar na Issue com todas as informações necessárias para iniciar o trabalho
sem dúvidas, evitando idas e vindas desnecessárias.

#### 💡 Sugestão de Implementação

Nesta seção, o foco é o "como". Trata-se de uma proposta de solução para a
motivação apresentada. Aqui, você pode detalhar os passos técnicos ou lógicos
sugeridos para resolver o problema ou implementar a funcionalidade. Mencione os
componentes do sistema que serão afetados, descreva um fluxo de trabalho
esperado ou sugira abordagens. A ideia não é engessar a solução, mas sim
oferecer um ponto de partida claro para o desenvolvimento e para as discussões
da equipe, reduzindo a ambiguidade e agilizando o processo.

### Issue de bug

Uma Issue de Bug é usada para reportar e rastrear um problema ou defeito no
software, onde o sistema se comporta de uma maneira diferente da esperada. O
objetivo é descrever o erro de forma clara para que ele possa ser diagnosticado,
reproduzido e corrigido pela equipe de desenvolvimento.

#### ✖️ Comportamento atual

Nesta seção, você descreve exatamente o que está acontecendo de errado. Seja o
mais preciso possível, detalhando o comportamento inesperado que o sistema
apresenta. Inclua mensagens de erro, resultados incorretos ou qualquer anomalia
observada. O foco é documentar o estado do sistema quando o bug ocorre.

#### ☑️ Comportamento esperado

Aqui, você explica como o sistema deveria se comportar. Descreva a
funcionalidade correta e o resultado que você esperava ver. Isso ajuda a
contrastar o que está acontecendo com o que deveria acontecer, deixando claro o
objetivo da correção.

#### 📃 Como reproduzir (opcional)

Esta é uma seção crucial para o desenvolvedor. Descreva um passo a passo
detalhado de como a equipe pode replicar o bug. Inclua cada clique, cada dado
inserido e a ordem exata das ações. Quanto mais fácil for reproduzir o bug, mais
rápido ele poderá ser investigado e corrigido. Se for difícil de reproduzir
consistentemente, mencione isso.

#### 🎋 Ambiente (opcional)

Forneça informações sobre o ambiente onde o bug foi encontrado. Isso pode
incluir o sistema operacional (Windows, macOS, Linux), o navegador (Chrome,
Firefox, Safari) e sua versão, a versão do aplicativo, dispositivos específicos,
ou qualquer configuração relevante. Dados do ambiente ajudam a identificar se o
bug é isolado ou generalizado.

#### 👀 Observação (opcional)

Use esta seção para adicionar qualquer informação extra ou contexto que possa
ser útil, mas que não se encaixou nas categorias anteriores. Isso pode incluir
screenshots, vídeos do problema, links para logs de erro, informações sobre
tentativas de solução, ou notas adicionais que podem ajudar na compreensão do
bug.

## Pull requests

Um pull request é uma proposta para integrar (ou "puxar") mudanças de uma branch
para outra, geralmente da sua ramificação de funcionalidade (onde você trabalhou
nas suas alterações) para a ramificação principal do projeto (main).

A descrição de um pull request deve conter as seções:

- 🎯 Objetivo: explica claramente o propósito principal do PR. É a resposta à
  pergunta "Por que este PR existe?".
- #️⃣ Issues relacionadas (opcional): Aqui, o desenvolvedor conecta o PR a uma ou
  mais issues (tarefas ou bugs). Use termos como resolve, closes, fixes
  (seguidos do número da issue) ára fechar a issue automaticamente
- 🐛 Causa do bug (opcional): detalha a razão fundamental pela qual o bug
  existia. É uma explicação técnica da raiz do problema.
- 📋 Changelog: lista as modificações específicas e pontuais realizadas no
  código para atingir o objetivo do PR. É um resumo das ações tomadas. Não
  precisa ser todas, mas as principais
- 🧪 Como testar (opcional): fornece instruções claras e detalhadas sobre como
  os revisores (ou qualquer pessoa que precise validar as mudanças) podem
  reproduzir o cenário e verificar se as alterações funcionam como esperado e se
  o bug foi realmente resolvido. É essencialmente um guia passo a passo para
  testar o que foi implementado.
- 👀 Observações: para informações adicionais, contextos ou avisos que o
  desenvolvedor considera relevantes para o revisor. Pode incluir limitações
  conhecidas, decisões de design, ou como no exemplo, a identificação de um novo
  problema.

> Veja os
> [PR's já criadas no projeto](https://github.com/JohnPetros/stardust/pulls)
> como um exemplo.

> O emojis nos títulos das seções não são obrigatórios, mas é sempre legal
> enfeitar 😙.

## Releases

Uma release é uma versão específica de um software ou produto que é
disponibilizada para uso, seja para usuários finais, clientes, para teste
interno ou para a próxima fase de desenvolvimento.

A equipe StarDust segue o [Semantic Versioning](https://semver.org/) para
nomeação das versões, que é um sistema que usa três números (MAIOR.MENOR.PATCH)
para indicar, de forma clara e padronizada, se uma nova release contém mudanças
que quebram a compatibilidade, novas funcionalidades ou apenas correções de
bugs, respectivamente.

Exemplos:

v1.0.0 -> uma grande refatoração que torna incompativel com versões anteriores
v0.1.0 -> nova funcionalidade v0.0.1 -> correção de bug

As releases são criada de forma programática utilizando a ferramenta
**[release it](https://github.com/release-it/release-it)**
