# Rebranding Guide

## 🎯 **Quick Rebrand Process**

When you're ready to change from "BrainDump" to your new brand:

### **Step 1: Run the Rebrand Script**
```bash
# Make script executable
chmod +x scripts/rebrand.sh

# Run rebranding (example)
./scripts/rebrand.sh "VoiceNotes" "voicenotes.ai"
```

### **Step 2: Update External Services**

#### **GitHub Repository:**
1. Go to Settings → General → Repository name
2. Change from `braindump` to `your-new-name`
3. Update local remote: `git remote set-url origin https://github.com/yourusername/your-new-name.git`

#### **Vercel Projects:**
1. Rename projects in Vercel dashboard
2. Update custom domains
3. Update GitHub Actions secrets if project IDs change

#### **Supabase Projects:**
1. Rename projects in Supabase dashboard (optional)
2. URLs stay the same (no code changes needed)

#### **Environment Variables:**
All automatically updated by the script!

### **Step 3: Test Everything**
```bash
npm run build        # Test build works
npm run dev         # Test development server
npm run lint        # Check for any missed references
```

### **Step 4: Deploy**
```bash
git add .
git commit -m "rebrand: Update app name to YourNewName"
git push origin master
```

## 🔍 **What Gets Updated:**

- ✅ App name in all components
- ✅ Domain references in all configs
- ✅ Environment files
- ✅ Documentation
- ✅ Package.json
- ✅ README files
- ✅ GitHub workflows
- ✅ Error messages and logs

## 🎨 **Additional Branding Items** (Manual):

- [ ] Logo/favicon files
- [ ] App icons for PWA
- [ ] Social media images
- [ ] Email templates
- [ ] Legal documents (terms, privacy)

## 📝 **Suggested Domain Research:**

Use these tools to check availability:
- Namecheap.com
- GoDaddy.com
- Hover.com
- Domain.com

**Pro Tip:** Buy the .com, .ai, and .app versions to protect your brand!
