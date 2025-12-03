/** @type {import('next').NextConfig} */
const nextConfig = {
	allowedDevOrigins: [process.env.NEXT_PUBLIC_URL_NAME],
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
