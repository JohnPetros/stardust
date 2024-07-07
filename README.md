<div align="center">
  <img width="350" height="150" src="public/images/logo.svg" alt="StarDustt" />
</div>

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

**Stardust** é uma **aplicação educativa** focada em ensinar lógica de programação utilizando o conceito de [gamificação](https://www.ludospro.com.br/blog/o-que-e-gamificacao), isto é, utilizar elementos normalmente presentes em jogos para alcançar objetivos que vão além de um contexto de um simples jogo, como educar pessoas a respeito de assunto, sendo nesse caso específico a lógica de programação em si.

Por ser uma solução gamificada, é possível encontrar elementos como obtenção de pontos, desbloqueio de fases, desafios, compra de itens, ranking de usuários e narrativa envolvente.

O objetivo ao realizar esse projeto foi concluir o **TCC** do curso técnico em **Desenvolvimento de Sistemas** da [ETEC de São José dos Campos](https://www.etecsjcampos.com.br/), a qual eu agradeço por ter me instigado a aprender cada mais e me tornar um desenvolvedor melhor.

---

## ✨ Principais funcionalidades

### Lição

- [x] O usuário deve seguir uma trilha organizada em módulos, em que cada módulo corresponde um tema dentro de lógica de programação
- [x] Cada módulo deve ser composto por lições, sendo que cada uma deve corresponder um assunto específico dentro do tema do seu respectivo módulo
- [x] Cada módulo deve possuir pelo menos 2 lições e um desafio de algoritmo no final
- [x] Cada lição é bloqueada por padrão, sendo que para desbloquear uma o usuário deve completar a anterior 
- [x] Cada lição deve possuir Três fases, sendo:
    - Teoria sobre o conceito a ser estudado
    - Quiz sobre a teoria passada
    - Resultado que exibe os pontos obtidos a partir do Quiz(XP e Moedas)
- [x] Cada lição deve possuir Três fases, sendo:
    - Teoria sobre o conceito a ser estudado
    - Quiz sobre a teoria passada
    - Resultado que exibe os pontos obtidos a partir do Quiz (XP e Moedas)

### Desafio de código

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

---

## ⚙️ Arquitetura

## 🛠️ Tecnologias, ferramentas e serviços externos

Este projeto foi desenvolvido usando as seguintes tecnologias:


- **[Next.js](https://nextjs.org/)** para fornecer um servidor para as funcionalidades que precisam rodar server side e recursos extras que são comuns em aplicações web hoje, como caching, roteamento dinâmico e pré-processamento de dados

- **[React](https://pt-br.legacy.reactjs.org/)** para criar interfaces interativas

- **[TailwindCSS](https://tailwindcss.com/)** para estilização das interfaces

- **[Framer Motion](https://tailwindcss.com/)** para fazer as animações

- **[Radix UI](https://www.radix-ui.com/)** para construir componentes reacts que exijam recursos de acessibilidade

- **[Supabase](https://supabase.com/)** para prover funcionalidades comuns em aplicações backend, como serviço de autenticação, banco de dados (PostgreSQL), storage de arquivos, realtime etc. 

- **[Delégua](https://github.com/DesignLiquido/delegua)** para servir como a linguagem de programação utilizada como ferramenta de estudo dos usuários

- **[Resend](https://resend.com/)** para envio de e-mails

- **[React-email](https://react.email/)** para criação de templates de e-mails

- **[SWR](https://swr.vercel.app/pt-BR)** para caching de dados no lado do cliente

- **[Zod](https://nextjs.org/)** para validação e transformação de dados


> Para mais detalhes acerca das dependências do projeto, como versões específicas, veja o arquivo [package.json](https://github.com/JohnPetros/stardust/blob/main/package.json)

---

## 🚀 Como rodar a aplicação?

### 🔧 Pré-requisitos

Antes de baixar o projeto você necessecitará ter instalado na sua máquina as seguintes ferramentas:

- [Git](https://git-scm.com/) para manilupar repostitórios Git
- [npm](https://git-scm.com/), [yarn](https://yarnpkg.com/), [bun](https://bun.sh/) [pnpm](https://pnpm.io/pt/) para ma

> Além disto é bom ter um editor para trabalhar com o código, como o [VSCode](https://code.visualstudio.com/)

> Além disto é crucial configurar as variáveis de ambiente em um arquivo chamado `.env` antes de executar a aplicação. veja o arquivo [.env.example](https://github.com/JohnPetros/stardust/blob/main/.env.example) para ver quais variáveis devem ser configuradas

### 📟 Rodando a aplicação

```bash

# Clone este repositório
$ git clone https://github.com/JohnPetros/stardust.git

# Acesse a pasta do projeto
$ cd stardust

# Rode a aplicação em modo de desenvolvimento
$ docker compose up

```

> Provavelmente a aplicação estará rodando em http://localhost:3000

### 🧪 Rodando os testes

```bash

# Execute os testes
$ pnpm run test

```

---

## 💪 Como contribuir

```bash

# Fork este repositório
$ git clone https://github.com/JohnPetros/stardust.git

# Cria uma branch com a sua feature
$ git checkout -b minha-feature

# Commit suas mudanças:
$ git commit -m 'feat: Minha feature'

# Push sua branch:
$ git push origin minha-feature

```

> Você deve substituir 'minha-feature' pelo nome da feature que você está adicionando

> Você também pode abrir um [nova issue](https://github.com/JohnPetros/stardust/issues) a respeito de algum problema, dúvida ou sugestão para o projeto. Ficarei feliz em poder ajudar, assim como melhorar este projeto

---

## 📝 Licença

Esta aplicação está sob licença do MIT. Consulte o [Arquivo de licença](LICENSE) para obter mais detalhes sobre.

---

<p align="center">
  Feito com 💜 por John Petros 👋🏻
</p>

