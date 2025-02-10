/** @type {import('next').NextConfig} */

const nextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
        // 下面的配置是禁止搜索引擎索引
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow',
        },
      ],
    },
  ],
  transpilePackages: ['@ant-design/icons', 'antd'],
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            antd: {
              name: 'antd',
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.sheet2email.com'
      },
      {
        protocol: 'https',
        hostname: 'example.com'
      },
      {
        protocol: 'https',
        hostname: 'websitelm.com'
      }
    ],
  },
  // 添加域名配置
  async rewrites() {
    return {
      beforeFiles: [
        
      ]
    }
  }
};

module.exports = nextConfig;