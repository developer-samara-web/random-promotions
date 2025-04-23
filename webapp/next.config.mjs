/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [process.env.NEXT_PUBLIC_URL_NAME, process.env.TBANK_API_NAME],
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
