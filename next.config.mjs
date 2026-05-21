/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['172.31.16.1', 'localhost'],
};

export default nextConfig;
