/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← ignora ESLint en build
  },
  typescript: {
    ignoreBuildErrors: true, // ← ignora errores de TypeScript en build
  },
};

export default nextConfig;
