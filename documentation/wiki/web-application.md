# Para que serve?

É a aplicação que permite aos usuários acessarem as funcionalidades do StarDust Core por meio de um navegador web. Além disso, ela também processa requisições HTTP de outros sistemas ou aplicações via padrão REST, bem como executa tarefas assíncronas por meio de filas.

# Processo de deploy

A hospedagem desta aplicação web é realizada no [Heroku](https://www.heroku.com/), uma plataforma de nuvem como serviço (PaaS) que simplifica significativamente o ciclo de vida de aplicações web, desde a construção e implantação até o gerenciamento e a escalabilidade. Especificamente, antes da criação do que o Heroku denomina Dyno – um contêiner Linux isolado e virtualizado onde a aplicação efetivamente roda –, o processo de build do projeto Next.js é executado dentro de um contêiner Docker. Essa imagem Docker, contendo o build otimizado, é previamente enviada ao [Container Registry da Heroku](https://devcenter.heroku.com/articles/container-registry-and-runtime) durante a etapa de deploy.

## Continuous delivery

O Workflow de CD para realizar o deploy automaticamente se encontra [aqui](https://github.com/JohnPetros/stardust/blob/main/.github/workflows/web-app-cd.yaml).

# Desenvolvimento

## Tecnologias e bibliotecas

- **Framework:** [Next.js](https://nextjs.org/) com TypeScript — framework full-stack para React, oferecendo renderização do lado do servidor (SSR), geração de páginas estáticas (SSG), rotas automáticas baseadas na estrutura de arquivos e API Routes (endpoints REST).
- **Plataforma de background jobs:** [Inngest](https://www.inngest.com/) — execução de tarefas assíncronas, jobs agendados e workflows baseados em eventos.
- **Validação e actions seguras:** [Next Safe Action](https://next-safe-action.dev/) — criação de actions seguras do lado do servidor, com validação de input e tratamento automático de erros.
- **Gerenciamento de estado:** [Zustand](https://zustand-demo.pmnd.rs/) — gerenciamento de estados de interface complexos.
- **Validação de dados:** [Zod](https://zod.dev/) — validação de schemas e dados.
- **Estilização:** [TailwindCSS](https://tailwindcss.com/) — framework utilitário de CSS para estilização de HTML/JSX.
- **Componentes de UI:** [Radix UI](https://www.radix-ui.com/) — componentes acessíveis e headless para React.
- **Animações:** [Motion](https://motion.dev/) — biblioteca de animações para React.
- **Linguagem integrada:** [Delégua](https://github.com/DesignLiquido/delegua) — linguagem de programação em português com interpretador integrado.
- **Cache e fetch de dados:** [SWR](https://swr.vercel.app/) — recuperação e cache de dados em aplicações React.
- **Drag-and-drop:** [Dndkit](https://dndkit.com/) — funcionalidade de arrastar e soltar para React.
- **Testes automatizados:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — testes de componentes React simulando a interação real do usuário.

> Para mais detalhes sobre as dependências e versões, consulte o arquivo [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/web/package.json).

## Executando a aplicação

**Clone o repositório**

```bash
git clone https://github.com/JohnPetros/stardust.git
```

**Navegue até a página da aplicação web**

```bash
cd ./stardust/apps/web
```

**Instale as dependências**

```bash
npm install
```

**Execute a aplicação em modo de desenvolvimento**

```bash
npm run dev
```

> Será aberto o painel de desenvolvimento do Inngest em http://localhost:3000

## Executando os testes

```bash
npm run tests
```
> [!NOTE]
> Defina as variáveis de ambiente de desenvolvimento no arquivo .env.development
> Para isso veja o arquivo [.env.example](https://github.com/JohnPetros/stardust/blob/main/apps/web/.env.example) para saber quais variáveis devem ser preenchidas

## Estruturação de pastas

```
📦 Web
├─ public
└─ src
   ├─⚙️ app
   ├─🪨 constants
   ├─ 🎞️ queue
   │  ├─ jobs
   │  └─ ⚙️ inngest
   ├─ 🛜 rest
   │  ├─ controllers
   │  ├─ ⚙️ next
   ├─ 📟 rpc
   │  ├─ actions
   │  └─ ⚙️ next-safe-action
   └─ 🖥️ ui
      └─ <nome do módulo>
         ├─ styles
         ├─ hooks
         ├─ stores
         │  ├─ <nome do store>
         │  └─ zustand
         ├─ widgets
         │  ├─ components
         │  ├─ layouts
         │  ├─ pages
         │  └─ slots
         └─ contexts
```

Onde houver um emoji diferente de ⚙️, ele se refere a uma camada descrita na página de [arquitetura global](https://github.com/JohnPetros/stardust/wiki/Arquitetura-global). Se o emoji for ⚙️ seguido pelo nome de um framework, isso indica que há a implementação de algo dessa camada utilizando esse framework.

