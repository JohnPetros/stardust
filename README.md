<div align="center">
  <img src="public/images/logo.svg" width="300" heigth="300" />
</div>

<br />

<div align="center">
   <a href="https://github.com/JohnPetros">
      <img alt="Made by JohnPetros" src="https://img.shields.io/badge/made%20by-JohnPetros-blueviolet">
   </a>
   <img alt="GitHub Language Count" src="https://img.shields.io/github/languages/count/JohnPetros/stardust">
   <a href="https://github.com/JohnPetros/stardust/commits/main">
      <img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/JohnPetros/stardust">
   </a>
  </a>
   </a>
   <a href="https://github.com/JohnPetros/stardust/blob/main/LICENSE.md">
      <img alt="GitHub License" src="https://img.shields.io/github/license/JohnPetros/stardust">
   </a>
    <img alt="Stargazers" src="https://img.shields.io/github/stars/JohnPetros/stardust?style=social">
</div>
<br>

## 🖥️ Sobre o Projeto

**Stardust** é uma **aplicação educativa** focada em ensinar lógica de programação utilizando o conceito de [gamificação](https://www.ludospro.com.br/blog/o-que-e-gamificacao), isto é, utilizar elementos normalmente presentes em jogos para alcançar objetivos que vão além de um contexto de um simples jogo, como, por exemplo, a educação nesse caso específico.

Por ser uma solução gamificada, é possível encontrar elementos como obtenção de pontos, desbloqueio de fases, desafios, compra de itens, ranking de usuários e narrativa envolvente.

O objetivo ao realizar esse projeto foi concluir o **TCC** do curso técnico em **Desenvolvimento de Sistemas** da [ETEC de São José dos Campos](https://www.etecsjcampos.com.br/), a qual eu agradeço por ter me instigado a aprender cada mais e me tornar um desenvolvedor melhor.


### ⏹️ Demonstração

<table align="center">
  <tr>
    <td align="center" width="700">
    <span>Landing page<br/></span>
    <img alt="Home page" src=".github/images/home.png" alt="Demonstração da landing page" />
    </td>
  </tr>
</table>

---

## ✨ Principais Funcionalidades

### Lição

- [x] O usuário deve seguir uma trilha organizada em módulos, em que cada módulo corresponde um tema dentro de lógica de programação
- [x] Cada módulo deve ser composto por lições, sendo que cada uma deve corresponder um assunto específico dentro do tema do seu respectivo módulo
- [x] Cada módulo deve possuir pelo menos 2 lições e um desafio de algoritmo no final
- [x] Cada lição é bloqueada por padrão, sendo que para desbloquear uma o usuário deve completar a anterior 
- [x] Cada lição deve possuir Três fases, sendo:
    - Teoria sobre o conceito a ser estudado
    - Quiz sobre a teoria passada
    - Resultado que exibe os pontos obtidos a partir do Quiz (XP e Moedas)


### Desafio de código

- [x] O desafio de código deve possuir uma apresentação do problema, contendo contexto, objetivo e exemplos de entrada e saída.
- [x] O desafio de código deve possuir um editor de código para o usuário digitar sua solução para o problema proposto
- [x] O desafio de código deve possuir testes de caso, cada uma contendo uma entrada e uma saída para testar a solução do usuário
- [x] Se o usuário conseguir resolver o desafio ele deve receber a quantidade de XP e Moedas de acordo com o nível de dificuldade do desafio.

### Seleção de desafio de código a avulso

- [x] O usuário deve poder escolher um desafio de código avulso, ou seja, um desafio que não faz parta da trilha principal, a partir de uma lista de desafios
- [x] Cada desafio de código deve possuir um nível de dificuldade, sendo `fácil`, `médio` ou `difícil`
- [x] Cada desafio de código deve se enquadrar em uma ou mais categorias, sendo que cada categoria é relacionado a um módulo da trilha principal
- [x] O usuário deve poder filtrar, de forma simultaneamente ou não, os desafios de código por nível de dificuldade, nome ou uma ou mais categorias

### Loja de itens

- [x] Deve haver uma loja contendo itens de foguetes e avatares
- [x] Cada item da loja deve apresentar:
  - Nome
  - Imagem
  - Preço
  - Botão de compra
- [x] O usuário só pode comprar apenas quando houver a quantidade necessária de moedas que o determinado item exige
- [x] O item recém-comprado deve ser configurado como selecionado automaticamente no perfil do usuário
- [x] Caso o item já tenha sido adquirido pelo usuário, o botão de compra se transformará em um botão para selecionar o item em questão

### Ranking de usuários

- [x] Os usuários devem ser divididos em 6 rankings diferentes
- [x] Cada ranking deve conter uma lista de usuários ordenados de forma decrescente de acordo com a quantidade de XP de cada um
- [x] Todo domingo às 23:59, os 5 melhores usuários de cada ranking deverão ir para o próximo ranking, enquanto os 5 piores usuários deverão ir para o ranking anterior
- [x] No momento de mudança de ranking os melhores usuários de cada ranking deverão ganhar um recompesa de moedas e XP, cuja quantidades deverão ser conforme a posição alcançada pelo usuário e o grau de prestígio do ranking anterior ao recém adquirido

### Perfil de usuário

- [x] Cada usuário deve possuir um perfil que exiba:
  - Nome
  - E-mail
  - Avatar atual
  - Data de criação de perfil
  - Ranking atual
  - Foguete atualmente usado
- [x] Deve ser exibido um gráfico que indique a quantidade de desafios concluídos pelo usuário de acordo com o nível de dificuldade de cada desafio
- [x] Deve ser exibido uma tabela que exida os desafios, snippets de código e soluções de código criados por ele juntamente com a respectiva data de criação e link para acessar o recurso em questão

### Snippets de código

- [x] O usuário deve poder escrever um trecho de código em um editor de forma despretenciosa
- [x] O usuário deve poder escolher salvar ou não esse código no seu perfil
- [x] O usuário deve poder deletar e editar os snippets de código salvos por ele
- [x] O usuário deve poder escolher deixar a visibilidade do seu snippet pública (Qualquer usuário poder acessar por um link) ou privada.

---

## ⚙️ Arquitetura

## 🛠️ Tecnologias, ferramentas e serviços externos

Este projeto foi desenvolvido usando as seguintes tecnologias:

- **[NextJs](https://nextjs.org/)** para desevoler o frontend, bem como funcionalidades que dependam ser executados no lado servidor

- **[Subabase](https://supabase.com/)** para servir como backend da aplicação, incluido serviço de autenticação, banco de dados [PostgreSQL](https://www.postgresql.org/) e [API Rest](https://www.redhat.com/pt-br/topics/api/what-is-a-rest-api)

- **[Resend](https://resend.com/)** para permitir o envio de e-mails

- **[React Email](https://react.email/)** para construir templates de e-mail utilizando [React](https://react.dev/)

- **[Framer Motion](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)** para realizar animações utilizando React 

- **[Radix UI](https://www.radix-ui.com/)** para construir componentes reacts que exijam recursos de acessibilidade

- **[TailwindCSS](https://tailwindcss.com/)** para estilizar as páginas e componentes HTML

- **[DnD Kit](https://dndkit.com/)** para fazer a funcionalidade de [Drag and Drop](https://appmaster.io/pt/blog/o-que-e-realmente-o-drag-and-drop-e-como-e-que-o-ajuda-a-obter-o-software-personalizado-que-deseja)


> Para mais detalhes acerca das dependências do projeto, como versões específicas, veja o arquivo [package.json](https://github.com/JohnPetros/stardust/blob/main/package.json)

---

## 🚀 Como rodar a aplicação?

### 🔧 Pré-requisitos

Antes de baixar o projeto você necessecitará ter instalado na sua máquina as seguintes ferramentas:

- [Git](https://git-scm.com/) para manilupar repostitórios Git
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/pt/) para instalar as dependências (eu usarei o pnpm).

> Além disso, é bom ter um editor para trabalhar com o código, como o [VSCode](https://code.visualstudio.com/)

> Além disso, é crucial configurar as variáveis de ambiente em um arquivo chamado `.env` antes de executar a aplicação. veja o arquivo [.env.example](https://github.com/JohnPetros/stardust/blob/main/.env.example) para ver quais variáveis devem ser configuradas

### 📟 Rodando a aplicação

```bash

# Clone este repositório
$ git clone https://github.com/JohnPetros/stardust.git

# Acesse a pasta do projeto
$ cd stardust

# instale as dependências do projeto
$ pnpm install

# rode a aplicação no modo de desenvolvimento
$ pnpm dev

```

> Acesse http://localhost:3000/ para ver a aplicação funcionando

### 🧪 Rodando os testes

```bash
# Execute os testes
$ pnpm test
```

---

## 💪 Como contribuir

```bash

# Fork este repositório
$ git clone https://github.com/JohnPetros/stardust.git

# Cria uma branch com a sua feature
$ git checkout -b minha-feature

# Commit suas mudanças:
$ git commit -m '✨ feat: Minha feature'

# Push sua branch:
$ git push origin minha-feature

```

> Você deve substituir 'minha-feature' pelo nome da feature que você está adicionando

> Veja o arquivo de tabela de emoji de commits para garantir a consistência entre as mensagens

> Você também pode abrir um [nova issue](https://github.com/JohnPetros/stardust/issues) a respeito de algum problema, dúvida ou sugestão para o projeto. Ficarei feliz em poder ajudar, assim como melhorar este projeto

---

## 📝 Licença

Esta aplicação está sob licença do MIT. Consulte o [Arquivo de licença](LICENSE) para obter mais detalhes sobre.

---

<p align="center">
  Feito com 💜 por John Petros 👋🏻
</p>
