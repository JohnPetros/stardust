# Evidência visual — CA-27

Validação autenticada executada em 2026-08-11 contra `/space`, com viewport
`720×450` para `bTYzS` e `720×680` para `r6xBJD`/`hi2Ot`. As capturas Web
persistidas neste diretório são recortes do elemento `[role=dialog]`, evitando
que o chrome da aplicação altere a comparação.

| Node | Captura Web | Bounds do dialog | Anchors observados |
| --- | --- | --- | --- |
| `bTYzS` | `pencil-web-bTYzS-720x450.png` | `665×394` | título central, grade de três cards, CTA de histórico e rodapé Discord; sem clipping |
| `r6xBJD` | `pencil-web-r6xBJD-720x680.png` | `665×604`; conteúdo `619.56×525.98` | voltar/título à esquerda, filtro à direita, linhas em escala do frame e rodapé inferior |
| `hi2Ot` | `pencil-web-hi2Ot-720x680.png` | `665×604` | título do reporte, metadata, conversa, avatar do usuário, anexo e composer; sem clipping |

Os bounds foram coletados por `locator.boundingBox()` no mesmo run do
Playwright. A comparação deve ser feita contra os nodes canônicos do arquivo
`design/stardust.pen`; conteúdo dinâmico (quantidade de reportes, títulos,
mensagens e avatar) é classificado separadamente de geometria, conforme CA-27.

Respostas observadas no fluxo autenticado: unread `200`, histórico `200` e
detalhe `200`. O fluxo também registrou os warnings ambientais de renovação de
sessão `401` transitório e assets antigos do R2, sem falha do fluxo do diálogo.
