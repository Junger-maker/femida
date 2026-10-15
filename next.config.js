/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: process.env.NEXT_OUTPUT_MODE ? path.join(__dirname, '../') : '/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },

  // Глушим предупреждение Next.js 16 о Turbopack + webpack
  turbopack: {},

  serverExternalPackages: [
    '@prisma/client', 
    'prisma', 
    '@prisma/adapter-libsql', 
    '@libsql/client'
  ],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        '@prisma/client',
        { '@prisma/adapter-libsql': 'commonjs @prisma/adapter-libsql' },
        { '@libsql/client': 'commonjs @libsql/client' }
      ];
    }
    return config;
  },

  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [{ source: '/_next/static/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] }];
  },
  allowedDevOrigins: ['127.0.0.1', 'c86a9dffe.na113.preview.abacusai.app'],
};

const userConfigPath = path.join(__dirname, 'next.config.user.json');
const userConfigAllowedKeys = { skipTrailingSlashRedirect: 'boolean', trailingSlash: 'boolean' };
if (fs.existsSync(userConfigPath)) {
  const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
  for (const key of Object.keys(userConfig)) {
    if (typeof userConfig[key] !== userConfigAllowedKeys[key]) {
      throw new Error(`next.config.user.json: unsupported override "${key}".`);
    }
    nextConfig[key] = userConfig[key];
  }
}

module.exports = nextConfig;
