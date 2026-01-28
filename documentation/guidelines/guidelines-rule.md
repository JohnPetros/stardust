# Guia de Documentação

Este arquivo serve como índice para as diretrizes de documentação do projeto. Consulte os arquivos específicos abaixo com base na tarefa em questão.

## Diretrizes de Interface de Usuário (ui)
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/ui-layer-guidelines.md`
**Quando consultar:**
- Ao criar ou modificar componentes React (Widgets).
- Para entender a estrutura de um widget (View, Hook, Index).
- Para convenções de nomenclatura de Views, Hooks e Props.
- Ao implementar manipuladores de eventos ou executores de ações.
- Para entender quando usar `forwardRef`.

## Convenções de Código
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/code-conventions-guidelines.md`
**Quando consultar:**
- Para convenções gerais de nomenclatura (variáveis, funções, classes, arquivos).
- Para entender o uso de Factory Functions e Objetos de Domínio (Entidades, Objetos de Valor, Agregados).
- Para regras sobre Barrel files (index.ts).
- Ao criar classes de Evento ou Erro.

## Diretrizes da Camada RPC
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/rpc-layer-guidelines.md`
**Quando consultar:**
- Ao implementar Actions no servidor usando o padrão Factory Function.
- Para entender a interface `Call` e como lidar com requisições/redirecionamentos.
- Ao organizar actions por domínio.

## Diretrizes da Camada REST
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/rest-layer-guidelines.md`
**Quando consultar:**
- Ao realizar requisições HTTP para APIs externas ou serviços.
- Para implementar novos Services usando `RestClient`.
- Para entender como funciona `RestResponse` e o tratamento de erros nesta camada.

## Diretrizes da Camada de Fila (queue)
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/queue-layer-guidelines.md`
**Quando consultar:**
- Ao implementar jobs em background ou processamento assíncrono.
- Para entender a interface `Job` e o protocolo `Amqp`.
- Ao definir novos jobs com a estrutura `Job<Payload>`.

## Diretrizes da Camada de Provision (prov)
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/provision-layer-guidelines.md`
**Quando consultar:**
- Ao integrar com ferramentas de terceiros (Armazenamento, Email, Pagamentos, etc.).
- Para implementar novos Providers (Gateways) que encapsulam SDKs externos.

## Diretrizes da Aplicação Web
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/web-application-guidelines.md`
**Quando consultar:**
- Para uma visão geral da arquitetura e stack da Aplicação Web (Next.js, Tailwind, etc.).
- Para entender a estrutura de pastas do projeto `apps/web`.

## Diretrizes da Aplicação Studio
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/studio-appllication-guidelines.md`
**Quando consultar:**
- Para uma visão geral da arquitetura e stack da Aplicação Studio (Painel Admin - Remix, Vite, Shadcn).
- Para entender a estrutura de pastas do projeto `apps/studio`.

## Diretrizes da Camada de Banco de Dados (db)
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/database-guidelines.md`
**Quando consultar:**
- Ao implementar persistência de dados (Repositories).
- Para entender o padrão de Mappers (conversão DB <-> Entidade).
- Ao configurar conexões ou tratar erros específicos de banco de dados.

## Diretrizes do Pacote Core (core)
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/core-package-guideines.md`
**Quando consultar:**
- Para entender a arquitetura de Domínio (DD Tático).
- Ao criar Entidades, Estruturas (Value Objects), Agregados e Eventos.
- Ao implementar Casos de Uso (Use Cases) e DTOs.
- Ao escrever testes unitários, Fakers ou Mocks para o domínio.

## Diretrizes de Testes Unitários
**Arquivo:** `/home/petros/projects/stardust/documentation/guidelines/unit-tests-guidelines.md`
**Quando consultar:**
- Ao escrever testes para Casos de Uso (Use Cases) e identificar padrões de teste.
- Para entender como usar mocks (`ts-jest-mocker`) e fakers (`@faker-js/faker`).
- Ao criar testes de integração para Widgets (Frontend) complexos (formulários).
- Para consultar boas práticas de estrutura (Describe, BeforeEach, It) e nomenclatura de testes.
