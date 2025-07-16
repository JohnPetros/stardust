# Para que serve?

A aplicação studio serve como um painel administrativo, ou seja, ela serve como o núcleo operacional para a gestão digital do StarDust. Ela capacita o usuário administrador com uma visão abrangente e controle total sobre as métricas essenciais dos usuários, permitindo entender o engajamento, o comportamento e as tendências. Além disso, é a ferramenta que centraliza a criação, edição e publicação de conteúdo para ser disponível tanto para o website quanto para o aplicativo mobile. Isso garante que a informação esteja sempre atualizada, consistente e relevante em todas as interfaces, otimizando a experiência do usuário e a eficiência da gestão da plataforma.

# Funcionalidades principais

## Dashboard
* Contagem de desafios cadastrados.
* Contagem de usuários cadastrados.
* Contagem de planetas cadastrados.
* Contagem de estrelas cadastradas.

## Espaço
* Listagem de planetas com suas respectivas estrelas.

## Lição
* Listagem de lições de uma determinada estrela.
* Editor de história de uma lição.

## Desafios de código
* Listagem de desafios.
* Editor de desafio.

# Desenvolvimento

## Executando a aplicação

**Clone o repositório**

```bash
git clone https://github.com/JohnPetros/stardust.git
```

**Navegue até a página da aplicação studio**

```bash
cd ./stardust/apps/studio
```

**Instale as dependências**

```bash
npm install
```

```bash
npm install
```

**Execute a aplicação em modo de desenvolvimento**

```bash
npm run dev
```

> Será aberto o painel de desenvolvimento do Inngest em http://localhost:8000

## Executando os testes

```bash
npm run tests
```
> [!NOTE]
> Defina as variáveis de ambiente de desenvolvimento no arquivo .env.development
> Para isso veja o arquivo [.env.example](https://github.com/JohnPetros/stardust/blob/main/apps/web/.env.example) para saber quais variáveis devem ser preenchidas

## Tecnologias e bibliotecas

- Framework: [Remix](https://remix.run/) com TypeScript
- Ferramenta de Build: Vite com plugin SWC para compilação rápida
- Estilização: [Tailwind CSS](https://tailwindcss.com/) com biblioteca de componentes [Shadcn](https://ui.shadcn.com/)
- Caching de dados assíncronos de REST APIs: [React Query (TanStack Query)](https://tanstack.com/query/v5/docs/framework/react/overview)
- Roteamento: React Router DOM v7
- Formulários: [React Hook Form](https://react-hook-form.com/) com validação de schema com [Zod](https://zod.dev/).
- Componentes de UI: [Primitivas Radix UI](https://www.radix-ui.com/) via [Shadcn](https://ui.shadcn.com/)
- Funcionalidade de arrastar e soltar (drag-and-drop): [Dndkit](https://dndkit.com/)
- Teste automatizados: [Jest](https://jestjs.io/)
- Testes unitários de interface UI: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

> Para mais detalhes sobre as dependências e versões, consulte o arquivo [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/studio/package.json).

## Estruturação do projeto

### Estrutura de pastas na raiz do projeto

```
├─ public/
├─ documentation/
└─ src/
└─ components.json
└─ react-router.config.ts
└─ tsconfig.json
└─ vite.config.ts
```

### Estrutura de pastas de src/

```
└─ src/
   ├─app/
   ├─constants/
   ├─ rest/
   └─ ui/
```

### Estrutura de pastas de app/

```
└─ app/
   ├─ routes/
   ├─ root.tsx
   └─ routes.ts
```

### Estrutura de pastas de rest/

```
└─ rest/
   ├── services/
   └── axios/
```

### Estrutura de pastas de ui/

└─ ui/
   ├── styles/
   ├── <nome do módulo>/
   │   ├── widgets/
   │   │   ├── components/
   │   │   ├── layouts/
   │   │   └── pages/
   └── shadcn/
      ├── components/
      └── utils/
