# PRD — MCP Server para Gerenciamento de Desafios

- **Módulo:** `challenging`
- **Milestone:** [#26 — MCP Server para Gerenciamento de Desafios](https://github.com/JohnPetros/stardust/milestone/26)
- **Status:** open
- **Atualizado em:** 2026-08-01T14:17:04Z

## Definição do produto

### 1. Visao Geral

**MCP Server para Gerenciamento de Desafios** entrega uma integracao do Stardust com o protocolo MCP para que engenheiros autenticados por API key consigam consultar instrucoes oficiais, listar desafios, criar rascunhos, atualizar desafios proprios e excluir desafios proprios a partir do cliente MCP de sua preferencia.

**Problema que resolve:** Gerenciar desafios fora da interface web exige repetir operacoes manuais e conhecer detalhes estruturais do dominio. O MCP reduz esse atrito com um contrato autenticado, guiado por tools e alinhado aos use cases existentes do sistema.

**Objetivo principal:** Permitir que engenheiros com permissao de gerenciamento conectem a IA de sua escolha ao Stardust e operem o ciclo de criacao e manutencao de desafios com seguranca, ownership correto e validacao consistente.

**Valor entregue:**
- Integracao com clientes MCP externos usando um endpoint HTTP unico em `/mcp`
- Autenticacao por API key com hash SHA-256 e validacao de insignia de Engenheiro
- Tool oficial com instrucoes completas para criacao de desafios validos
- Criacao sempre como rascunho com autoria preservada da conta autenticada
- Listagem, atualizacao e exclusao restritas ao autor autenticado

---

### 2. Requisitos

#### Conectar ao Stardust via MCP
- [x] **Conectar ao Stardust via MCP**

**Descricao:** O engenheiro consegue conectar seu cliente MCP ao Stardust informando a URL do servidor e sua API key.

##### Regras de Negocio
- **Autenticacao obrigatoria:** Apenas usuarios com insignia de Engenheiro podem se conectar.
- **API key:** O engenheiro gera sua API key no fluxo ja existente do produto e a informa no cliente MCP.
- **Formato da key:** `sk_<random_base62_32chars>` — exibida uma unica vez na geracao e armazenada como SHA-256 no banco.
- **Gerenciamento:** O engenheiro pode gerar, visualizar e revogar suas keys pelos fluxos existentes do sistema.

---

#### Obter instrucoes de criacao de desafio
- [x] **Obter instrucoes de criacao de desafio**

**Descricao:** A IA consegue buscar as regras, estrutura esperada e exemplos para gerar um desafio valido no Stardust.

##### Regras de Negocio
- **Contexto completo:** As instrucoes retornam campos obrigatorios, formatos aceitos e exemplos de casos de teste validos.
- **Base para geracao:** A IA usa essas instrucoes antes do fluxo de publicacao ou edicao.

---

#### Publicar desafio como rascunho
- [x] **Publicar desafio como rascunho**

**Descricao:** Apos revisar o desafio gerado pela IA, o engenheiro pode publica-lo na plataforma como rascunho.

##### Regras de Negocio
- **Rascunho por padrao:** O desafio e salvo como rascunho — nao fica visivel para outros usuarios ate publicacao manual.
- **Validacao dos dados:** O sistema rejeita a publicacao se campos obrigatorios estiverem ausentes ou invalidos.
- **Autoria preservada:** O desafio e associado a conta do engenheiro autenticado via API key.

---

#### Listar desafios pelo MCP
- [x] **Listar desafios pelo MCP**

**Descricao:** A IA consegue listar desafios usando filtros e paginacao para apoiar criacao, revisao e manutencao.

##### Regras de Negocio
- **Catalogo publico:** A listagem retorna o catalogo publico no fluxo MCP.
- **Contexto do usuario:** Quando houver conta autenticada, a resposta pode ser enriquecida com status de conclusao.

---

#### Atualizar desafio criado pelo engenheiro
- [x] **Atualizar desafio criado pelo engenheiro**

**Descricao:** A IA consegue atualizar os dados de um desafio criado pelo engenheiro autenticado apos revisao ou solicitacao de ajuste.

##### Regras de Negocio
- **Restricao de autoria:** O engenheiro so pode atualizar desafios criados por ele mesmo.
- **Validacao dos dados:** O sistema rejeita a atualizacao se campos obrigatorios estiverem ausentes ou invalidos.
- **Controle de estado:** O fluxo preserva o autor e permite alterar `isPublic` apenas quando a conta autenticada for a autora.

---

#### Excluir desafio criado pelo engenheiro
- [x] **Excluir desafio criado pelo engenheiro**

**Descricao:** A IA consegue excluir um desafio criado pelo engenheiro autenticado mediante confirmacao explicita.

##### Regras de Negocio
- **Restricao de autoria:** O engenheiro so pode excluir desafios criados por ele mesmo.
- **Confirmacao obrigatoria:** A exclusao exige `confirmacao: true` no payload.
- **Resposta segura:** O sistema responde como nao encontrado quando o desafio nao existir ou nao pertencer a conta autenticada.

---

### 3. Fluxo de Usuario

**Conectar o cliente MCP ao Stardust:**

1. O engenheiro gera ou reutiliza uma API key valida.
2. Configura o cliente MCP com a URL do servidor e a API key.
3. O endpoint `/mcp` autentica a key, valida a insignia e libera as tools do dominio `challenging`.

---

**Criar e gerenciar um desafio:**

1. O engenheiro pede a IA para criar ou ajustar um desafio.
2. A IA busca as instrucoes oficiais de criacao do Stardust.
3. A IA gera o desafio completo na conversa.
4. O engenheiro revisa e solicita ajustes se necessario.
5. Quando satisfeito, publica o desafio como rascunho.
6. Depois disso, pode listar, atualizar ou excluir desafios proprios pelo mesmo fluxo MCP.
7. O engenheiro acessa a plataforma web para revisao final e publicacao manual quando necessario.

---

### 4. Fora do Escopo

- Publicacao automatica obrigatoria como publico no momento da criacao.
- Criacao de desafios por usuarios sem insignia de Engenheiro.
- Visualizacao, edicao ou exclusao de desafios privados de outros engenheiros.
- Exposicao via MCP de outros dominios como `lesson`, `manual` ou `space`.
- Substituicao do pipeline HTTP atual do `HonoApp` por outro adapter.
