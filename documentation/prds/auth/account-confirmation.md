---
title: Confirmação de Conta
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/35
last_updated_at: 2026-06-28
---

# PRD — Confirmação de Conta

Disponibiliza para: auth; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

A funcionalidade de Confirmação de Conta é a etapa exibida após o usuário confirmar o e-mail com sucesso.

Ela resolve o problema de sincronizar a autenticação da conta com a criação efetiva do perfil do usuário. Após a confirmação do e-mail, o sistema autentica o usuário, redireciona para a tela de confirmação de conta e aguarda a criação do perfil antes de permitir o acesso à página principal.

O objetivo principal é garantir que o usuário só avance para a experiência principal quando seu perfil estiver disponível, oferecendo feedback visual enquanto a criação ainda está pendente.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/35 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Confirmação de e-mail com autenticação

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Confirmação de e-mail com autenticação.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Ao acessar o endpoint de confirmação de e-mail com um token válido, o sistema confirma o cadastro, cria a sessão do usuário e redireciona para a tela de confirmação de conta.

##### Regras de Negócio
- **Token válido:** O sistema deve enviar o token para confirmação de e-mail.
- **Sessão autenticada:** Em caso de sucesso, o sistema deve definir os cookies de `accessToken` e `refreshToken`.
- **Redirecionamento pós-confirmação:** Após confirmação bem-sucedida, o usuário deve ser redirecionado para `/auth/account-confirmation`.
- **Token inválido ou erro:** Em caso de falha, o usuário deve ser redirecionado para `/auth/sign-in` com a mensagem de erro em query param.

##### Regras de Experiência

- **Feedback de erro:** Erros de confirmação são exibidos no fluxo de login por meio da mensagem recebida via query param.
- **Confiabilidade:** O usuário não deve seguir para a tela de confirmação de conta se a confirmação do e-mail falhar.

---

#### RP-02 — Aguardar criação do perfil do usuário

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Aguardar criação do perfil do usuário.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Após a autenticação, a tela de confirmação deve verificar se o perfil do usuário já foi criado. Enquanto o perfil não existir, deve exibir um estado de carregamento.

##### Regras de Negócio
- **Conta autenticada sem perfil:** Quando a conta está autenticada, mas o perfil ainda não existe, o usuário deve permanecer na tela de confirmação.
- **Escuta realtime:** A tela deve escutar eventos de criação de usuário.
- **Validação por e-mail:** O evento realtime só deve ser considerado válido quando o e-mail do usuário criado for igual ao e-mail da conta autenticada.
- **Refetch do usuário:** Ao receber o evento correto, o sistema deve buscar novamente os dados do usuário.

##### Regras de Experiência

- **Estado de loading:** Enquanto o perfil não existir, a tela deve exibir um indicador de carregamento.
- **Mensagem rotativa:** O sistema deve exibir mensagens leves de espera, como "Aquecendo os motores 🚀" e outras variações.
- **Layout centralizado:** O conteúdo deve permanecer centralizado na tela.
- **Feedback contínuo:** A tela deve comunicar que o processo ainda está em andamento, evitando uma página vazia.

---

#### RP-03 — Conclusão da criação do perfil

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Conclusão da criação do perfil.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Quando o perfil do usuário estiver disponível, a tela deve exibir uma mensagem de boas-vindas e permitir que o usuário vá para a página principal.

##### Regras de Negócio
- **Perfil disponível:** Quando o usuário existir no contexto de autenticação, o estado pendente deve ser encerrado.
- **Acesso liberado:** O usuário só deve receber a ação de avançar quando o perfil estiver criado.
- **Destino principal:** A ação principal deve levar o usuário para `/space`.

##### Regras de Experiência

- **Mensagem de sucesso:** A tela deve exibir o título "Bem-vindo(a) 👋".
- **Subtítulo:** A tela deve informar "Seu perfil foi criado com sucesso!".
- **CTA principal:** A tela deve exibir o botão "Ir para a página principal".
- **Animação de transição:** Ao clicar no botão, o sistema deve exibir a animação de foguete antes de navegar para a página principal.
- **Performance:** A transição deve respeitar o delay da animação antes do redirecionamento.

---

#### RP-04 — Retry manual da criação de perfil

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Retry manual da criação de perfil.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Se o perfil continuar indisponível após um período de espera, o sistema deve permitir que o usuário tente novamente a criação do perfil.

##### Regras de Negócio
- **Delay para retry:** O botão de tentativa deve aparecer após 7 segundos sem perfil criado.
- **Retry manual:** Ao clicar em "Tentar novamente", o sistema deve executar a ação de retry de criação do usuário via `POST /auth/sign-up/retry` no server, que republica o evento de cadastro.
- **Loading do retry:** Enquanto a ação estiver em execução, o botão deve exibir estado de carregamento.
- **Erro no retry:** Se a ação falhar, o sistema deve exibir uma mensagem de erro via toast.
- **Sucesso no retry:** Após sucesso, a conclusão ainda depende da criação/refetch do perfil.

