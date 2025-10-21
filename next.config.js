// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dn5wcoauce.execute-api.us-east-2.amazonaws.com/dev/:path*',
      },
    ];
  },
};

module.exports = nextConfig;    