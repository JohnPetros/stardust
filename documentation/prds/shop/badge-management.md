# PRD — Gestão de Insígnias

- **Módulo:** `shop`
- **Milestone:** [#8 — Gestão de Insígnias](https://github.com/JohnPetros/stardust/milestone/8)
- **Status:** open
- **Atualizado em:** 2026-02-23T20:33:15Z

## Definição do produto

## 1. Visão Geral

A funcionalidade de Gestão de Insígnias no Studio permite que administradores
cadastrem, atualizem, listem e removam insígnias disponíveis na loja.

Ela resolve o problema de gestão descentralizada do catálogo de permissões
cosméticas/funcionais da plataforma, reduzindo inconsistências entre metadados
de insígnias (nome, preço, papel) e os arquivos de imagem associados.

O objetivo principal desta entrega é **eficiência operacional** para o time
administrativo. Como a página já está implementada, este PRD documenta o
comportamento funcional atual para alinhamento entre produto, design e
desenvolvimento. A métrica de sucesso permanece qualitativa, sem meta numérica
rígida nesta versão.

## 2. Requisitos

### [x] Listagem de Insígnias

**Descrição:** Exibir todas as insígnias cadastradas em formato tabular para
operação administrativa.

#### Regras de Negócio

- **Listagem completa:** O sistema deve consultar e exibir todas as insígnias
  disponíveis no catálogo administrativo.
- **Dados mínimos por item:** Cada linha deve conter imagem, nome, preço e role
  da insígnia.
- **Estado vazio:** Quando não houver insígnias cadastradas, deve ser exibida
  mensagem explícita de ausência de dados.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A tabela deve apresentar colunas de imagem, nome, preço,
  role e ações.
- **Acessibilidade:** Ações de criação, edição e exclusão devem ser navegáveis
  por teclado.
- **Feedback:** Durante carregamento da listagem, deve exibir estado de loading.
- **Performance:** A listagem deve responder de forma fluida para uso contínuo
  administrativo.
- **Segurança:** A visualização depende de sessão autenticada no Studio.
- **Confiabilidade:** Em falha de consulta, o sistema deve informar erro e manter
  estado estável da tela.
- **Compatibilidade:** Comportamento consistente nos navegadores suportados.

### [x] Criação de Insígnia

**Descrição:** Permitir cadastro de nova insígnia com formulário dedicado e
upload de imagem.

#### Regras de Negócio

- **Campos obrigatórios:** A criação deve exigir nome, imagem, preço e role.
- **Validação de nome:** O nome deve respeitar validações de entrada de texto.
- **Validação de preço:** O preço deve ser numérico e maior ou igual a zero.
- **Role permitido:** O role da insígnia deve obedecer os valores válidos do
  domínio.
- **Unicidade de role:** Não deve ser permitido cadastrar duas insígnias com o
  mesmo role.
- **Atualização de listagem:** Após criação bem-sucedida, a tabela deve ser
  recarregada com o novo item.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A criação deve ocorrer via diálogo com campos de nome,
  imagem, preço e seleção de papel.
- **Acessibilidade:** Formulário deve permitir preenchimento e envio completo por
  teclado.
- **Feedback:** Exibir retorno de sucesso e erro após tentativa de criação.
- **Performance:** Envio de formulário deve responder em tempo adequado para uso
  operacional.
- **Segurança:** A criação deve ser validada no backend para usuário
  autenticado/autorizado.
- **Confiabilidade:** Em falha de criação, não deve haver inconsistência entre
  registro e imagem associada.
- **Compatibilidade:** Fluxo de criação deve funcionar de forma consistente nos
  navegadores suportados.

### [x] Edição de Insígnia

**Descrição:** Permitir atualização de insígnias existentes com
pré-preenchimento do formulário.

#### Regras de Negócio

- **Pré-preenchimento:** Ao abrir edição, o formulário deve carregar dados atuais
  da insígnia.
- **Identificação do item:** A atualização deve ser aplicada à insígnia
  identificada pelo seu ID.
- **Validação de campos:** Nome, imagem, preço e role devem respeitar as mesmas
  regras da criação.
- **Regra de unicidade:** Atualização que conflite role já existente deve ser
  recusada.
- **Atualização de listagem:** Após sucesso, os dados atualizados devem aparecer
  imediatamente na tabela.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A ação "Editar" deve abrir o formulário em modo de
  edição.
- **Acessibilidade:** Campos e botões de edição devem manter navegação
  previsível por teclado.
- **Feedback:** Exibir mensagens de sucesso/erro e estado de envio durante a
  atualização.
- **Performance:** Atualizações não devem degradar a navegação geral da página.
- **Segurança:** Edição validada em backend com autenticação/autorização.
- **Confiabilidade:** Em erro, manter consistência do estado persistido e da
  interface.
- **Compatibilidade:** Fluxo de edição consistente nos navegadores suportados.

### [x] Exclusão de Insígnia

**Descrição:** Permitir remoção de insígnia com confirmação explícita para
prevenir exclusões acidentais.

#### Regras de Negócio

- **Confirmação obrigatória:** A exclusão só deve ocorrer após confirmação do
  administrador.
- **Remoção de registro:** Ao confirmar, a insígnia deve ser removida do
  catálogo.
- **Tratamento de imagem associada:** O fluxo deve tratar remoção/consistência do
  arquivo de imagem relacionado ao item excluído.
- **Tratamento de falhas:** Em falha, a operação deve ser interrompida com
  mensagem clara, sem conclusão silenciosa.
- **Atualização de listagem:** Após exclusão bem-sucedida, a tabela deve refletir
  a remoção.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** A ação "Excluir" deve abrir diálogo de confirmação com
  aviso de irreversibilidade.
- **Acessibilidade:** O modal deve permitir navegação por teclado entre cancelar
  e confirmar.
- **Feedback:** Exibir retorno de sucesso/erro após a tentativa de exclusão.
- **Performance:** A resposta da operação deve ser adequada para fluxo
  administrativo.
- **Segurança:** Exclusão protegida por autenticação e autorização no backend.
- **Confiabilidade:** Erros não devem causar estado inconsistente na tabela.
- **Compatibilidade:** Comportamento consistente nos navegadores suportados.

### [x] Gestão de Imagem da Insígnia

**Descrição:** Controlar upload e limpeza de arquivos de imagem no fluxo de
criação/edição de insígnias.

#### Regras de Negócio

- **Upload em pasta dedicada:** Imagens de insígnias devem ser enviadas para o
  diretório de storage específico de insígnias.
- **Validação de nome de arquivo:** O nome da imagem deve obedecer regras de
  validação de entrada do domínio.
- **Associação ao formulário:** O nome final do arquivo enviado deve ser
  persistido no campo de imagem da insígnia.
- **Limpeza de arquivo descartado:** Se o diálogo for fechado sem conclusão, o
  sistema deve tentar remover upload recém-realizado não utilizado.
- **Tratamento de erro de mídia:** Erros de upload/remoção devem ser reportados
  ao administrador.

#### Regras de UI/UX (se houver)

- **Elemento Visual:** O formulário deve permitir upload e preview da imagem da
  insígnia.
- **Acessibilidade:** Controle de upload deve ser utilizável por teclado e com
  rótulos claros.
- **Feedback:** Informar estado de envio e erros de validação de imagem.
- **Performance:** Upload e preview devem manter experiência fluida.
- **Segurança:** Upload/remoção de arquivos deve ocorrer apenas em sessão
  autenticada.
- **Confiabilidade:** O fluxo deve minimizar arquivos órfãos após cancelamento ou
  falha.
- **Compatibilidade:** Operação consistente de upload nos navegadores suportados.

## 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Listar e consultar insígnias.

1. O administrador acessa a página de Insígnias no Studio.
2. O sistema consulta o catálogo e exibe tabela com imagem, nome, preço e role.
3. O sistema valida o retorno da consulta:
   - **Sucesso:** Dados são exibidos normalmente.
   - **Falha:** Mensagem de erro é exibida e a tela mantém estado estável.

**Nome do fluxo:** Criar insígnia.

1. O administrador clica em "Criar insígnia".
2. O administrador preenche nome, imagem, preço e papel da insígnia.
3. O sistema valida os dados e processa a criação:
   - **Sucesso:** Insígnia é criada, lista é atualizada e feedback de sucesso é
     exibido.
   - **Falha:** Sistema exibe erro de validação/negócio e não cria o item.

**Nome do fluxo:** Editar insígnia.

1. O administrador aciona "Editar" em uma linha da tabela.
2. O sistema abre formulário com valores pré-preenchidos.
3. O sistema valida e processa atualização:
   - **Sucesso:** Dados da insígnia são atualizados e refletidos na tabela.
   - **Falha:** Alterações inválidas são rejeitadas com mensagem de erro.

**Nome do fluxo:** Excluir insígnia.

1. O administrador clica em "Excluir" para uma insígnia.
2. O sistema abre diálogo de confirmação.
3. O administrador confirma a exclusão e o sistema valida a operação:
   - **Sucesso:** Item é removido da listagem com feedback de sucesso.
   - **Falha:** Exclusão não é concluída e o sistema informa o erro.

## 4. Fora do Escopo (Out of Scope)

- Gestão de avatares e foguetes na mesma interface de insígnias.
- Alterações no comportamento de compra de insígnias para usuário final na Web.
- Criação de novos tipos de role fora dos valores atualmente suportados pelo
  domínio.
- Mudanças de arquitetura de storage, autenticação ou contratos REST além do que
  já está implementado.
- Fluxos avançados de governança editorial (aprovação em múltiplos níveis,
  agendamento de publicação e versionamento histórico de catálogo).
