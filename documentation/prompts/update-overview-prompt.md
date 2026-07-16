---
description: Prompt para atualizar o overview do projeto com funcionalidades, status e links alinhados ao estado atual.
---

# Prompt: Atualização de Overview

**Objetivo:**
Manter atualizado o documento de visão geral do projeto (`documentation/overview.md`), garantindo que ele reflita com precisão o estado atual do software, incluindo funcionalidades planejadas, em desenvolvimento e concluídas.

**Entradas:**
1.  Milestones do GitHub usadas como PRDs e documentos técnicos relacionados.
2.  O arquivo atual `documentation/overview.md`.
3.  Estado atual da implementação (código fonte), se necessário para verificação de status.

**Regras Aplicáveis:**

Antes de atualizar o overview, leia:

- `documentation/rules/rules.md` — quando a visão geral mencionar camadas, apps ou responsabilidades técnicas.
- `documentation/rules/web-application-rules.md`, `documentation/rules/server-application-rules.md` e `documentation/rules/studio-appllication-rules.md` — quando a atualização descrever capacidades específicas desses apps.
- `documentation/rules/code-conventions-rules.md` — quando o overview mencionar padrões gerais de organização ou nomenclatura.

Não transforme o overview em documento de rules; use as rules apenas para evitar descrição técnica incorreta.

**Diretrizes de Execução:**

1.  **Análise de PRDs e Funcionalidades:**
    *   Examine milestones do GitHub usadas como PRDs e Specs disponíveis para identificar novas funcionalidades, módulos ou alterações de escopo. Os arquivos de spec terminam com a extensão `-spec.md`.
    *   Identifique funcionalidades que já foram implementadas mas não constam no overview.

2.  **Atualização do Documento:**
    *   **Funcionalidades:** Adicione ou atualize a lista de funcionalidades/módulos, descrevendo brevemente cada uma.
    *   **Status:** Atualize o status das funcionalidades (ex: Planejado, Em Progresso, Concluído) conforme a realidade do projeto.
    *   **Arquitetura:** Se houver mudanças arquiteturais significativas mencionadas nos PRDs ou implementadas, reflita-as na seção apropriada do overview.

3.  **Manutenção de Links:**
    *   Certifique-se de que o overview contenha links válidos para os PRDs correspondentes, facilitando a navegação.

4.  **Formatação:**
    *   Mantenha a consistência visual e estrutural com o restante do documento (cabeçalhos, listas, tabelas).
