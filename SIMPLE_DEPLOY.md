# 🚀 Simple Blixcore Deployment Guide

## Option 1: Vercel CLI (Recommended - Fastest)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from this directory
```bash
vercel --prod
```

That's it! Vercel will:
- Detect Next.js automatically
- Build and deploy
- Give you a live URL

---

## Option 2: GitHub + Vercel (If CLI doesn't work)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `blixcore-fitness`
3. Public repository
4. Don't initialize with README

### Step 2: Upload Code
From this directory, run:
```bash
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/blixcore-fitness.git

# Push code
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click Deploy (no configuration needed)

---

## Option 3: Direct Upload to Vercel

1. Create a ZIP file of this entire folder (excluding node_modules and .git)
2. Go to https://vercel.com/new
3. Drag and drop the ZIP file
4. Vercel will deploy automatically

---

## ✅ What's Already Configured

- ✅ `vercel.json` - Deployment config
- ✅ `next.config.js` - Build optimization  
- ✅ All API routes working
- ✅ Production build tested
- ✅ Environment variables documented

## 🎯 After Deployment

Your demo will be live with:
- Fitness-focused landing page
- Working lead capture forms
- Dashboard with fitness analytics
- All API endpoints functional

## Need Help?

If you encounter any issues, let me know:
1. Which method you're trying
2. The exact error message
3. At which step it fails