/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora errores de TypeScript
  },
};

export default nextConfig;
