# PRD — Seleção e Gestão de Imagens de Lição

- **Módulo:** `lesson`
- **Milestone:** [#32 — Seleção e Gestão de Imagens de Lição](https://github.com/JohnPetros/stardust/milestone/32)
- **Status:** open
- **Atualizado em:** 2026-05-27T19:13:59Z

## Definição do produto

# PRD: Upload Assinado para Imagens Administrativas e Screenshots de Feedback

## 1. Visao Geral
O produto agora concentra o upload de imagens em um fluxo de URL assinada com upload direto ao Supabase Storage. Isso cobre tanto a gestao administrativa de imagens de licao no Studio quanto o envio opcional de screenshots no widget de feedback do Web, reduzindo trafego binario pelo backend e mantendo controles de permissao por contexto.

## 2. Requisitos Entregues
- [x] Selecionar imagem existente do acervo `story` em historias e quizzes.
- [x] Pesquisar imagens por nome dentro do acervo `story`.
- [x] Paginar o acervo com carga inicial mais leve: `12` imagens por pagina.
- [x] Pre-carregar thumbnails apos a primeira pagina para melhorar a performance percebida.
- [x] Enviar nova imagem para o acervo `story` com URL assinada e upload direto ao Supabase Storage.
- [x] Validar `folderPath`, `fileName`, extensao permitida e conflito de nome antes da emissao da URL assinada.
- [x] Limitar uploads de imagem do Studio a `5 MB`.
- [x] Atualizar o acervo apos upload e apos remocao.
- [x] Selecionar automaticamente a imagem recem-enviada.
- [x] Manter `panda.jpg` como fallback quando a imagem obrigatoria estiver ausente ou quando a imagem selecionada for removida.
- [x] Permitir remocao de imagens diretamente do acervo com o dialog preservado.
- [x] Copiar o nome da imagem a partir do card do acervo.
- [x] Permitir screenshot opcional no feedback do Web com upload direto ao Supabase Storage antes do envio do formulario.
- [x] Preservar o texto do feedback quando a emissao da URL assinada ou o upload da screenshot falharem.
- [x] Autorizar `POST /storage/signed-upload-url` para usuarios autenticados comuns apenas em `images/feedback-reports`.
- [x] Manter `god account` obrigatorio para uploads assinados nas demais pastas administrativas.
- [x] Padronizar o Studio para o mesmo fluxo tecnico do Web: service REST emite a URL assinada e provider client-side envia o binario.
- [x] Remover o endpoint legado publico `POST /storage/files/:folder` apos a migracao de Web e Studio.
- [x] Preservar upload server-side interno para fluxos administrativos e operacionais que ainda dependem de `FileStorageProvider.upload(...)`.

## 3. Regras de Negocio Consolidadas
- O acervo administrativo de licao continua restrito a pasta `story`.
- Screenshots de feedback usam a pasta `images/feedback-reports` e aceitam apenas extensoes de imagem suportadas pelo dominio.
- O backend usa o `fileName` informado e validado como nome final do arquivo.
- O sistema bloqueia emissao de URL assinada quando ja existe arquivo com o mesmo nome na pasta de destino.
- Uploads administrativos continuam protegidos por permissao de `god account`.
- O feedback nao deve ser enviado com screenshot invalida, `data:` URL ou base64 persistido.

## 4. Fora do Escopo
- Renomeacao de imagens ja cadastradas.
- Organizacao do acervo por tags, categorias ou novas pastas.
- Bloqueio de remocao para imagens em uso.
- Alterar o fluxo funcional de envio do feedback sem screenshot.
- Alterar bucket, schema, RLS ou estrutura de banco para storage.

## 5. Resultado de Produto
A plataforma passa a operar com um fluxo de upload mais seguro, mais leve para o backend e consistente entre Studio e Web. Para o time administrativo, a gestao de imagens continua com a mesma experiencia principal. Para usuarios autenticados, o feedback com screenshot fica mais resiliente e nao corre o risco de persistir anexos invalidos no sistema.
