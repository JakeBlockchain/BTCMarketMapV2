import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bitcoin.org",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "lightning.network",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.github.io",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.coindesk.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.blockstream.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.stacks.co",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.rootstock.io",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "liquid.net",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.liquid.net",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.ordinals.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.hiro.so",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.strike.me",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.casa.io",
        port: "",
        pathname: "/**"
      }
    ]
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"]
  },

  // Server external packages
  serverExternalPackages: ["postgres"],

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          }
        ]
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate"
          }
        ]
      }
    ]
  }
}

export default nextConfig
