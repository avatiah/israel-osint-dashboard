/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Отключаем для ускорения
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}

module.exports = nextConfig
