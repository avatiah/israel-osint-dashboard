/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Включаем обратно быстрый компилятор
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
}

module.exports = nextConfig
