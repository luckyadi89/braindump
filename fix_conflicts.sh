#!/bin/bash
# Fix merge conflicts by keeping the version after =======

for file in "./next.config.js" "./README.md" "./src/app/api/process-audio/route.ts" "./src/app/layout.tsx" "./src/app/page.tsx" "./src/lib/openai.ts" "./.gitignore"; do
    if [ -f "$file" ]; then
        echo "Fixing $file..."
        # Remove lines from <<<<<<< HEAD to ======= (including these lines)
        # Keep lines from ======= to >>>>>>> (excluding these lines)
        sed -i '/^<<<<<<< HEAD$/,/^=======$/d' "$file"
        sed -i '/^>>>>>>> .*/d' "$file"
    fi
done

echo "All merge conflicts fixed!"
