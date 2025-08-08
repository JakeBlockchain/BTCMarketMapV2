# Bitcoin Ecosystem Market Map - Deployment Guide

This guide provides step-by-step instructions for deploying the Bitcoin Ecosystem Market Map to production.

## Quick Start (Vercel - Recommended)

1. **Fork/Clone the repository**
2. **Set up production services** (see Service Setup section)
3. **Deploy to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```
4. **Configure environment variables** in Vercel dashboard
5. **Verify deployment** using the health check endpoint

## Service Setup Requirements

### 1. Supabase (Database)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy the connection string and add to `DATABASE_URL`
4. Copy the project URL and anon key for Supabase configuration
5. Run database migrations:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

### 2. Clerk (Authentication)

1. Create a new application at [clerk.com](https://clerk.com)
2. Configure sign-in/sign-up pages:
   - Sign-in URL: `/login`
   - Sign-up URL: `/signup`
3. Copy the publishable key and secret key
4. Configure allowed redirect URLs for your domain

### 3. Stripe (Payments)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create payment links for monthly/yearly subscriptions
3. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhooks`
4. Copy webhook secret and API keys

## Environment Variables

Create these environment variables in your deployment platform:

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/[database]

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[key]
CLERK_SECRET_KEY=sk_live_[key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Stripe Payments
STRIPE_SECRET_KEY=sk_live_[key]
STRIPE_WEBHOOK_SECRET=whsec_[secret]
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=https://buy.stripe.com/[link]
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=https://buy.stripe.com/[link]
```

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**:

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

2. **Configure Build Settings**:

   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**:

   - Go to Project Settings → Environment Variables
   - Add all required variables from the list above

4. **Deploy**:
   - Push to main branch or click "Deploy" in Vercel dashboard
   - Vercel will automatically build and deploy

### Netlify

1. **Connect Repository**:

   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository

2. **Configure Build Settings**:

   - Build Command: `npm run build`
   - Publish Directory: `.next`

3. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all required variables

### Railway

1. **Connect Repository**:

   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub

2. **Configure Environment**:
   - Add environment variables in the Variables tab
   - Railway will auto-deploy on push

### Self-Hosted (Docker)

1. **Create Dockerfile** (already included in project)

2. **Build and Run**:

   ```bash
   docker build -t btc-market-map .
   docker run -p 3000:3000 --env-file .env.production btc-market-map
   ```

3. **Using Docker Compose**:
   ```bash
   docker-compose up -d
   ```

## Post-Deployment Checklist

### Immediate Verification

- [ ] Site loads at your domain
- [ ] Health check endpoint responds: `https://yourdomain.com/api/health`
- [ ] Homepage displays categories and ecosystems
- [ ] User registration/login works
- [ ] Admin dashboard is accessible (with proper authentication)

### Performance Verification

- [ ] Lighthouse score > 90 for Performance
- [ ] Core Web Vitals are within targets:
  - First Contentful Paint < 1.5s
  - Largest Contentful Paint < 2.5s
  - Cumulative Layout Shift < 0.1

### Security Verification

- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] Admin routes require authentication
- [ ] API endpoints validate inputs

## Monitoring Setup

### Error Monitoring (Sentry)

1. **Install Sentry**:

   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**:

   ```javascript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs"

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0
   })
   ```

3. **Add Environment Variable**:
   ```bash
   SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
   ```

### Analytics (Google Analytics)

1. **Create GA4 Property**
2. **Add Tracking Code**:

   ```javascript
   // Add to app/layout.tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
     strategy="afterInteractive"
   />
   ```

3. **Add Environment Variable**:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Maintenance

### Regular Tasks

**Weekly**:

- Monitor error rates and performance
- Check security alerts
- Review database performance

**Monthly**:

- Update dependencies
- Review analytics data
- Rotate API keys if needed

**Quarterly**:

- Security audit
- Performance optimization review
- Backup testing

### Updates

1. **Test Locally**:

   ```bash
   npm run dev
   npm run test
   npm run build
   ```

2. **Deploy**:

   - Push to main branch (auto-deploy)
   - Or use platform-specific deploy command

3. **Verify**:
   - Check health endpoint
   - Test critical user flows
   - Monitor error rates

## Troubleshooting

### Common Issues

**Build Failures**:

- Check TypeScript errors: `npm run types`
- Verify all environment variables are set
- Check for missing dependencies

**Runtime Errors**:

- Check deployment logs
- Verify database connectivity
- Confirm API keys are valid and not expired

**Performance Issues**:

- Check database query performance
- Verify CDN configuration
- Monitor Core Web Vitals

### Emergency Procedures

**Rollback**:

```bash
# Vercel
vercel rollback [deployment-url]

# Git-based platforms
git revert [commit-hash]
git push origin main
```

**Database Issues**:

- Check connection pool usage
- Monitor for long-running queries
- Have backup restoration procedure ready

## Support

For deployment issues:

1. Check the troubleshooting section above
2. Review deployment platform documentation
3. Check service status pages (Vercel, Supabase, Clerk, Stripe)
4. Review application logs for specific error messages

## Security Considerations

- Use HTTPS in production
- Rotate API keys regularly
- Monitor for security vulnerabilities
- Keep dependencies updated
- Use environment variables for secrets
- Enable security headers (already configured)
- Regular security audits

The Bitcoin Ecosystem Market Map is designed to be easily deployable with minimal configuration. Follow this guide for a smooth production deployment.
