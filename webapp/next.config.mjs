/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['8add-94-103-82-29.ngrok-free.app'],
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
