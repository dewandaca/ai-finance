# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase project already setup
- Gemini API key

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Finance AI app"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/ai-finansial.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and login
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Deploy

Click "Deploy" and wait for deployment to complete (~2 minutes)

### Step 5: Update Supabase Settings

1. Go to Supabase Dashboard
2. Navigate to Authentication > URL Configuration
3. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

### Step 6: Test

Visit your deployed app and test:

- Registration
- Login
- Add transaction manually
- Chat with AI
- View dashboard

---

## 🐳 Deploy with Docker (Alternative)

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t ai-finansial .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e GEMINI_API_KEY=your_key \
  ai-finansial
```

---

## ☁️ Deploy to Other Platforms

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Railway

1. Create new project from GitHub
2. Add environment variables
3. Railway auto-detects Next.js
4. Deploy

### AWS Amplify

1. Connect repository
2. Build settings (auto-detected)
3. Add environment variables
4. Deploy

---

## 🔧 Post-Deployment Configuration

### 1. Enable Email Confirmation (Production)

In Supabase Dashboard:

1. Authentication > Settings
2. Enable "Confirm email"
3. Configure email templates

### 2. Setup Custom Domain (Optional)

In Vercel:

1. Project Settings > Domains
2. Add custom domain
3. Configure DNS records

### 3. Monitoring

Setup monitoring with:

- Vercel Analytics (built-in)
- Sentry for error tracking
- Google Analytics for user tracking

### 4. Performance

Optimize:

- Enable Edge caching in Vercel
- Monitor Core Web Vitals
- Use Vercel Image Optimization

---

## 🔐 Security Checklist

Before going to production:

- [ ] All environment variables set correctly
- [ ] Supabase RLS policies verified
- [ ] Email confirmation enabled
- [ ] Strong password requirements
- [ ] Rate limiting on API routes (optional)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Redirect URLs configured in Supabase
- [ ] API keys secured (never in client-side code)

---

## 📊 Monitoring & Maintenance

### Logs

Access logs in:

- Vercel Dashboard > Deployments > Functions
- Supabase Dashboard > Logs

### Database Backups

Supabase automatically backs up:

- Point-in-time recovery (Pro plan)
- Manual backups available

### Updates

Keep dependencies updated:

```bash
npm update
npm audit fix
```

---

## 🆘 Troubleshooting Deployment

### Build Fails

**Issue**: Build fails on Vercel
**Solution**:

- Check build logs
- Ensure all dependencies in package.json
- Test `npm run build` locally first

### Environment Variables Not Working

**Issue**: App can't connect to Supabase
**Solution**:

- Verify variable names match exactly
- Redeploy after adding variables
- Check variable scope (production/preview)

### 404 Errors

**Issue**: Pages return 404
**Solution**:

- Check route configuration
- Ensure dynamic routes configured
- Verify .next folder generated correctly

### Authentication Issues

**Issue**: Can't login after deployment
**Solution**:

- Update redirect URLs in Supabase
- Check Site URL configuration
- Verify environment variables

---

## 📱 Mobile App (Future)

Consider building:

- React Native app
- Progressive Web App (PWA)
- Electron desktop app

---

## 💡 Tips

1. **Use Preview Deployments**: Test in preview before promoting to production
2. **Environment-Specific Settings**: Use different Supabase projects for dev/prod
3. **Monitor Usage**: Keep eye on Gemini API usage limits
4. **Database Indexes**: Add indexes for better query performance
5. **Caching**: Implement caching strategies for better performance

---

**Ready for Production!** 🎉
