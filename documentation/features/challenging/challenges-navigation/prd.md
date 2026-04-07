# Challenges Navigation — PRD

## 1. Visao Geral

O fluxo de **Challenges Navigation** organiza como o estudante navega entre desafios livres dentro da experiencia de execucao. O objetivo e reduzir atrito entre tentativas, facilitar descoberta de novos desafios e preservar contexto sem obrigar o usuario a voltar para a listagem principal.

**Objetivo:** permitir navegacao sequencial e navegacao exploratoria na pagina de desafio, mantendo consistencia com a ordem global dos desafios livres e exibindo progresso do usuario autenticado quando aplicavel.

**Problema resolvido:** antes da consolidacao desta feature, a pagina de desafio dependia de saidas manuais para a listagem, aumentando friccao para comparar, continuar ou trocar rapidamente de desafio.

---

## 2. Requisitos

### REQ-01 Navegacao sequencial entre desafios livres

- [x] **Controles Anterior e Proximo**

**Descricao:** o usuario consegue navegar para o desafio anterior ou seguinte sem sair da pagina atual, seguindo a ordem global dos desafios livres.

#### Regras de negocio

- A navegacao sequencial considera apenas desafios livres (`star_id = null`).
- Os controles usam a ordem global por criacao para resolver anterior e proximo.
- O fluxo preserva o guard de dirty state antes de trocar de desafio.
- Desafios vinculados a estrela nao entram neste fluxo.

#### Regras de UI/UX

- Os botoes ficam desabilitados quando nao houver desafio anterior ou proximo.
- Tooltips explicam que a navegacao ignora filtros e segue a ordem global.

---

### REQ-02 Sidebar lateral de navegacao de desafios

- [x] **Sidebar lateral de desafios**

**Descricao:** o usuario consegue abrir uma sidebar lateral a partir do controle `Desafios` no header da pagina para buscar, filtrar e trocar rapidamente de desafio.

#### Regras de negocio

- A sidebar abre por overlay sem alterar a rota atual ate a selecao de um item.
- A listagem reutiliza o endpoint paginado de desafios livres e carrega 20 itens por pagina.
- A busca por titulo e case-insensitive e reinicia a paginacao ao mudar o termo.
- Os filtros permitem status de completude, dificuldade e categorias.
- O filtro de status e o contador `X/Y Resolvidos` aparecem apenas para usuarios autenticados.
- O contador de progresso usa o mesmo universo de desafios livres exibidos pela sidebar.
- Ao selecionar um desafio, a navegacao ocorre imediatamente.

#### Regras de UI/UX

- O trigger principal da sidebar e o segmento clicavel `Desafios` do widget de navegacao.
- O carregamento inicial e sob demanda e usa skeletons em vez de spinner central.
- A sidebar fecha por overlay, botao dedicado e tecla `Esc`.
- O desafio atualmente aberto fica destacado na lista.
- O botao de filtros exibe badge com a quantidade de filtros ativos.
- A listagem exibe estado vazio amigavel e CTA de retry em caso de erro.

---

## 3. Fluxo de Usuario

### Navegacao sequencial

1. O usuario abre um desafio livre.
2. O sistema hidrata os slugs de anterior e proximo.
3. O usuario clica em `Anterior` ou `Proximo`.
4. Se houver dirty state, o sistema pede confirmacao antes de navegar.
5. Se nao houver bloqueio, o usuario e levado ao desafio adjacente.

### Navegacao exploratoria pela sidebar

1. O usuario clica em `Desafios` no header.
2. A sidebar abre e carrega a listagem, categorias e progresso sob demanda.
3. O usuario busca ou aplica filtros.
4. O sistema atualiza a listagem paginada e mantem destaque do desafio atual.
5. O usuario escolhe um item da lista.
6. A sidebar fecha e a pagina navega imediatamente para o novo desafio.

---

## 4. Fora do Escopo

- Navegacao aleatoria.
- Inclusao de desafios de estrela na sidebar.
- SSR da listagem da sidebar no payload inicial da pagina.
- Redesenho dos controles sequenciais alem do trigger da sidebar.

---

## 5. Estado Atual

- [x] Navegacao sequencial entregue.
- [x] Sidebar lateral entregue.
- [x] Busca, filtros, paginacao e destaque do desafio atual entregues.
- [x] Contador de progresso para usuarios autenticados entregue.
