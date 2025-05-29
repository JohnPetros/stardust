#!/bin/bash

replace_imports_in_directory() {
  local dir="$1"
  local dir_name="$2"
  
  if [ -d "$dir" ]; then
    echo "Replacing imports in $dir_name build directory..."
    find "$dir" -type f -name "*.js" | while read -r file; do
      echo "Processing file: $file"
      
      # Replace CommonJS requires from @stardust/core
      sed -i 's/require("@stardust\/core\/[^"]*")/require("@stardust\/core")/g' "$file"
      sed -i "s/require('@stardust\/core\/[^']*')/require('@stardust\/core')/g" "$file"
      
      # Replace ES6 imports from @stardust/core
      sed -i 's/from "@stardust\/core\/[^"]*"/from "@stardust\/core"/g' "$file"
      sed -i "s/from '@stardust\/core\/[^']*'/from '@stardust\/core'/g" "$file"
      
      # Replace CommonJS requires from @stardust/validation
      sed -i 's/require("@stardust\/validation\/[^"]*")/require("@stardust\/validation")/g' "$file"
      sed -i "s/require('@stardust\/validation\/[^']*')/require('@stardust\/validation')/g" "$file"
      
      # Replace ES6 imports from @stardust/validation
      sed -i 's/from "@stardust\/validation\/[^"]*"/from "@stardust\/validation"/g' "$file"
      sed -i "s/from '@stardust\/validation\/[^']*'/from '@stardust\/validation'/g" "$file"
      
      # Handle var assignments with requires
      sed -i 's/= require("@stardust\/core\/[^"]*")/= require("@stardust\/core")/g' "$file"
      sed -i "s/= require('@stardust\/core\/[^']*')/= require('@stardust\/core')/g" "$file"
      sed -i 's/= require("@stardust\/validation\/[^"]*")/= require("@stardust\/validation")/g' "$file"
      sed -i "s/= require('@stardust\/validation\/[^']*')/= require('@stardust\/validation')/g" "$file"
    done
    echo "✓ Done replacing imports in $dir_name build directory"
  else
    echo "✗ $dir_name build directory not found at $dir"
  fi
}

echo "🔍 Starting import replacements..."

echo "\n📁 Checking apps directories..."
for app_dir in apps/*/; do
  if [ -d "$app_dir" ]; then
    app_name=$(basename "$app_dir")
    build_dir="${app_dir}build"
    if [ -d "$build_dir" ]; then
      replace_imports_in_directory "$build_dir" "apps/$app_name"
    fi
  fi
done

echo "\n📦 Checking packages directories..."
for pkg_dir in packages/*/; do
  if [ -d "$pkg_dir" ]; then
    pkg_name=$(basename "$pkg_dir")
    build_dir="${pkg_dir}build"
    if [ -d "$build_dir" ]; then
      replace_imports_in_directory "$build_dir" "packages/$pkg_name"
    fi
  fi
done

echo "\n✨ All import replacements completed!"