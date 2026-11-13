# What is it for?

The backoffice application serves as an administrative panel (Admin), acting as the operational core for the digital management of StarDust. It gives the administrator user a comprehensive view of, and control over, essential metrics (engagement, behavior and trends). In addition, it centralizes the creation, editing and publishing of content for consistent availability on the website and in the mobile app.

# Main features

## Dashboard

- Count of registered challenges.
- Count of registered users.
- Count of registered planets.
- Count of registered stars.

## Space

- Listing of planets with their respective stars.

## Lesson

- Listing of the lessons of a given star.
- Editor for a lesson's story.

## Code challenges

- Listing of challenges.
- Challenge editor.

# Development

## Technologies and libraries

- Framework: React Router v7 (App) with TypeScript
- Build tool: Vite
- Styling: Tailwind CSS with the Shadcn component library
- Data caching (REST): TanStack Query (React Query)
- Forms: React Hook Form with validation via Zod
- UI components: Radix UI primitives (via Shadcn)
- State management: Zustand
- Drag-and-drop: Dndkit
- Automated tests: Jest
- UI tests: React Testing Library

> For more details about dependencies and versions, see the [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/backoffice/package.json) file.

## Running the application

**Navigate to the backoffice application directory**

```bash
cd ./stardust/apps/backoffice
```

**Install the dependencies**

```bash
pnpm install
```

**Run the application in development mode**

```bash
pnpm run dev
```

> The backoffice application's development panel will open at http://localhost:8000

## Running the tests

```bash
pnpm run test
```
> [!NOTE]
> Set the development environment variables in the `.env.local` file.
> Reference: `apps/backoffice/.env.local`.

## Tooling

- Scripts of the `@stardust/backoffice` workspace:
  - Dev: `pnpm --filter @stardust/backoffice run dev`
  - Build: `pnpm --filter @stardust/backoffice run build`
  - Start (static): `pnpm --filter @stardust/backoffice run start`
  - Quality: `pnpm --filter @stardust/backoffice run check:code` (`lint` + `format`)
  - Types: `pnpm --filter @stardust/backoffice run check:types` (includes `react-router typegen && tsc`)
  - Tests: `pnpm --filter @stardust/backoffice run test:unit` / `pnpm --filter @stardust/backoffice run test:unit:watch`
- General reference: `documentation/tooling.md`.

## Project structure

### Folder structure at the project root

```
├─ public/
├─ documentation/
├─ src/
├─ components.json
├─ react-router.config.ts
├─ tsconfig.json
└─ vite.config.ts
```

### Folder structure of src/

```
src/
├─ app/
├─ constants/
├─ rest/
└─ ui/
```

### Folder structure of app/

```
app/
├─ routes/
├─ root.tsx
└─ routes.ts
```

### Folder structure of rest/

```
rest/
├─ services/
└─ axios/
```

### Folder structure of ui/

```
ui/
├─ styles/
├─ <module name>/
│  └─ widgets/
│     ├─ components/
│     ├─ layouts/
│     └─ pages/
└─ shadcn/
   ├─ components/
   └─ utils/
```
