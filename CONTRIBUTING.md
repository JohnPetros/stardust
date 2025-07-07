# Contribuindo com o projeto

Antes de seguir a diante não se esqueça de conferir primeiro a [wiki do projeto](https://github.com/JohnPetros/stardust/wiki).

Clone esse repositório na sua máquina.

```bash
git clone https://github.com/JohnPetros/stardust.git
```

Crie uma ramificação (branch) com a funcionalidade/correção de erro que você quer adicionar

```bash
git checkout -b minha-funcionalidade
```

Realize os commits seguindo o padrão utilizado no projeto e abra uma Pull Request da sua cópia para o repositório oficial.

```bash
git push origin minha-feature
```

> Nunca de fazer a sua contribuição sempre com testes automatizados 😙

## Commits

No contexto de sistemas de controle de versão, como o Git, um commit é o ato de registrar um conjunto de alterações no histórico do projeto. Pense nele como um "ponto de salvamento" ou uma "fotografia" do seu trabalho em um determinado momento. Cada commit representa uma mudança específica ou um conjunto de mudanças relacionadas que você deseja preservar. Ele é a unidade fundamental do histórico de um repositório Git.

Inspirado no [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), cada commit é escrito em inglês e composto por três partes:
- prefixo: indentifica o tipo de commit e é sempre acompanhado por seu emoji respectivo.
- escopo (opcional): indica qual pacote ou aplicação esse commit é relacionado.
- corpo: uma mensagem concisa que diz o que esse commit altera

Exemplos:

1. Com escopo
`🐛 fix(server): ensure only one achievement is unlocked at once`

2. Sem escopo
`📑 interface: add AchievementsRepository`

* commits relacionados a use cases e testes, o corpo da mensagem não precisa começar por um verbo

Exemplos:

- ✨ use case: list all challenges
- ✨ use case: verify user name in use
- 🧪 test: list all challenges use case
- 🧪 test: useChallengePage hook

### Tabela de commits

| Tipo de commit                   | Prefixo   | Emoji |
| :------------------------------- | :-------- | :---- |
| Camada de domínio                | domain    | 🌐    |
| Camada de API REST               | rest      | 📶    |
| Camada de UI                     | ui        | 🖥️    |
| Camada de banco de dados         | db        | 💾    |
| Camada de fila/mensageria        | queue     | 🎞️    |
| Camada de provisão               | provision | 🧰    |
| Camada de BFF                    | server    | 📟    |
| Use cases                        | use case  | ✨    |
| Interfaces                       | interface | 📑    |
| Tipagem                          | type      | 🏷️    |
| Documentação                     | docs      | 📚    |
| Correção de bug                  | fix       | 🐛    |
| Refatoração de código            | refactor  | ♻️    |
| Teste automatizado               | test      | 🧪    |
| Configuração/infraestrutura      | config    | ⚙️    |
| Dependências                     | deps      | 📦    |
| Arquivos estáticos               | assets    | 🎴    |
| Merge de branches                | merge     | 🔀    |
| Reset de histórico de commits    | revert    | ⏪    |
| Estruturação de pastas/arquivos  | ftree     | 🗃️    |
| Certificados e licenças          | cert      | 📜    |
| Trabalho em andamento            | wip       | 🚧    |
| Conserto de erro de emergencia   | hotfix    | 🚑    |
| Entrega contínua                 | cd        | 🚚    |
| Integração contínua              | ci        | 🏎️    |
| Nova release                     | release   | 🔖    |
| Containers Docker                | docker    | 🐳    |

## Pull requests

Um pull request é uma proposta para integrar (ou "puxar") mudanças de uma branch para outra, geralmente da sua ramificação de funcionalidade (onde você trabalhou nas suas alterações) para a ramificação principal do projeto (main).

A descrição de um pull request deve conter as seções:

- 🎯 Objetivo: explica claramente o propósito principal do PR. É a resposta à pergunta "Por que este PR existe?".
- #️⃣ Issues relacionadas (opcional): Aqui, o desenvolvedor conecta o PR a uma ou mais issues (tarefas ou bugs). Use termos como resolve, closes, fixes (seguidos do número da issue) ára fechar a issue automaticamente
- 🐛 Causa do bug (opcional): detalha a razão fundamental pela qual o bug existia. É uma explicação técnica da raiz do problema.
- 📋 Changelog: lista as modificações específicas e pontuais realizadas no código para atingir o objetivo do PR. É um resumo das ações tomadas. Não precisa ser todas, mas as principais
- 🧪 Como testar (opcional): fornece instruções claras e detalhadas sobre como os revisores (ou qualquer pessoa que precise validar as mudanças) podem reproduzir o cenário e verificar se as alterações funcionam como esperado e se o bug foi realmente resolvido. É essencialmente um guia passo a passo para testar o que foi implementado.
- 👀 Observações: para informações adicionais, contextos ou avisos que o desenvolvedor considera relevantes para o revisor. Pode incluir limitações conhecidas, decisões de design, ou como no exemplo, a identificação de um novo problema.

> Veja os [PR's já criadas no projeto](https://github.com/JohnPetros/stardust/pulls) como um exemplo.

> O emojis nos títulos das seções não são obrigatórios, mas é sempre legal enfeitar 😙.

## Releases

Uma release é uma versão específica de um software ou produto que é disponibilizada para uso, seja para usuários finais, clientes, para teste interno ou para a próxima fase de desenvolvimento. 

A equipe StarDust segue o [Semantic Versioning](https://semver.org/) para nomeação das versões, que é um sistema que usa três números (MAIOR.MENOR.PATCH) para indicar, de forma clara e padronizada, se uma nova release contém mudanças que quebram a compatibilidade, novas funcionalidades ou apenas correções de bugs, respectivamente.

Exemplos:

v1.0.0 -> uma grande refatoração que torna incompativel com versões anteriores
v0.1.0 -> nova funcionalidade
v0.0.1 -> correção de bug

As releases são criada de forma programática utilizando a ferramenta **[release it](https://github.com/release-it/release-it)**