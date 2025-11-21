/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: [],
  },
  // ESLint configuration
  eslint: {
    dirs: ['src'],
  },
}

module.exports = nextConfig
