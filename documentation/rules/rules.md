# Regras do Projeto

Este arquivo serve como índice para as regras de documentação do projeto.
Sempre consulte os arquivos específicos abaixo com base na tarefa em questão.

## Regras de Convenções de Código

**Arquivo:** `/documentation/rules/code-conventions-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado às convenções de código.
- Para convenções gerais de nomenclatura (variáveis, funções, classes,
  arquivos).
- Para entender o uso de Factory Functions e Objetos de Domínio (Entidades,
  Objetos de Valor, Agregados).
- Para regras sobre Barrel files (index.ts).
- Ao criar classes de Evento ou Erro.

## Regras da Camada UI

**Arquivo:** `/documentation/rules/ui-layer-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada UI.
- Ao criar ou modificar componentes React (Widgets).
- Para entender a estrutura de um widget (View, Hook, Index).
- Para convenções de nomenclatura de Views, Hooks e Props.
- Ao implementar manipuladores de eventos ou executores de ações.
- Para entender quando usar `forwardRef`.

## Regras da Camada REST

**Arquivo:** `/documentation/rules/rest-layer-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada REST.
- Ao realizar requisições HTTP para APIs externas ou serviços.
- Para implementar novos Services usando `RestClient`.
- Para entender como funciona `RestResponse` e o tratamento de erros nesta
  camada.

## Regras da Camada RPC

**Arquivo:** `/documentation/rules/rpc-layer-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada RPC.
- Ao implementar Actions no servidor usando o padrão Factory Function.
- Para entender a interface `Call` e como lidar com
  requisições/redirecionamentos.
- Ao organizar actions por domínio.

## Regras da Camada de Fila (queue)

**Arquivo:** `/documentation/rules/queue-layer-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada de fila.
- Ao implementar jobs em background ou processamento assíncrono.
- Para entender a interface `Job` e o protocolo `Amqp`.
- Ao definir novos jobs com a estrutura `Job<Payload>`.

## Regras da Camada de Providers (provision)

**Arquivo:** `/documentation/rules/provision-layer-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada de provision.
- Ao integrar com ferramentas de terceiros (Armazenamento, Email, Pagamentos,
  etc.).
- Para implementar novos Providers (Gateways) que encapsulam SDKs externos.

## Regras da Aplicação Web

**Arquivo:** `/documentation/rules/web-application-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a aplicação web.
- Para uma visão geral da arquitetura e stack da Aplicação Web (Next.js,
  Tailwind, etc.).
- Para entender a estrutura de pastas do projeto `apps/web`.

## Regras da Aplicação Studio

**Arquivo:** `/documentation/rules/studio-appllication-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a aplicação studio.
- Para uma visão geral da arquitetura e stack da Aplicação Studio (Painel
  Admin - Remix, Vite, Shadcn).
- Para entender a estrutura de pastas do projeto `apps/studio`.

## Regras da Camada de Banco de Dados (db)

**Arquivo:** `/documentation/rules/database-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado a camada de banco de dados.
- Ao implementar persistência de dados (Repositories).
- Para entender o padrão de Mappers (conversão DB <-> Entidade).
- Ao configurar conexões ou tratar erros específicos de banco de dados.

## Regras do Pacote Core (core)

**Arquivo:** `/documentation/rules/core-package-rules.md`
**Quando consultar:**

- Ao criar ou modificar um documento relacionado ao pacote core.
- Para entender a arquitetura de Domínio (DD Tático).
- Ao criar Entidades, Estruturas (Value Objects), Agregados e Eventos.
- Ao implementar Casos de Uso (Use Cases) e DTOs.
- Ao escrever testes unitários, Fakers ou Mocks para o domínio.

## Regras de Testes de Handlers

**Arquivo:** `/documentation/rules/handlers-testing-rules.md`
**Quando consultar:**

- Ao escrever testes para Controllers (REST), Actions (RPC) ou Tools (AI).
- Para entender como mockar os objetos de contexto `Http`, `Call` e `Mcp`.
- Para seguir os padrões de orquestração e tradução de dados nos testes de
  entrada da aplicação.

## Regras de Testes de Casos de Uso

**Arquivo:** `/documentation/rules/use-cases-testing-rules.md`
**Quando consultar:**

- Ao escrever testes unitários para Casos de Uso (Use Cases) no pacote core.
- Para entender como mockar repositórios e outras dependências usando
  `ts-jest-mocker`.
- Para seguir o padrão de teste de caminhos de sucesso e erros de negócio.
- Para instruções sobre o uso de Fakers para gerar dados de teste.

## Regras de Testes de Widgets

**Arquivo:** `/documentation/rules/widget-tests-rules.md`
**Quando consultar:**

- Ao testar componentes React (Widgets) na camada de UI.
- Para entender a separação de testes entre Hooks e Views.
- Para utilizar funções auxiliares como `Hook()` e `View()` para testes mais
  limpos.
- Para instruções sobre testes de integração de widgets de formulário complexos.

## Regras de Testes de Objetos de Domínio

**Arquivo:** `/documentation/rules/domain-objects-testing-rules.md`
**Quando consultar:**

- Ao escrever testes para Entidades, Estruturas (Structures) e Agregados.
- Para entender como usar Fakers para preparar o estado dos testes de domínio.
- Para seguir os padrões de asserção e validação de regras de negócio no
  domínio.
