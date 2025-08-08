# Bitcoin Ecosystem Market Map

A comprehensive web application that provides a visual market map of the Bitcoin ecosystem, organizing projects and platforms into key categories to help users explore the landscape of Bitcoin development.

## 🚀 Features

- **Interactive Market Map**: Visual organization of Bitcoin ecosystem projects by category
- **Ecosystem Detail Pages**: Dedicated pages for each platform showing all built projects
- **Admin Dashboard**: Protected area for managing categories, ecosystems, and projects
- **User Authentication**: Secure sign-up/sign-in with Clerk
- **Subscription System**: Stripe-powered premium features
- **Responsive Design**: Optimized for desktop and mobile devices
- **Performance Optimized**: 101 kB shared bundle, excellent Core Web Vitals

## 🛠 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/docs) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [PostgreSQL](https://www.postgresql.org/), [Supabase](https://supabase.com/), [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 📋 Prerequisites

You'll need accounts for these services (all have free tiers):

- [GitHub](https://github.com/) - Code repository
- [Supabase](https://supabase.com/) - Database hosting
- [Clerk](https://clerk.com/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Vercel](https://vercel.com/) - Deployment (recommended)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BTCMarketMapV2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Fill in your environment variables (see Environment Variables section)
   ```

4. **Set up the database**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

For production deployment, see the comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

**Quick Vercel Deployment:**

```bash
npm i -g vercel
vercel login
vercel
```

## 🔧 Environment Variables

Create a `.env.local` file with these variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/[database]

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[publishable-key]
CLERK_SECRET_KEY=[secret-key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Stripe Payments
STRIPE_SECRET_KEY=[secret-key]
STRIPE_WEBHOOK_SECRET=[webhook-secret]
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=[yearly-payment-link]
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=[monthly-payment-link]
```

See `.env.example` for the complete list.

## 📁 Project Structure

```
BTCMarketMapV2/
├── app/                          # Next.js App Router
│   ├── (authenticated)/          # Protected routes
│   ├── (unauthenticated)/        # Public routes
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn/ui components
│   └── utility/                  # Utility components
├── db/                          # Database configuration
│   ├── schema/                   # Drizzle schema definitions
│   ├── migrations/               # Database migrations
│   └── seed/                     # Database seeding
├── lib/                         # Utility libraries
├── tests/                       # E2E tests (Playwright)
└── hooks/                       # Custom React hooks
```

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run E2E tests only
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- **Unit Tests**: Critical business logic and utilities
- **Integration Tests**: Component interactions and server actions
- **E2E Tests**: Complete user workflows (Playwright)

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run types            # Check TypeScript types

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Apply migrations
npm run db:seed          # Seed database
npm run db:test          # Test database connection

# Code Quality
npm run clean            # Format and lint code
npm run format:write     # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run all tests
npm run test:unit        # Run unit tests
npm run test:e2e         # Run E2E tests
```

## 🏗 Architecture

### Database Schema

- **Categories**: Main Bitcoin ecosystem layers (L1, Lightning, etc.)
- **Ecosystems**: Platforms within categories (Stacks, Liquid, etc.)
- **Projects**: Applications built on ecosystems
- **Subscriptions**: User payment status (Stripe integration)

### Key Features

1. **Server-Side Rendering**: Optimized for SEO and performance
2. **Static Generation**: 11/19 pages statically generated
3. **Authentication**: Clerk-powered user management
4. **Admin Dashboard**: CRUD operations for content management
5. **Payment Integration**: Stripe subscriptions for premium features
6. **Performance**: 101 kB shared bundle, excellent Core Web Vitals

## 🔒 Security

- HTTPS enforced in production
- Security headers configured
- Input validation on all forms
- Protected admin routes
- Environment variable security
- Regular dependency updates

## 📊 Performance

- **Bundle Size**: 101 kB shared across all pages
- **Static Pages**: 11/19 pages pre-rendered
- **Core Web Vitals**: Optimized for excellent scores
- **Image Optimization**: WebP/AVIF support
- **Caching**: Optimized caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./license) file for details.

## 🆘 Support

- **Documentation**: Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🗺 Roadmap

- [ ] Advanced search and filtering
- [ ] User-submitted project suggestions
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🙏 Acknowledgments

- Bitcoin community for ecosystem data
- Next.js team for the excellent framework
- Supabase for database hosting
- Clerk for authentication services
- Stripe for payment processing
- Vercel for deployment platform

---

**Built with ❤️ for the Bitcoin community**
