# What is it for?

It is the application that lets users access the StarDust Core features through a web browser. In addition, it also processes HTTP requests from other systems or applications via the REST standard, as well as running asynchronous tasks through queues.

# Development

The Web has no Supabase client: confirmation of profile creation uses polling via `RealtimeContext`. Never use a `secret`/`service_role` API key in the Web.

## Technologies and libraries

- **Framework:** [Next.js](https://nextjs.org/) with TypeScript — full-stack framework for React, offering server-side rendering (SSR), static page generation (SSG), automatic routes based on the file structure and API Routes (REST endpoints).
- **Background jobs platform:** [Inngest](https://www.inngest.com/) — execution of asynchronous tasks, scheduled jobs and event-based workflows.
- **Validation and safe actions:** [Next Safe Action](https://next-safe-action.dev/) — creation of safe server-side actions, with input validation and automatic error handling.
- **State management:** [Zustand](https://zustand-demo.pmnd.rs/) — management of complex interface states.
- **Data validation:** [Zod](https://zod.dev/) — schema and data validation.
- **Styling:** [TailwindCSS](https://tailwindcss.com/) — utility-first CSS framework for styling HTML/JSX.
- **UI components:** [Radix UI](https://www.radix-ui.com/) — accessible, headless components for React.
- **Animations:** [Motion](https://motion.dev/) — animation library for React.
- **Embedded language:** [Delégua](https://github.com/DesignLiquido/delegua) — programming language in Portuguese with an embedded interpreter.
- **Cache and data fetching:** [SWR](https://swr.vercel.app/) — data retrieval and caching in React applications.
- **Drag-and-drop:** [Dndkit](https://dndkit.com/) — drag-and-drop functionality for React.
- **Automated tests:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — React component tests simulating real user interaction.

> For more details about dependencies and versions, see the [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/web/package.json) file.

## Running the application

**Navigate to the web application folder**

```bash
cd ./stardust/apps/web
```

**Install the dependencies**

```bash
pnpm install
```

**Run the application in development mode**

```bash
pnpm run dev
```

> The Inngest development panel will open at http://localhost:3000

## Running the tests

```bash
pnpm run test
```
> [!NOTE]
> Set the development environment variables in the .env.local file
> To do so, see the [.env.example](https://github.com/JohnPetros/stardust/blob/main/apps/web/.env.example) file to know which variables must be filled in

## Tooling

- Scripts of the `@stardust/web` workspace:
  - Dev: `pnpm --filter @stardust/web run dev`
  - Build: `pnpm --filter @stardust/web run build`
  - Start (standalone): `pnpm --filter @stardust/web run start`
  - Quality: `pnpm --filter @stardust/web run check:code` (`lint` + `format`)
  - Types: `pnpm --filter @stardust/web run check:types`
  - Tests: `pnpm --filter @stardust/web run test:unit` / `pnpm --filter @stardust/web run test:unit:watch`
- General reference: `documentation/tooling.md`.

## Folder structure

```
📦 Web
├─ public
└─ src
   ├─⚙️ app
   ├─🪨 constants
   ├─ 🎞️ queue
   │  ├─ jobs
   │  └─ ⚙️ inngest
   ├─ 🛜 rest
   │  ├─ controllers
   │  ├─ ⚙️ next
   ├─ 📟 rpc
   │  ├─ actions
   │  └─ ⚙️ next-safe-action
   └─ 🖥️ ui
      └─ <module name>
         ├─ styles
         ├─ hooks
         ├─ stores
         │  ├─ <store name>
         │  └─ zustand
         ├─ widgets
         │  ├─ components
         │  ├─ layouts
         │  ├─ pages
         │  └─ slots
         └─ contexts
```
