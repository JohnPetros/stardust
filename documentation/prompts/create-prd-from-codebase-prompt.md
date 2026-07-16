---
description: Criar um PRD retrospectivo a partir de um exemplo, da documentacao existente e do comportamento observado na codebase.
---

# Prompt: Criar PRD Retrospectivo a partir da Codebase

**Objetivo:** Criar um PRD completo para a feature `{NOME_DA_FEATURE}`,
seguindo o estilo e a granularidade de um exemplo fornecido, auditando a
documentacao e a codebase para descrever o comportamento real de produto. O PRD
gerado deve ser adequado para uso como conteudo de uma milestone do GitHub.

**Entrada:**

- Nome da feature: `{NOME_DA_FEATURE}`.
- Caminho ou conteudo de um PRD de exemplo: `{CAMINHO_OU_CONTEUDO_DO_EXEMPLO}`.
- Caminhos opcionais de documentacao relacionada: `{DOCUMENTACAO_RELACIONADA}`.
- Termos de busca relacionados ao dominio da feature: `{TERMOS_DE_BUSCA}`.
- Milestone, issue ou referencia oficial de produto, quando houver:
  `{REFERENCIA_DE_PRODUTO}`.
- Preferencias explicitas do usuario, como incluir componentes especificos
  (`SolutionEditor`, modais, widgets, fluxos administrativos ou telas dedicadas).

**Diretrizes de Execucao:**

1. **Validacao inicial e modo de trabalho**
   - Leia o exemplo informado antes de escrever qualquer PRD.
   - Identifique se a feature ja existe na codebase.
   - Se a feature nao existir ou depender de decisao futura de produto, trate como
     PRD prospectivo e faca perguntas antes de escrever.
   - Se a feature ja existir, trate como PRD retrospectivo e use a codebase como
     evidencia principal quando nao houver milestone informada.

2. **Levantamento de contexto**
   - Consulte PRDs, specs, bug reports, plans, issues e documentos relacionados em
     `documentation/`.
   - Busque referencias na codebase usando termos do dominio, nomes de entidades,
     rotas, widgets, stores, hooks, services, controllers, actions e testes.
   - Leia o diff/conteudo dos arquivos relevantes; nao classifique a feature
     apenas por nome de arquivo ou pasta.
   - Quando houver milestone do GitHub, trate a milestone como referencia oficial
     de produto.

3. **Auditoria da implementacao**
   - Mapeie entidades e dados expostos ao usuario.
   - Mapeie permissoes, bloqueios, validacoes, estados vazios, erros, loading,
     navegacao, responsividade e feedback visual.
   - Mapeie superficies de produto, como listagem, detalhe, criacao, edicao,
     remocao, filtros, ordenacao, metricas, comentarios, acoes sociais e fluxos
     administrativos.
   - Inclua explicitamente componentes ou subfeatures nomeadas pelo usuario quando
     fizerem parte do comportamento de produto.
   - Transforme comportamento tecnico em requisito de produto. Exemplo:
     `viewSolution()` deve virar "abrir uma solucao registra uma visualizacao".

4. **Agrupamento de requisitos**
   - Agrupe por responsabilidade semantica de produto, nao por camada tecnica.
   - Cada requisito deve ter um ID rastreavel (`REQ-01`, `REQ-02`, ...).
   - Separe regras de negocio de regras de UI/UX.
   - Nao invente requisitos. Quando uma informacao for incerta, registre como
     "Assuncao" ou "Nao confirmado".

5. **Escrita do PRD**
   - Escreva em portugues.
   - Use linguagem de produto e comportamento observavel.
   - Evite detalhes internos de arquitetura, exceto quando uma limitacao tecnica
     afetar diretamente o comportamento documentado.
   - Preserve a granularidade, tom e organizacao do exemplo informado.
   - O PRD deve poder ser copiado integralmente para a descricao de uma milestone
     do GitHub.

6. **Checagem final**
   - Confirme que todas as superficies relevantes da feature foram cobertas.
   - Confirme que os fluxos incluem caminho feliz, bloqueios e falhas relevantes.
   - Confirme que o fora do escopo evita scope creep.
   - Se a milestone for criada ou atualizada, use o conteudo completo do PRD na
     descricao, nao apenas um link para o arquivo.

**Template de Saida (Estrutura Obrigatoria):**

```md
# PRD - {NOME_DA_FEATURE}

**Referencia de produto:** {REFERENCIA_DE_PRODUTO ou "Nao informada"}

---

### 1. Visao Geral

O **{NOME_DA_FEATURE}** e ...

**Objetivo:** ...

**Problema resolvido:** ...

**Valor entregue:** ...

---

### 2. Requisitos

#### REQ-01 {Nome do Requisito}

- [ ] **{Nome do Requisito}**

**Descricao:** ...

##### Regras de Negocio

- **{Nome da regra}:** ...
- **{Nome da regra}:** ...

##### Regras de UI/UX

- **{Elemento ou comportamento}:** ...
- **Responsividade:** ...
- **Feedback:** ...
- **Acessibilidade:** ...
- **Confiabilidade:** ...

---

#### REQ-02 {Nome do Requisito}

- [ ] **{Nome do Requisito}**

**Descricao:** ...

##### Regras de Negocio

- **{Nome da regra}:** ...

##### Regras de UI/UX

- **{Elemento ou comportamento}:** ...

---

### 3. Fluxo de Usuario (User Flow)

**Fluxo A - {Nome do fluxo}**

1. O usuario acessa ...
2. O sistema exibe ...
3. O usuario realiza ...
4. O sistema valida ...
   - **Sucesso:** ...
   - **Falha:** ...

**Fluxo B - {Nome do fluxo alternativo}**

1. ...

---

### 4. Fora do Escopo (Out of Scope)

- ...
- ...

#### Descartado durante a implementacao

- **Nao identificado:** a auditoria da codebase nao encontrou registro formal de
  comportamentos considerados e descartados durante a implementacao desta
  feature.
```

**Regras:**

- Use front matter apenas no arquivo do prompt, nao no PRD gerado, salvo se o
  usuario pedir explicitamente.
- Nao escreva PRD sem ler o exemplo informado.
- Nao invente comportamento nao observado na milestone, documentacao, codebase ou
  confirmacao explicita do usuario.
- Nao trate detalhes de implementacao como requisito, a menos que afetem
  diretamente o comportamento de produto.
- Nao omita fluxos de bloqueio, erro, loading, estados vazios e permissoes.
- Se a feature incluir um editor especifico, uma pagina dedicada ou um componente
  nomeado pelo usuario, inclua isso explicitamente nos requisitos.
- Se nao houver milestone, escreva `**Referencia de produto:** Nao informada`.
- Se houver milestone e implementacao, registre divergencias apenas quando houver
  conflito claro entre a referencia oficial e o comportamento observado.
- Quando solicitado a criar milestone, use `gh` ou API estruturada e coloque o
  PRD completo na descricao da milestone.
