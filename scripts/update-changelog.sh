#!/bin/bash

# Define o arquivo CHANGELOG
CHANGELOG_FILE="CHANGELOG.md"

# Obtém a data atual
CURRENT_DATE=$(date +%Y-%m-%d)

# Obtém a última versão do package.json para usar como título da nova seção
# Verifica se o package.json existe e lê a versão, caso contrário, usa uma versão padrão
if [ -f "package.json" ]; then
    VERSION=$(node -p "require('./package.json').version")
else
    echo "Aviso: package.json não encontrado. Usando '0.0.0' como versão padrão."
    VERSION="0.0.0" # Versão padrão se package.json não existir
fi

# --- Função para obter commits ---
# Esta função pega os commits desde a última tag, ou um número fixo de commits.
# Prioriza commits entre a última tag e HEAD. Se não houver tags, pega os últimos 20 commits.
get_commits_for_changelog() {
    # Verifica se há tags no repositório
    if git rev-parse --verify --quiet HEAD~1 >/dev/null; then
        LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)
        if [ -n "$LAST_TAG" ]; then
            # Pega os commits desde a última tag até HEAD
            git log "$LAST_TAG"..HEAD --pretty=format:"* %s (%h)" --no-merges
        else
            # Se não houver tags, pega os últimos 20 commits
            git log -20 --pretty=format:"* %s (%h)" --no-merges
        fi
    else
        # Se não houver commits suficientes para uma tag, ou se for um repo novo, pegue todos
        git log --pretty=format:"* %s (%h)" --no-merges
    fi
}

# Obtém a lista formatada de commits
COMMITS_LIST=$(get_commits_for_changelog)

# Verifica se a lista de commits está vazia
if [ -z "$COMMITS_LIST" ]; then
    echo "Nenhum novo commit encontrado para a versão $VERSION. CHANGELOG não atualizado."
    exit 0
fi

# Formata a nova entrada do CHANGELOG
# Adiciona linhas em branco para melhor separação visual no Markdown
# Usamos "printf %b" para interpretar sequências de escape como \n
NEW_CHANGELOG_ENTRY=$(printf "%b" "\n## $VERSION ($CURRENT_DATE)\n\n$COMMITS_LIST\n")

# Verifica se o arquivo CHANGELOG existe
if [ ! -f "$CHANGELOG_FILE" ]; then
    echo "# Changelog" > "$CHANGELOG_FILE"
    echo "Arquivo $CHANGELOG_FILE criado com cabeçalho inicial."
fi

# Usa um arquivo temporário para maior compatibilidade e segurança
# Isso evita problemas com 'sed -i' entre Linux e macOS
TEMP_CHANGELOG=$(mktemp)

# Copia a primeira linha (o título)
head -n 1 "$CHANGELOG_FILE" > "$TEMP_CHANGELOG"

# Adiciona a nova entrada abaixo do título
echo -e "$NEW_CHANGELOG_ENTRY" >> "$TEMP_CHANGELOG"

# Adiciona o restante do arquivo original (do 2º parágrafo em diante)
tail -n +2 "$CHANGELOG_FILE" >> "$TEMP_CHANGELOG"

# Substitui o arquivo original pelo temporário
mv "$TEMP_CHANGELOG" "$CHANGELOG_FILE"

echo "CHANGELOG.md atualizado com a versão $VERSION e commits."
echo -e "$NEW_CHANGELOG_ENTRY"