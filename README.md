<h1 align="center">✨ StarDust</h1>

Plataforma educativa **gamificada** desenvolvida para o ensino de **lógica de programação**. O projeto utiliza uma metáfora espacial para engajar os estudantes em uma jornada de aprendizado, combinando elementos de jogos com conteúdo técnico estruturado.

## 🚀 Visão Geral

O objetivo do StarDust é tornar o aprendizado de programação acessível e divertido, oferecendo:

-   **Gamificação Robusta:** Sistema de pontos (XP), moedas (StarCoins), ofensiva (Streak) e conquistas.
-   **Jornada Espacial:** Organização do conteúdo em "Planetas" (temas) e "Estrelas" (fases).
-   **Arquitetura Modular:** Separação clara de responsabilidades com foco em escalabilidade.
-   **Ambiente Completo:** Inclui plataforma de estudo (Web), área administrativa (Studio) e API (Server).

## 🛠 Tech Stack

O projeto é um **monorepo** gerenciado pelo **TurboRepo** e utiliza as tecnologias mais modernas do ecossistema JavaScript/TypeScript:

-   **Gerenciamento:** [TurboRepo](https://turbo.build/) + NPM
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) 5.8+
-   **Frontend (Web):** [Next.js](https://nextjs.org/) 15 + [React](https://react.dev/) 19
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
-   **Backend (Server):** [Node.js](https://nodejs.org/) + [Hono](https://hono.dev/)
-   **Fila/Jobs:** [Inngest](https://www.inngest.com/)
-   **App Interno (Studio):** [React Router](https://reactrouter.com/) v7
-   **Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL)
-   **Qualidade:** [Biome](https://biomejs.dev/) + [Jest](https://jestjs.io/)

## 🏗 Arquitetura

O StarDust segue os princípios da **Arquitetura Limpa (Clean Architecture)** e **Domain-Driven Design (DDD)**, adotando um modelo **Hexagonal (Ports and Adapters)**.

-   **Core Agnóstico:** O pacote `@stardust/core` contém toda a lógica de negócio e é independente de frameworks.
-   **Camadas Bem Definidas:** Separação estrita entre Domínio, Casos de Uso, Interfaces e Infraestrutura.
-   **Adaptação:** As aplicações (`web`, `server`, `studio`) atuam como adaptadores que consomem o núcleo do sistema.

Para detalhes profundos sobre as decisões técnicas, consulte a [Documentação de Arquitetura](documentation/architecture.md).

## 📂 Estrutura do Projeto

```bash
stardust/
├── apps/                  # Aplicações executáveis
│   ├── web/               # Frontend principal (Next.js)
│   ├── server/            # Backend API (Hono/Node)
│   └── studio/            # Painel Administrativo (React Router)
├── packages/              # Bibliotecas compartilhadas
│   ├── core/              # Regras de Negócio e Domínio (DDD)
│   ├── validation/        # Schemas de validação (Zod)
│   ├── email/             # Serviços de Email
│   └── lsp/               # Language Server Protocol (Lógica)
└── documentation/         # Documentação centralizada
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
-   Node.js 22 ou superior.
-   NPM (gerenciador de pacotes).

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/JohnPetros/stardust.git
    cd stardust
    ```

2.  **Configure o Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (e nos apps específicos, se necessário) contendo as variáveis de ambiente. Consulte o time de desenvolvimento para obter as credenciais do Supabase e outros serviços.

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Execute o projeto (modo desenvolvimento):**
    ```bash
    npm run dev
    ```
    Isso iniciará todas as aplicações do monorepo simultaneamente via TurboRepo.

## 📖 Documentação

A documentação completa do projeto está organizada no diretório `documentation/`. Comece por aqui:

-   [Visão Geral do Produto](documentation/overview.md)
-   [Arquitetura e Decisões Técnicas](documentation/architecture.md)
-   [Regras e Convenções](documentation/rules/rules.md)
    -   [Convenções de Código](documentation/rules/code-conventions-rules.md)
    -   [Core e Domínio](documentation/rules/core-package-rules.md)
    -   [Regras de UI](documentation/rules/ui-layer-rules.md)
    -   [Camada REST](documentation/rules/rest-layer-rules.md)
    -   [Camada RPC](documentation/rules/rpc-layer-rules.md)
    -   [Camada de Fila](documentation/rules/queue-layer-rules.md)
    -   [Banco de Dados](documentation/rules/database-rules.md)
    -   [Providers](documentation/rules/provision-layer-rules.md)
    -   [Aplicação Web](documentation/rules/web-application-rules.md)
    -   [Aplicação Studio](documentation/rules/studio-appllication-rules.md)
    -   [Testes de Handlers](documentation/rules/handlers-testing-rules.md)
    -   [Testes de Casos de Uso](documentation/rules/use-cases-testing-rules.md)
    -   [Testes de Widgets](documentation/rules/widget-tests-rules.md)
    -   [Testes de Objetos de Domínio](documentation/rules/domain-objects-testing-rules.md)

## 🧪 Testes

O projeto utiliza `Jest` para testes automatizados, cobrindo desde regras de negócio no core até componentes de UI.

```bash
# Executar todos os testes
npm run test

# Executar testes apenas do core
npm run test:core
```

## 📝 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com 💜 por <a href="https://github.com/JohnPetros">John Petros</a> 👋🏻
</p>
