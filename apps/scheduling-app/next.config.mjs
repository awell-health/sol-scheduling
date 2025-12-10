/** @type {import('next').NextConfig} */
import { withWorkflow } from 'workflow/next';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@awell-health/sol-scheduling'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.sandbox-media.solmentalhealth.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

export default withWorkflow(nextConfig);
