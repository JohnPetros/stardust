# PRD — Gestão de Foguetes

- **Módulo:** `shop`
- **Milestone:** [#9 — Gestão de Foguetes](https://github.com/JohnPetros/stardust/milestone/9)
- **Status:** open
- **Atualizado em:** 2026-02-23T20:37:32Z

## Definição do produto

## 1. Visão Geral

A funcionalidade de Gestão de Foguetes no Studio permite que administradores
consultem, criem, editem e removam foguetes disponíveis na loja em um fluxo
único de operação.

Ela resolve o problema de manutenção manual e fragmentada do catálogo de
foguetes, reduzindo inconsistências entre os dados do item (nome, preço,
aquisição padrão e seleção padrão) e os arquivos de imagem associados.

O objetivo principal desta entrega é **eficiência operacional** para o time
administrativo. Como esta página já está implementada, este PRD documenta o
comportamento funcional atual para alinhamento entre produto, design e
desenvolvimento. A métrica de sucesso permanece qualitativa, sem meta numérica
fixa nesta versão.

## 2. Requisitos

### [x] Listagem e Consulta de Foguetes

**Descrição:** Exibir catálogo administrativo de foguetes com busca, ordenação
por preço e paginação.

#### Regras de Negócio

- **Listagem paginada:** O sistema deve listar foguetes com controle de página e
  limite de itens por página.
- **Busca textual:** O administrador deve filtrar foguetes por termo de pesquisa.
- **Ordenação por preço:** Deve ser possível alternar entre ordem crescente e
  decrescente de preço.
- **Persistência de filtros na URL:** Busca, ordenação, página e limite devem
  ficar sincronizados com parâmetros de query.
- **Estado vazio:** Quando não houver resultados, o sistema deve exibir mensagem
  clara de lista vazia.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A tabela deve exibir nome, imagem, preço, adquirido por
  padrão, selecionado por padrão e ações.
- **Acessibilidade:** Busca, ordenação, paginação e ações devem ser navegáveis
  por teclado.
- **Feedback:** Durante carregamento, deve exibir estado de skeleton para a
  tabela.
- **Performance:** Mudanças de filtro e página devem ter resposta fluida para
  uso contínuo administrativo.
- **Segurança:** A visualização depende de sessão autenticada no Studio.
- **Confiabilidade:** Em falha de consulta, o sistema deve informar erro e
  preservar estado estável da tela.
- **Compatibilidade:** Comportamento consistente nos navegadores suportados.

### [x] Criação de Foguete

**Descrição:** Permitir cadastro de novo foguete com dados e imagem.

#### Regras de Negócio

- **Campos obrigatórios:** A criação deve exigir nome, imagem e preço.
- **Validação de nome:** O nome deve respeitar validações de entrada do domínio.
- **Validação de preço:** O preço deve ser numérico e maior ou igual a zero.
- **Definição de padrão:** O formulário deve permitir marcar se o foguete é
  adquirido por padrão e/ou selecionado por padrão.
- **Unicidade de selecionado padrão:** Se um foguete for criado como selecionado
  por padrão, o sistema deve manter somente um selecionado padrão no catálogo.
- **Atualização de listagem:** Após criação bem-sucedida, a tabela deve ser
  recarregada.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A criação deve ocorrer em diálogo com campos de nome,
  imagem, preço e checkboxes de padrão.
- **Acessibilidade:** O formulário deve permitir preenchimento e envio por
  teclado.
- **Feedback:** Exibir estado de envio e retorno de sucesso/erro após a ação.
- **Performance:** O envio deve responder em tempo adequado para fluxo
  operacional.
- **Segurança:** A criação deve ser validada no backend com autenticação e
  autorização administrativa.
- **Confiabilidade:** Em falha de criação, o sistema deve evitar resíduos de
  imagem não utilizada.
- **Compatibilidade:** Fluxo consistente nos navegadores suportados.

### [x] Edição de Foguete

**Descrição:** Permitir atualização de foguetes já cadastrados com
pré-preenchimento de dados.

#### Regras de Negócio

- **Pré-preenchimento:** Ao editar, o formulário deve carregar os dados atuais do
  foguete.
- **Identificação válida:** A atualização deve ocorrer apenas para foguete com ID
  válido.
- **Validação de campos:** Nome, imagem e preço devem seguir as mesmas regras da
  criação.
- **Regra de selecionado padrão:** Se o item for atualizado como selecionado por
  padrão, o sistema deve manter unicidade desse estado no catálogo.
- **Atualização de listagem:** Após sucesso, os dados atualizados devem aparecer
  na tabela.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A ação "Editar" deve abrir o formulário em modo de
  atualização.
- **Acessibilidade:** Campos e botões de edição devem ter navegação previsível
  por teclado.
- **Feedback:** Exibir mensagens de sucesso/erro e estado de envio durante a
  atualização.
- **Performance:** A atualização não deve bloquear a navegação principal da tela.
- **Segurança:** Edição protegida por autenticação e autorização administrativa.
- **Confiabilidade:** Em erro, o sistema deve manter consistência do estado
  persistido e da interface.
- **Compatibilidade:** Comportamento consistente nos navegadores suportados.

### [x] Exclusão de Foguete

**Descrição:** Permitir remoção de foguete com confirmação explícita para evitar
ações acidentais.

#### Regras de Negócio

- **Confirmação obrigatória:** A exclusão deve ocorrer apenas após confirmação do
  administrador.
- **Remoção de registro:** Com confirmação, o foguete deve ser removido do
  catálogo.
- **Tratamento de imagem associada:** Após exclusão bem-sucedida do item, o
  sistema deve tratar a remoção do arquivo de imagem correspondente.
- **Tratamento de falhas:** Em erro de exclusão, a operação deve ser interrompida
  e informada sem conclusão silenciosa.
- **Atualização de listagem:** Após exclusão bem-sucedida, a tabela deve ser
  recarregada.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A ação "Excluir" deve abrir diálogo com aviso de
  irreversibilidade.
- **Acessibilidade:** O modal deve permitir navegação por teclado entre cancelar
  e confirmar.
- **Feedback:** O sistema deve exibir retorno de sucesso/erro após a tentativa.
- **Performance:** A resposta da exclusão deve ser adequada ao uso operacional.
- **Segurança:** Exclusão validada no backend com autenticação e autorização.
- **Confiabilidade:** Erros não devem gerar inconsistência visual ou de dados na
  tabela.
- **Compatibilidade:** Fluxo consistente nos navegadores suportados.

### [x] Gestão de Imagem do Foguete

**Descrição:** Controlar upload, associação e limpeza de arquivos de imagem
durante criação e edição de foguetes.

#### Regras de Negócio

- **Upload em pasta dedicada:** As imagens devem ser enviadas para o diretório de
  foguetes no storage.
- **Validação de nome de arquivo:** O nome da imagem deve obedecer regras válidas
  do domínio.
- **Associação ao formulário:** O nome final do arquivo enviado deve ser
  persistido no campo de imagem do foguete.
- **Limpeza de upload descartado:** Ao fechar o diálogo sem concluir operação, o
  sistema deve tentar remover arquivo recém-enviado não utilizado.
- **Tratamento de erro de mídia:** Falhas de upload/remoção devem ser reportadas
  ao administrador.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** O formulário deve permitir upload e preview da imagem do
  foguete.
- **Acessibilidade:** O controle de upload deve ser operável por teclado e com
  rótulos claros.
- **Feedback:** Deve exibir estado de envio e mensagens de erro de validação de
  imagem.
- **Performance:** Upload e preview devem ocorrer sem degradar a experiência da
  página.
- **Segurança:** Upload/remoção deve ocorrer apenas em sessão autenticada.
- **Confiabilidade:** O fluxo deve minimizar arquivos órfãos após cancelamento ou
  falha.
- **Compatibilidade:** Operação consistente nos navegadores suportados.

## 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Consultar foguetes no catálogo administrativo.

1. O administrador acessa a página de Foguetes no Studio.
2. O administrador usa busca, ordenação por preço e paginação.
3. O sistema valida os parâmetros e executa consulta:
   - **Sucesso:** Exibe tabela atualizada com os itens correspondentes.
   - **Falha:** Exibe erro e mantém estado estável da tela.

**Nome do fluxo:** Criar foguete.

1. O administrador clica em "Criar foguete".
2. O administrador informa nome, imagem, preço e flags de padrão.
3. O sistema valida e processa criação:
   - **Sucesso:** Cadastra foguete, atualiza listagem e exibe confirmação.
   - **Falha:** Exibe mensagem de erro e não conclui cadastro inválido.

**Nome do fluxo:** Editar foguete.

1. O administrador aciona "Editar" em um item da tabela.
2. O sistema abre formulário com dados atuais do foguete.
3. O sistema valida e processa atualização:
   - **Sucesso:** Atualiza dados e reflete alteração na tabela.
   - **Falha:** Rejeita alteração inválida e informa erro.

**Nome do fluxo:** Excluir foguete.

1. O administrador clica em "Excluir" para um foguete.
2. O sistema abre diálogo de confirmação.
3. O administrador confirma e o sistema valida a operação:
   - **Sucesso:** Remove foguete da listagem e exibe feedback de sucesso.
   - **Falha:** Não remove item e informa erro ao administrador.

## 4. Fora do Escopo (Out of Scope)

- Gestão de avatares e insígnias na mesma interface de foguetes.
- Mudanças na experiência de compra/seleção de foguetes para usuário final na
  aplicação Web.
- Alterações de economia de StarCoins além da definição de preço de foguetes no
  catálogo administrativo.
- Mudanças estruturais de contratos REST e arquitetura de storage além do
  comportamento já implementado.
- Fluxos avançados de governança (aprovação em múltiplas etapas, versionamento
  histórico e agendamento de publicação).
