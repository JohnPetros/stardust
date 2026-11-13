<h1 align="center">✨ StarDust</h1>

**Gamified** educational platform built to teach **programming logic**. The project uses a space metaphor to engage students in a learning journey, combining game elements with structured technical content.

## 🚀 Overview

StarDust aims to make learning programming accessible and fun by offering:

-   **Robust Gamification:** Points (XP), coins (StarCoins), streaks (Streak) and achievements.
-   **Space Journey:** Content organized into "Planets" (themes) and "Stars" (stages).
-   **Modular Architecture:** Clear separation of responsibilities with a focus on scalability.
-   **Complete Environment:** Includes a study platform (Web), an administrative area (Backoffice) and an API (Server).

## 🛠 Tech Stack

The project is a **monorepo** managed by **TurboRepo** and uses the most modern technologies in the JavaScript/TypeScript ecosystem:

-   **Management:** [TurboRepo](https://turbo.build/) + pnpm
-   **Language:** [TypeScript](https://www.typescriptlang.org/) 5.8+
-   **Frontend (Web):** [Next.js](https://nextjs.org/) 15 + [React](https://react.dev/) 19
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
-   **Backend (Server):** [Node.js](https://nodejs.org/) + [Hono](https://hono.dev/)
-   **Queue/Jobs:** [Inngest](https://www.inngest.com/)
-   **Internal App (Backoffice):** [React Router](https://reactrouter.com/) v7
-   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
-   **Quality:** [Biome](https://biomejs.dev/) + [Jest](https://jestjs.io/)

## 🏗 Architecture

StarDust follows the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**, adopting a **Hexagonal (Ports and Adapters)** model.

-   **Framework-Agnostic Core:** The `@stardust/core` package holds all the business logic and is independent of frameworks.
-   **Well-Defined Layers:** Strict separation between Domain, Use Cases, Interfaces and Infrastructure.
-   **Adaptation:** The applications (`web`, `server`, `backoffice`) act as adapters that consume the system core.

For an in-depth look at the technical decisions, see the [Architecture Documentation](documentation/architecture.md).

## 📂 Project Structure

```bash
stardust/
├── apps/                  # Executable applications
│   ├── web/               # Main frontend (Next.js)
│   ├── server/            # Backend API (Hono/Node)
│   └── backoffice/        # Admin panel (React Router)
├── packages/              # Shared libraries
│   ├── core/              # Business rules and domain (DDD)
│   ├── validation/        # Validation schemas (Zod)
│   ├── email/             # Email services
│   ├── studio/            # Lottie animation authoring
│   └── lsp/               # Language Server Protocol (Logic)
└── documentation/         # Centralized documentation
```

## ⚙️ Setup and Installation

### Prerequisites
-   Node.js 22 or higher.
-   pnpm 11 (package manager; enable it with `corepack enable`).

### Step by Step

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JohnPetros/stardust.git
    cd stardust
    ```

2.  **Configure the Environment:**
    Create a `.env` file at the project root (and in the specific apps, if needed) containing the environment variables. Ask the development team for the Supabase and other service credentials.

3.  **Install the dependencies:**
    ```bash
    pnpm install
    ```

4.  **Run the project (development mode):**
    ```bash
    pnpm run dev
    ```
    This starts all the monorepo applications simultaneously through TurboRepo.

## 📖 Documentation

The complete project documentation lives in the `documentation/` directory. Start here:

-   [Product Overview](documentation/overview.md)
-   [Architecture and Technical Decisions](documentation/architecture.md)
-   [Rules and Conventions](documentation/rules/rules.md)
    -   [Code Conventions](documentation/rules/code-conventions-rules.md)
    -   [Core and Domain](documentation/rules/core-package-rules.md)
    -   [UI Rules](documentation/rules/ui-layer-rules.md)
    -   [REST Layer](documentation/rules/rest-layer-rules.md)
    -   [RPC Layer](documentation/rules/rpc-layer-rules.md)
    -   [Queue Layer](documentation/rules/queue-layer-rules.md)
    -   [Database](documentation/rules/database-rules.md)
    -   [Providers](documentation/rules/provision-layer-rules.md)
    -   [Web Application](documentation/rules/web-application-rules.md)
    -   [Backoffice Application](documentation/rules/backoffice-application-rules.md)
    -   [Handler Tests](documentation/rules/handlers-testing-rules.md)
    -   [Use Case Tests](documentation/rules/use-cases-testing-rules.md)
    -   [Widget Tests](documentation/rules/widget-tests-rules.md)
    -   [Domain Object Tests](documentation/rules/domain-objects-testing-rules.md)

## 🧪 Tests

The project uses `Jest` for automated tests, covering everything from business rules in the core to UI components.

```bash
# Run all tests
pnpm run test

# Run core tests only
pnpm run test:core
```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

<p align="center">
  Made with 💜 by <a href="https://github.com/JohnPetros">John Petros</a> 👋🏻
</p>
