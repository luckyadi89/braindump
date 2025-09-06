#!/bin/bash

# BrainDump Rebranding Script
# Usage: ./rebrand.sh "NewAppName" "newdomain.com"

NEW_APP_NAME="$1"
NEW_DOMAIN="$2"

if [ -z "$NEW_APP_NAME" ] || [ -z "$NEW_DOMAIN" ]; then
    echo "Usage: ./rebrand.sh 'NewAppName' 'newdomain.com'"
    echo "Example: ./rebrand.sh 'VoiceNotes' 'voicenotes.ai'"
    exit 1
fi

echo "🚀 Rebranding app to: $NEW_APP_NAME"
echo "🌐 New domain: $NEW_DOMAIN"
echo ""

# Update package.json
echo "📦 Updating package.json..."
sed -i "s/\"name\": \"braindump\"/\"name\": \"$(echo $NEW_APP_NAME | tr '[:upper:]' '[:lower:]')\"/g" package.json

# Update environment files
echo "🔧 Updating environment files..."
find . -name ".env.*" -exec sed -i "s/braindump\.com/$NEW_DOMAIN/g" {} \;
find . -name ".env.*" -exec sed -i "s/braindump\.vercel\.app/$NEW_APP_NAME.vercel.app/g" {} \;

# Update documentation
echo "📚 Updating documentation..."
find docs/ -name "*.md" -exec sed -i "s/BrainDump/$NEW_APP_NAME/g" {} \;
find docs/ -name "*.md" -exec sed -i "s/braindump/$NEW_DOMAIN/g" {} \;

# Update React components
echo "⚛️ Updating React components..."
find src/ -name "*.tsx" -exec sed -i "s/BrainDump/$NEW_APP_NAME/g" {} \;
find src/ -name "*.ts" -exec sed -i "s/braindump/$NEW_DOMAIN/g" {} \;

# Update README
echo "📖 Updating README..."
sed -i "s/BrainDump/$NEW_APP_NAME/g" README.md
sed -i "s/braindump/$NEW_DOMAIN/g" README.md

# Update GitHub workflows
echo "🔄 Updating CI/CD workflows..."
find .github/workflows/ -name "*.yml" -exec sed -i "s/BrainDump/$NEW_APP_NAME/g" {} \;

# Update Vercel config if exists
if [ -f "vercel.json" ]; then
    echo "🌐 Updating Vercel config..."
    sed -i "s/braindump/$NEW_DOMAIN/g" vercel.json
fi

echo ""
echo "✅ Rebranding complete!"
echo "📋 Next steps:"
echo "   1. Update your Vercel project names"
echo "   2. Update Supabase project names"  
echo "   3. Update GitHub repository name"
echo "   4. Test all environment variables"
echo "   5. Commit changes: git add . && git commit -m 'rebrand: Update app name to $NEW_APP_NAME'"
echo ""
