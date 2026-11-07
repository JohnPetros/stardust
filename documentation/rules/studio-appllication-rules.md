# Para que serve?

A aplicação studio serve como um painel administrativo (Admin), atuando como o nucleo operacional para a gestao digital do StarDust. Ela capacita o usuario administrador com uma visao abrangente e controle sobre metricas essenciais (engajamento, comportamento e tendencias). Alem disso, centraliza a criacao, edicao e publicacao de conteúdo para disponibilizacao consistente no website e no aplicativo mobile.

# Funcionalidades principais

## Dashboard

- Contagem de desafios cadastrados.
- Contagem de usuarios cadastrados.
- Contagem de planetas cadastrados.
- Contagem de estrelas cadastradas.

## Espaco

- Listagem de planetas com suas respectivas estrelas.

## Licao

- Listagem de licoes de uma determinada estrela.
- Editor de historia de uma licao.

## Desafios de codigo

- Listagem de desafios.
- Editor de desafio.

# Desenvolvimento

## Tecnologias e bibliotecas

- Framework: React Router v7 (App) com TypeScript
- Ferramenta de build: Vite
- Estilizacao: Tailwind CSS com biblioteca de componentes Shadcn
- Caching de dados (REST): TanStack Query (React Query)
- Formularios: React Hook Form com validacao via Zod
- Componentes de UI: Primitivas Radix UI (via Shadcn)
- Gerenciamento de estado: Zustand
- Drag-and-drop: Dndkit
- Testes automatizados: Jest
- Testes de UI: React Testing Library

> Para mais detalhes sobre as dependencias e versoes, consulte o arquivo [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/studio/package.json).

## Executando a aplicação

**Navegue até a página da aplicação studio**

```bash
cd ./stardust/apps/studio
```

**Instale as dependências**

```bash
pnpm install
```

**Execute a aplicação em modo de desenvolvimento**

```bash
pnpm run dev
```

> Sera aberto o painel de desenvolvimento da aplicacao studio em http://localhost:8000

## Executando os testes

```bash
pnpm run test
```
> [!NOTE]
> Defina as variaveis de ambiente de desenvolvimento no arquivo `.env.local`.
> Referencia: `apps/studio/.env.local`.

## Tooling

- Scripts do workspace `@stardust/studio`:
  - Dev: `pnpm --filter @stardust/studio run dev`
  - Build: `pnpm --filter @stardust/studio run build`
  - Start (static): `pnpm --filter @stardust/studio run start`
  - Qualidade: `pnpm --filter @stardust/studio run check:code` (`lint` + `format`)
  - Tipos: `pnpm --filter @stardust/studio run check:types` (inclui `react-router typegen && tsc`)
  - Testes: `pnpm --filter @stardust/studio run test:unit` / `pnpm --filter @stardust/studio run test:unit:watch`
- Referencia geral: `documentation/tooling.md`.

## Estruturação do projeto

### Estrutura de pastas na raiz do projeto

```
├─ public/
├─ documentation/
├─ src/
├─ components.json
├─ react-router.config.ts
├─ tsconfig.json
└─ vite.config.ts
```

### Estrutura de pastas de src/

```
src/
├─ app/
├─ constants/
├─ rest/
└─ ui/
```

### Estrutura de pastas de app/

```
app/
├─ routes/
├─ root.tsx
└─ routes.ts
```

### Estrutura de pastas de rest/

```
rest/
├─ services/
└─ axios/
```

### Estrutura de pastas de ui/

```
ui/
├─ styles/
├─ <nome do módulo>/
│  └─ widgets/
│     ├─ components/
│     ├─ layouts/
│     └─ pages/
└─ shadcn/
   ├─ components/
   └─ utils/
```
