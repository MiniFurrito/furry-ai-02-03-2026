/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forzamos Webpack para evitar el error de fs con Tailwind v3
  // (puedes quitar esto después si actualizas a Tailwind v4)
};

module.exports = nextConfig;
