/** @type {import('next').NextConfig} */
const nextConfig = {
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000, // Check every second
            aggregateTimeout: 300, // Delay before rebuilding
        };
        return config;
    },
};

export default nextConfig;