/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' }
        ],
      },
    ]
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
}

module.exports = nextConfig
