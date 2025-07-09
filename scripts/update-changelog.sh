#!/bin/bash

# Define o arquivo CHANGELOG
CHANGELOG_FILE="CHANGELOG.md"

# Obtém a data atual
CURRENT_DATE=$(date +%Y-%m-%d)

# Obtém a última versão (tag) do package.json para usar como título da nova seção
# Ou defina uma versão fixa se preferir
# Ex: VERSION="0.1.3"
VERSION=$(node -p "require('./package.json').version")

# --- Função para obter commits ---
# Esta função pega os commits desde a última tag, ou um número fixo de commits
# Se não houver tags, ele pega os últimos 20 commits, ajuste conforme necessário
get_commits_for_changelog() {
    # Verifica se há tags no repositório
    if git rev-parse --verify --quiet HEAD~1 >/dev/null; then
        # Obtém a última tag
        LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)
        if [ -n "$LAST_TAG" ]; then
            # Se houver uma tag, pega os commits desde a última tag até HEAD
            git log "$LAST_TAG"..HEAD --pretty=format:"* %s (%h)" --no-merges
        else
            # Se não houver tags, pega os últimos 20 commits
            git log -20 --pretty=format:"* %s (%h)" --no-merges
        fi
    else
        # Se não houver commits suficientes para uma tag, pegue todos
        git log --pretty=format:"* %s (%h)" --no-merges
    fi
}

# Obtém a lista formatada de commits
COMMITS_LIST=$(get_commits_for_changelog)

# Verifica se a lista de commits está vazia
if [ -z "$COMMITS_LIST" ]; then
    echo "Nenhum novo commit encontrado desde a última tag ou nos últimos commits. CHANGELOG não atualizado."
    exit 0
fi

# Formata a nova entrada do CHANGELOG
# Adiciona uma linha em branco para melhor separação visual no Markdown
NEW_CHANGELOG_ENTRY="\n## $VERSION ($CURRENT_DATE)\n\n$COMMITS_LIST\n"

# Verifica se o arquivo CHANGELOG existe
if [ ! -f "$CHANGELOG_FILE" ]; then
    echo "# Changelog" > "$CHANGELOG_FILE"
    echo "Arquivo $CHANGELOG_FILE criado."
fi

# Insere a nova entrada após a primeira linha do arquivo (o título "# Changelog")
# O '1a\' no sed significa "adicionar após a primeira linha"
sed -i "1a\\$NEW_CHANGELOG_ENTRY" "$CHANGELOG_FILE"

echo "CHANGELOG.md atualizado com a versão $VERSION e commits."
echo -e "$NEW_CHANGELOG_ENTRY"

# Remove o arquivo temporário criado pelo sed se for o caso (Linux)
# Para macOS, o sed -i '' cria um backup, então o comando seria diferente:
# sed -i '' "1a\\$NEW_CHANGELOG_ENTRY" "$CHANGELOG_FILE"
# Se você usa macOS, remova o '-i' ou use '-i ""'