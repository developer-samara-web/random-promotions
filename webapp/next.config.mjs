/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['razdachkin.ru', '127.0.0.1'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lavka-dobbi.fra1.digitaloceanspaces.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
