# Endpoint de Busca por Embeddings

## Objetivo

Implementar a rota/controller para fazer busca inteligente por embeddings.

status: Em progresso

## Camada Core

- Use case `SearchEmbeddingsUseCase`.

## Camada REST

### Controller `SearchEmbeddingsController`

- método GET `/storage/embeddings/search`
- queryParams: `query` (string), `namespace` (string), `topK` (number)
- Status Code: 200
- Response: array de strings

### EmbeddingsStorageRouter

- path: `/storage/embeddings`
- Registre-o no StorageRouter
- Use UpstashEmbeddingsStorageProvider e VercelEmbeddingsGeneratorProvider como
  providers para o use case
