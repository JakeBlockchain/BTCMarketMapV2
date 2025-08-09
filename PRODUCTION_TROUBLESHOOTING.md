# Production Troubleshooting Guide

This guide addresses common production issues and their solutions for the Bitcoin Market Map application.

## Current Issues & Solutions

### 1. Clerk Development Keys Warning

**Issue**: `Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production.`

**Root Cause**: The application was using a hardcoded test key as fallback.

**Solution**:

1. **Fixed**: Removed hardcoded test key from `app/layout.tsx`
2. **Action Required**: Set proper production environment variables in Vercel:

```bash
# In Vercel Dashboard → Project Settings → Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[your-production-key]
CLERK_SECRET_KEY=sk_live_[your-production-secret]
```

**How to get production keys**:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "API Keys" section
4. Copy the **Live** keys (not Test keys)
5. Add them to Vercel environment variables
6. Redeploy the application

### 2. Sentry Error (Blocked by Client)

**Issue**: `POST https://o999875.ingest.sentry.io/api/6006079/envelope/ net::ERR_BLOCKED_BY_CLIENT`

**Root Cause**: Ad blockers or privacy extensions blocking Sentry requests.

**Solutions**:

1. **For Users**: This is expected behavior with ad blockers - not a critical error
2. **For Developers**: Consider implementing graceful error handling:

```javascript
// Add to your error boundary or monitoring setup
window.addEventListener("unhandledrejection", event => {
  // Only log if not blocked by ad blocker
  if (!event.reason?.message?.includes("ERR_BLOCKED_BY_CLIENT")) {
    console.error("Unhandled promise rejection:", event.reason)
  }
})
```

### 3. Category Creation Failure

**Issue**: "Failed to create new category" error in admin panel.

**Root Cause**: Database connection or environment variable issues.

**Solution**:

1. **Fixed**: Added better error logging and handling
2. **Action Required**: Verify environment variables in Vercel:

```bash
# Required Database Variables
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/[database]

# Required Supabase Variables (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

**Debugging Steps**:

1. Check Vercel Function logs for detailed error messages
2. Verify database connection string format
3. Test database connectivity using the health endpoint: `/api/health`

## Environment Variables Checklist

### Required for Production

```bash
# Database (Required)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/[database]

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[key]
CLERK_SECRET_KEY=sk_live_[key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Supabase (If using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Stripe (If using payments)
STRIPE_SECRET_KEY=sk_live_[key]
STRIPE_WEBHOOK_SECRET=whsec_[secret]
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=https://buy.stripe.com/[link]
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=https://buy.stripe.com/[link]
```

### Setting Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable with the correct value
5. Make sure to select "Production" environment
6. Redeploy after adding variables

## Verification Steps

### 1. Check Application Health

Visit: `https://your-domain.com/api/health`

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### 2. Test Authentication

1. Try to access admin panel: `https://your-domain.com/admin`
2. Should redirect to login if not authenticated
3. After login, should show admin dashboard

### 3. Test Database Operations

1. Go to admin categories: `https://your-domain.com/admin/categories`
2. Try creating a new category
3. Check browser console for any errors
4. Check Vercel function logs for detailed error messages

## Common Error Messages & Solutions

### "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable"

**Solution**: Add the Clerk publishable key to Vercel environment variables.

### "DATABASE_URL environment variable is not set"

**Solution**: Add the database connection string to Vercel environment variables.

### "Database connection failed"

**Solutions**:

1. Verify database URL format
2. Check database server is running
3. Verify network connectivity from Vercel to database
4. Check database credentials

### "A category with this slug already exists"

**Solution**: This is expected behavior - try a different category name/slug.

## Monitoring & Debugging

### Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click on "Functions" tab
3. Click on any function to see logs
4. Look for error messages and stack traces

### Browser Console

1. Open browser developer tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests
4. Look for specific error messages

### Database Logs

If using Supabase:

1. Go to Supabase Dashboard
2. Select your project
3. Go to "Logs" section
4. Check for database errors

## Performance Optimization

### Database Queries

- Monitor slow queries in your database dashboard
- Consider adding indexes for frequently queried fields
- Use connection pooling for better performance

### Caching

- Vercel automatically caches static assets
- Consider implementing Redis for dynamic content caching
- Use Next.js ISR (Incremental Static Regeneration) for semi-static pages

## Security Checklist

- [ ] All environment variables use production values
- [ ] Database credentials are secure
- [ ] HTTPS is enforced
- [ ] Admin routes require authentication
- [ ] API endpoints validate inputs
- [ ] Error messages don't expose sensitive information

## Emergency Procedures

### Rollback Deployment

```bash
# Using Vercel CLI
vercel rollback [deployment-url]

# Or via Vercel Dashboard
# Go to Deployments → Click on previous deployment → Promote to Production
```

### Database Recovery

1. Check database backups
2. Restore from most recent backup if needed
3. Run database migrations if schema changed
4. Verify data integrity

## Getting Help

1. **Check Logs**: Always check Vercel function logs first
2. **Test Locally**: Try to reproduce the issue in development
3. **Environment Variables**: Verify all required variables are set
4. **Service Status**: Check status pages for Vercel, Supabase, Clerk
5. **Documentation**: Review service-specific documentation

## Contact Information

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Clerk Support**: [clerk.com/support](https://clerk.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)

---

**Last Updated**: January 2024
**Version**: 1.0
