---
title: Gerenciador de Chaves de API
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/27
last_updated_at: 2026-04-22
---

# PRD — Gerenciador de Chaves de API

Disponibiliza para: auth; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O **Gerenciador de API Keys** é uma página na plataforma web do Stardust que permite que usuários com a insígnia de **Engenheiro** criem e gerenciem suas chaves de acesso à API do Stardust — usadas, inicialmente, para conectar ao MCP do Stardust.

Ele resolve o problema de não haver um ponto centralizado onde usuários técnicos possam gerar e controlar suas credenciais de acesso programático à plataforma.

O objetivo principal é entregar autonomia ao usuário engenheiro para criar, visualizar, renomear e revogar suas API keys sem depender de suporte manual, garantindo controle e segurança sobre os acessos externos à plataforma.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/27 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

🚧 Em construção — objetivos e métricas estruturados não estão registrados no documento legado.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Controlar acesso ao gerenciador

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Controlar acesso ao gerenciador.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** A página do gerenciador de API keys deve ser acessível apenas por usuários com a insígnia de Engenheiro.

##### Regras de Negócio
- **Verificação de insígnia:** O sistema deve validar se o usuário autenticado possui a insígnia de Engenheiro antes de renderizar a página.
- **Acesso não autorizado:** Usuários autenticados sem a insígnia de Engenheiro devem receber uma resposta 404 ao tentar acessar a página.
- **Usuário não autenticado:** Usuários não autenticados devem ser redirecionados para o fluxo de login antes da verificação de insígnia.

##### Regras de Experiência
- **Página 404:** O usuário sem insígnia deve ver a página de erro 404 padrão da plataforma, sem pistas sobre a existência do gerenciador.

---

#### RP-02 — Gerar nova API key

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Gerar nova API key.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O usuário engenheiro deve conseguir criar uma nova API key informando um nome descritivo.

##### Regras de Negócio
- **Campo obrigatório:** O nome da key é o único campo obrigatório na criação.
- **Sem limite de keys:** O usuário pode criar quantas API keys desejar, sem limite de quantidade ativa.
- **Geração única e segura:** A key gerada deve ser única na plataforma e seguir um padrão seguro (token aleatório com prefixo identificável, ex: `sk_`).
- **Exibição única:** A key completa deve ser exibida em texto claro **apenas uma vez**, imediatamente após sua criação.
- **Persistência mascarada:** Após a exibição inicial, o sistema deve armazenar apenas o preview mascarado da key (ex: `sk_****abc123`) e o hash da key completa para validação futura.
- **Irreversibilidade da exibição:** Se o usuário fechar o modal sem copiar a key, ela não poderá ser recuperada — apenas revogada e substituída por uma nova.
- **Vinculação ao usuário:** A key criada deve ficar associada exclusivamente ao perfil do usuário que a gerou.

##### Regras de Experiência
- **Ação de criação:** A página deve ter um botão visível para iniciar a criação de uma nova key.
- **Modal de criação:** A criação ocorre em um modal com campo de nome e botão de confirmação.
- **Feedback de loading:** O botão de confirmação exibe estado de carregamento durante a geração.
- **Tela de exibição da key:** Após a criação bem-sucedida, exibir a key completa em um bloco destacado com botão "Copiar".
- **Aviso de única exibição:** A interface deve alertar de forma clara que a key só será exibida uma única vez.
- **Feedback de cópia:** Ao clicar em copiar, exibir confirmação visual de cópia bem-sucedida.
- **Feedback de erro:** Exibir mensagem de erro clara em caso de falha na geração.

---

#### RP-03 — Listar API keys existentes

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listar API keys existentes.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O usuário engenheiro deve conseguir visualizar todas as suas API keys ativas na página do gerenciador.

##### Regras de Negócio
- **Escopo da listagem:** A lista deve exibir apenas as API keys pertencentes ao usuário autenticado.
- **Informações exibidas:** Cada item da lista deve mostrar nome da key, preview mascarado e data de criação.
- **Ordenação:** As keys devem ser ordenadas pela data de criação, da mais recente para a mais antiga.
- **Keys revogadas:** Keys revogadas não devem aparecer na listagem.

##### Regras de Experiência
- **Estado vazio:** Quando o usuário não possuir nenhuma key, exibir mensagem informativa indicando que ele ainda não gerou nenhuma API key, com CTA para criar a primeira.
- **Feedback de loading:** Exibir estado de carregamento enquanto a lista é buscada.
- **Feedback de erro:** Exibir mensagem clara em caso de falha no carregamento.
- **Formato da data:** A data de criação deve ser exibida em formato legível (ex: "Criada em 16/04/2026").

