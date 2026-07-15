---
description: Prompt para atualizar o documento de arquitetura com base em PRDs, specs, rules e mudancas no codigo.
---

# Prompt: Atualizar documento de arquitetura

**Objetivo:**
Manter atualizado o documento de arquitetura do projeto (`documentation/architecture.md`), garantindo que ele reflita fielmente as decisões estruturais, padrões de design, tecnologias adotadas e a organização do código.

**Entradas:**
1.  Documentos de Requisitos de Produto (PRDs) e Especificações Técnicas (Specs).
    *   *Nota:* todos os arquivos de Spec possuem a extensão `-spec.md`.
2.  Documentos de regras de arquitetura e camada.
    *   Exemplo: `documentation/rules/rules.md`, `documentation/rules/ui-layer-rules.md`, `documentation/rules/core-package-rules.md`.
3.  Alterações significativas no código fonte (novas camadas, refatorações, introdução de pacotes).
4.  O arquivo atual `documentation/architecture.md`.

**Regras Aplicáveis:**

Antes de editar a arquitetura, leia:

- `documentation/rules/rules.md` — índice de regras por camada.
- Rules das camadas impactadas pela mudança arquitetural.
- `documentation/rules/code-conventions-rules.md` — quando a atualização mencionar padrões de nomeação, factories, eventos, erros ou organização.

Se a arquitetura e uma rule específica divergirem, registre a divergência e atualize ambos os documentos no mesmo fluxo.

**Diretrizes de Execução:**

1.  **Análise de Impacto:**
    *   **PRDs/Specs:** Avalie se introduzem novos domínios, componentes ou necessidades tecnológicas.
    *   **Rules:** Verifique se novas regras alteram padrões arquiteturais existentes (ex: nova forma de tratar erros, nova estrutura de pastas obrigatória).
    *   **Código:** Verifique se as mudanças no código respeitam os limites definidos na arquitetura atual ou se exigem uma atualização da documentação (evolução da arquitetura).

2.  **Atualização de Seções Críticas:**
    *   **Visão Geral e Diagramas:** Atualize os diagramas ASCII se houver mudanças no fluxo de dados ou relação entre camadas.
    *   **Módulos de Domínio:** Adicione novos módulos ou atualize os DTOs listados na tabela de contextos delimitados.
    *   **Stack Tecnológica:** Mantenha as versões das dependências atualizadas conforme o `pubspec.yaml` e documente novas bibliotecas chave.
    *   **Camadas (UI, Core, Rest, Banco de Dados, RPC etc):** Reflita mudanças na estrutura de pastas ou responsabilidades de cada camada. Se novos padrões forem adotados (ex: mudou de MVP para MVVM), atualize as explicações e exemplos de código.
    *   **Estrutura de Diretórios:** Mantenha a árvore de diretórios no final do documento sincronizada com a realidade do projeto.

3.  **Validação de Consistência:**
    *   Garanta que os exemplos de código no documento de arquitetura compilem ou sejam sintaticamente corretos e representativos do código real.
    *   Verifique se as "Armadilhas a Evitar" ainda são relevantes ou se novas lições aprendidas devem ser adicionadas.