##### Regras de Experiência

- **Botão tardio:** O botão "Tentar novamente" não deve aparecer imediatamente, evitando ansiedade em processos rápidos.
- **Estado carregando:** O botão deve comunicar que a tentativa está em andamento.
- **Feedback de falha:** Falhas devem ser comunicadas por toast.
- **Confiabilidade:** A tela deve continuar em estado pendente até o perfil ser efetivamente encontrado.

---

#### RP-05 — Proteção de rotas para conta sem perfil

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Proteção de rotas para conta sem perfil.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Quando uma conta autenticada tenta acessar uma rota privada sem possuir perfil carregado, o sistema deve redirecionar para a tela de confirmação de conta.

##### Regras de Negócio
- **Conta autenticada:** A regra só se aplica a contas autenticadas.
- **Perfil ausente:** A regra só se aplica quando não há usuário/perfil disponível.
- **Rotas privadas:** O redirecionamento não deve ocorrer em rotas públicas.
- **Evitar loop:** O redirecionamento não deve ocorrer se o usuário já estiver em `/auth/account-confirmation`.

##### Regras de Experiência

- **Continuidade do fluxo:** O usuário deve ser levado automaticamente à tela correta caso tente acessar uma área privada sem perfil.
- **Confiabilidade:** A experiência principal não deve ser acessada sem perfil criado.

---

#### RP-06 — Acesso direto à tela de confirmação

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Acesso direto à tela de confirmação.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Quando a página `/auth/account-confirmation` for acessada diretamente em uma condição não prevista, a implementação atual tende a manter o usuário no estado de espera/retry.

##### Regras de Negócio
- **Conta ausente:** 🚧 Em construção. Não há comportamento explícito confirmado para usuário sem conta autenticada acessando a página diretamente.
- **Perfil ausente:** Caso não exista perfil, a tela permanece no estado pendente e exibe retry após 7 segundos.
- **Perfil existente:** Caso o perfil exista, a tela exibe a mensagem de sucesso e permite avançar para `/space`.

##### Regras de Experiência

- **Estado padrão:** A página exibe loading e mensagens de espera quando não há usuário carregado.
- **Retry:** O botão "Tentar novamente" aparece após o delay configurado.
- **Assunção:** O fluxo esperado de entrada nessa página é via confirmação bem-sucedida de e-mail ou redirecionamento interno por conta autenticada sem perfil.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| auth | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuário (User Flow)

**Confirmação de e-mail com sucesso:** Fluxo principal após cadastro por e-mail.

1. O usuário recebe o e-mail de confirmação de cadastro.
2. O usuário acessa o link de confirmação.
3. O sistema valida o token:
   - **Sucesso:** Define cookies de sessão e redireciona para `/auth/account-confirmation`.
   - **Falha:** Redireciona para `/auth/sign-in?error={mensagem}`.
4. A tela de confirmação verifica se o perfil já existe.
5. O sistema valida a existência do perfil:
   - **Sucesso:** Exibe mensagem de boas-vindas.
   - **Falha:** Exibe loading e mensagem de criação pendente.
6. Quando o perfil é criado, o sistema atualiza os dados do usuário.
7. O usuário clica em "Ir para a página principal".
8. O sistema exibe a animação de foguete.
9. O sistema redireciona para `/space`.

**Perfil ainda não criado:** Fluxo de espera e retry.

1. O usuário chega em `/auth/account-confirmation`.
2. O sistema identifica que a conta está autenticada, mas o perfil ainda não existe.
3. A tela exibe loading e mensagens rotativas.
4. O sistema aguarda evento realtime de criação do perfil.
5. Após 7 segundos sem perfil criado, o botão "Tentar novamente" aparece.
6. O usuário clica em "Tentar novamente".
7. O sistema executa a tentativa de criação do usuário via `POST /auth/sign-up/retry`:
   - **Sucesso:** Continua aguardando perfil criado/refetch.
   - **Falha:** Exibe toast de erro.
8. Quando o perfil fica disponível, a tela exibe a mensagem de sucesso.

**Redirecionamento por acesso a rota privada:** Fluxo de proteção.

1. O usuário autenticado tenta acessar uma rota privada.
2. O sistema verifica que não há perfil carregado.
3. O sistema valida se a rota não é pública e não é a própria tela de confirmação.
4. O usuário é redirecionado para `/auth/account-confirmation`.
5. A tela segue o fluxo de espera ou sucesso conforme existência do perfil.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Reenvio de e-mail de confirmação pela tela `/auth/account-confirmation`. |
| Escopo | Recuperação ou troca de senha. |
| Escopo | Cadastro social, exceto pela reutilização visual da mensagem de criação pendente. |
| Escopo | Edição de dados de perfil. |
| Escopo | Escolha manual de destino após confirmação. |
| Escopo | Definição formal de comportamento para acesso direto sem conta autenticada. |
| Escopo | Tela de erro definitiva após tempo máximo de espera. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
