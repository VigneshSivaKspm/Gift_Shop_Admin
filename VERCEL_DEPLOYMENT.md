# Vercel Deployment Setup Guide

## Current Issue

The white page after Vercel deployment is typically caused by missing Firebase environment variables.

## Steps to Fix

### 1. Get Your Firebase Credentials

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on Settings (⚙️) → Project Settings
4. Go to the "General" tab
5. Find your **Web app** configuration
6. Copy these values:
   - API Key → `VITE_FIREBASE_API_KEY`
   - Auth Domain → `VITE_FIREBASE_AUTH_DOMAIN`
   - Project ID → `VITE_FIREBASE_PROJECT_ID`
   - Storage Bucket → `VITE_FIREBASE_STORAGE_BUCKET`
   - Messaging Sender ID → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - App ID → `VITE_FIREBASE_APP_ID`

### 2. Set Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Deploy again (it will auto-redeploy or trigger a manual rebuild)

### 3. Test Locally (Optional)

Create a `.env.local` file in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then run:

```bash
npm run dev
```

### 4. Build and Test Production Build

```bash
npm run build
npm run preview
```

This will show you any build errors or runtime errors before deploying.

## Troubleshooting

### Still seeing white page?

1. **Check browser console** (F12) for JavaScript errors
2. **Check Vercel build logs** - go to deployments → see build output
3. **Look for red messages** in the error boundary that appears on screen
4. **Clear browser cache** - do a hard refresh (Ctrl+Shift+R)

### Missing Variables

The console will show "❌ Missing Firebase environment variables" if any are not set correctly.

## What Was Changed

- Added error boundary to catch and display errors
- Enhanced Firebase config with validation and logging
- Created vercel.json for Vercel-specific config
- Added global error handlers
