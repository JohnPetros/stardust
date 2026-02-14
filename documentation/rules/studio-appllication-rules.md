# Para que serve?

A aplicação studio serve como um painel administrativo (Admin), atuando como o nucleo operacional para a gestao digital do StarDust. Ela capacita o usuario administrador com uma visao abrangente e controle sobre metricas essenciais (engajamento, comportamento e tendencias). Alem disso, centraliza a criacao, edicao e publicacao de conteudo para disponibilizacao consistente no website e no aplicativo mobile.

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
npm install
```

**Execute a aplicação em modo de desenvolvimento**

```bash
npm run dev
```

> Sera aberto o painel de desenvolvimento da aplicacao studio em http://localhost:8000

## Executando os testes

```bash
npm run test
```
> [!NOTE]
> Defina as variaveis de ambiente de desenvolvimento no arquivo `.env.development`.
> Referencia: `apps/studio/.env.development`.

## Tooling

- Scripts do workspace `@stardust/studio`:
  - Dev: `npm run dev -w @stardust/studio`
  - Build: `npm run build -w @stardust/studio`
  - Start (static): `npm run start -w @stardust/studio`
  - Qualidade: `npm run codecheck -w @stardust/studio` (`lint` + `format`)
  - Tipos: `npm run typecheck -w @stardust/studio` (inclui `react-router typegen && tsc`)
  - Testes: `npm run test -w @stardust/studio` / `npm run test:watch -w @stardust/studio`
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
