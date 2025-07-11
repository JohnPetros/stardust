# Para que serve?

É a aplicação que permite aos usuários acessarem as funcionalidades do StarDust Core por meio de um navegador web. Além disso, ela também processa requisições HTTP de outros sistemas ou aplicações via padrão REST, bem como executa tarefas assíncronas por meio de filas.

# Processo de deploy

A hospedagem desta aplicação web é realizada no [Heroku](https://www.heroku.com/), uma plataforma de nuvem como serviço (PaaS) que simplifica significativamente o ciclo de vida de aplicações web, desde a construção e implantação até o gerenciamento e a escalabilidade. Especificamente, antes da criação do que o Heroku denomina Dyno – um contêiner Linux isolado e virtualizado onde a aplicação efetivamente roda –, o processo de build do projeto Next.js é executado dentro de um contêiner Docker. Essa imagem Docker, contendo o build otimizado, é previamente enviada ao [Container Registry da Heroku](https://devcenter.heroku.com/articles/container-registry-and-runtime) durante a etapa de deploy.

## Continuous delivery

O Workflow de CD para realizar o deploy automaticamente se encontra [aqui](https://github.com/JohnPetros/stardust/blob/main/.github/workflows/web-app-cd.yaml).

# Desenvolvimento

## Tecnologias e bibliotecas

- [Next.js](https://nextjs.org/) - framework full-stack para React para dar suporte à renderização do lado do servidor (SSR), geração de páginas estáticas (SSG), rotas automáticas baseadas na estrutura de arquivos e API Routes (endpoints utilizando padrão REST).
- [Inngest](https://www.inngest.com/) - plataforma de background jobs e workflows assíncronos para a execução de tarefas que rodam em segundo plano e jobs agendados e baseados em eventos
- [Next Safe Action](https://next-safe-action.dev/) - biblioteca para criar actions seguras do lado do servidor com suporte à Validação de input e tratamento automático de erros
- [Zustand](https://zustand-demo.pmnd.rs/) - biblioteca para gerenciar estados de interface complexos.
- [Zod](https://zod.dev/) -  biblioteca para validação de dados.
- [TailwindCSS](https://tailwindcss.com/) - framework utilitário de CSS, que usa classes pré-definidas para estilização de HTML/JSX.
- [Radix UI](https://www.radix-ui.com/) - biblioteca de componentes acessíveis e headless para React.
- [Framer Motion](https://motion.dev/) - biblioteca de animações para React.
- [Delégua](https://github.com/DesignLiquido/delegua) - linguagem de programação em português com interpretador de código já integrado.
- [Supabase](https://supabase.com/) - plataforma que oferece serviços backend prontas.
- [SWR](https://swr.vercel.app/) - biblioteca que facilita a recuperação e o cache de dados em aplicações React.
- [Dndkit](https://dndkit.com/) - biblioteca que fornece funcionalidade de arrastar e soltar (drag-and-drop) para React.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - biblioteca de testes focada em facilitar o teste de componentes React de forma que simula a interação real do usuário com a interface.

> Para mais detalhes acerca das dependências do projeto, como versões específicas, veja o arquivo [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/web/package.json)

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

**Execute a fila em modo de desenvolvimento** (Opcional)

```bash
npm run queue
```

> Será aberto o painel de desenvolvimento do Inngest em http://localhost:8288

**Execute a aplicação web em modo de desenvolvimento**

```bash
npm run dev
```
 > Muito provavelmente a aplicação estará rodando em http://localhost:3333

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
   │  └─ ⚙️ supabase
   ├─ 📟 rpc
   │  ├─ actions
   │  └─ ⚙️ next-safe-action
   ├─ 🧰 provision
   │  └─ <nome do tipo de provider>
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