---

#### RP-04 — Renomear API key

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Renomear API key.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O usuário engenheiro deve conseguir alterar o nome de uma API key existente.

##### Regras de Negócio
- **Escopo da edição:** Apenas o nome da key pode ser editado — o valor da key em si é imutável.
- **Propriedade da key:** O usuário só pode renomear keys que ele próprio criou.
- **Persistência imediata:** A alteração do nome deve ser persistida ao confirmar a ação.

##### Regras de Experiência
- **Ação de renomear:** Cada item da lista deve ter uma ação de renomear acessível (ícone/botão).
- **Modal ou edição inline:** A edição do nome pode ocorrer em modal dedicado ou inline no item da lista.
- **Feedback de loading:** Exibir estado de carregamento durante a persistência.
- **Feedback de sucesso:** Exibir confirmação visual após o renomear bem-sucedido.
- **Feedback de erro:** Exibir mensagem clara em caso de falha.

---

#### RP-05 — Revogar API key

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Revogar API key.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O usuário engenheiro deve conseguir revogar (invalidar permanentemente) uma API key existente.

##### Regras de Negócio
- **Propriedade da key:** O usuário só pode revogar keys que ele próprio criou.
- **Invalidação imediata:** Uma key revogada deve parar de funcionar imediatamente para qualquer requisição autenticada com ela.
- **Soft delete:** A revogação deve ser implementada como soft delete — o registro da key permanece no banco com marcação de revogada (ex: campo `revoked_at` preenchido), para fins de auditoria e rastreabilidade.
- **Irreversibilidade:** A revogação é permanente — uma key revogada não pode ser reativada pelo usuário.
- **Exclusão da listagem:** Keys revogadas devem deixar de aparecer na listagem exibida ao usuário.

##### Regras de Experiência
- **Ação de revogar:** Cada item da lista deve ter uma ação de revogar acessível.
- **Confirmação destrutiva:** Antes de revogar, exibir diálogo de confirmação destacando que a ação é irreversível e que qualquer integração usando essa key deixará de funcionar.
- **Feedback de loading:** Exibir estado de carregamento durante a revogação.
- **Feedback de sucesso:** Exibir confirmação visual após a revogação.
- **Feedback de erro:** Exibir mensagem clara em caso de falha.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| auth | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuário (User Flow)

**Acessar o gerenciador:**
1. O usuário acessa a tela de perfil.
2. O usuário clica no botão com ícone de chave.
3. O sistema valida se o usuário possui a insígnia de Engenheiro:
   - **Sucesso:** O sistema renderiza a página do gerenciador com a listagem de API keys do usuário.
   - **Falha (sem insígnia):** O sistema exibe a página 404.

**Gerar nova API key:**
1. O usuário clica no botão de criar nova API key.
2. O sistema abre um modal com campo de nome.
3. O usuário preenche o nome e confirma.
4. O sistema valida e gera a key:
   - **Sucesso:** O sistema exibe a key completa gerada com botão de copiar e aviso de exibição única.
   - **Falha:** O sistema exibe mensagem de erro e mantém o usuário no modal.
5. O usuário copia a key e fecha o modal.
6. A nova key aparece na listagem com nome e preview mascarado.

**Renomear API key:**
1. O usuário clica na ação de renomear em uma key da listagem.
2. O sistema abre modal (ou edição inline) com o nome atual preenchido.
3. O usuário altera o nome e confirma.
4. O sistema valida e persiste a alteração:
   - **Sucesso:** O novo nome é refletido imediatamente na listagem.
   - **Falha:** O sistema exibe mensagem de erro.

**Revogar API key:**
1. O usuário clica na ação de revogar em uma key da listagem.
2. O sistema exibe diálogo de confirmação alertando que a ação é irreversível e que integrações usando essa key deixarão de funcionar.
3. O usuário confirma a revogação.
4. O sistema processa a revogação:
   - **Sucesso:** A key é marcada como revogada (soft delete), removida da listagem e para de funcionar imediatamente.
   - **Falha:** O sistema exibe mensagem de erro e a key permanece ativa na listagem.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Listagem de keys revogadas para o usuário. |
| Escopo | Data de expiração de keys. |
| Escopo | Escopos e permissões granulares por key. |
| Escopo | Limite de keys por usuário. |
| Escopo | Regenerar uma key revogada (reativação). |
| Escopo | Auditoria de uso da key (logs de requisições feitas com ela). |
| Escopo | Gerenciamento de keys de outros usuários por administradores. |
| Escopo | Acesso ao gerenciador por usuários sem a insígnia de Engenheiro. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
