# Prompt: Atualizar documento de arquitetura

**Objetivo:**
Manter atualizado o documento de arquitetura do projeto (`documentation/architecture.md`), garantindo que ele reflita fielmente as decisões estruturais, padrões de design, tecnologias adotadas e a organização do código.

**Entradas:**
1.  Documentos de Requisitos de Produto (PRDs) e Especificações Técnicas (Specs).
    *   *Nota:* todos os arquivos de Spec possuem a extensão `-spec.md`.
2.  Documentos de Diretrizes (Guidelines).
    *   Exemplo: `documentation/*-guidelines.md` (como `ui-layer-guidelines.md`, `core-layer-guidelines.md`, etc.).
3.  Alterações significativas no código fonte (novas camadas, refatorações, introdução de pacotes).
4.  O arquivo atual `documentation/architecture.md`.

**Diretrizes de Execução:**

1.  **Análise de Impacto:**
    *   **PRDs/Specs:** Avalie se introduzem novos domínios, componentes ou necessidades tecnológicas.
    *   **Guidelines:** Verifique se novas diretrizes alteram padrões arquiteturais existentes (ex: nova forma de tratar erros, nova estrutura de pastas obrigatória).
    *   **Código:** Verifique se as mudanças no código respeitam os limites definidos na arquitetura atual ou se exigem uma atualização da documentação (evolução da arquitetura).

2.  **Atualização de Seções Críticas:**
    *   **Visão Geral e Diagramas:** Atualize os diagramas ASCII se houver mudanças no fluxo de dados ou relação entre camadas.
    *   **Módulos de Domínio:** Adicione novos módulos ou atualize os DTOs listados na tabela de contextos delimitados.
    *   **Stack Tecnológica:** Mantenha as versões das dependências atualizadas conforme o `pubspec.yaml` e documente novas bibliotecas chave.
    *   **Camadas (UI, Core, Rest, Drivers):** Reflita mudanças na estrutura de pastas ou responsabilidades de cada camada. Se novos padrões forem adotados (ex: mudou de MVP para MVVM), atualize as explicações e exemplos de código.
    *   **Estrutura de Diretórios:** Mantenha a árvore de diretórios no final do documento sincronizada com a realidade do projeto.

3.  **Validação de Consistência:**
    *   Garanta que os exemplos de código no documento de arquitetura compilem ou sejam sintaticamente corretos e representativos do código real.
    *   Verifique se as "Armadilhas a Evitar" ainda são relevantes ou se novas lições aprendidas devem ser adicionadas.

