# Para que serve?

É a aplicação que permite aos usuários acessarem as funcionalidades do StarDust Core por meio de um navegador web. Além disso, ela também processa requisições HTTP de outros sistemas ou aplicações via padrão REST, bem como executa tarefas assíncronas por meio de filas.

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
npm run test
```
> [!NOTE]
> Defina as variáveis de ambiente de desenvolvimento no arquivo .env.development
> Para isso veja o arquivo [.env.example](https://github.com/JohnPetros/stardust/blob/main/apps/web/.env.example) para saber quais variáveis devem ser preenchidas

## Tooling

- Scripts do workspace `@stardust/web`:
  - Dev: `npm run dev -w @stardust/web`
  - Queue (Inngest local): `npm run queue -w @stardust/web`
  - Build: `npm run build -w @stardust/web`
  - Start (standalone): `npm run start -w @stardust/web`
  - Qualidade: `npm run codecheck -w @stardust/web` (`lint` + `format`)
  - Tipos: `npm run typecheck -w @stardust/web`
  - Testes: `npm run test:unit -w @stardust/web` / `npm run test:unit:watch -w @stardust/web`
  - Tipos do banco (Supabase): `npm run db:types -w @stardust/web`
- Referencia geral: `documentation/tooling.md`.

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
