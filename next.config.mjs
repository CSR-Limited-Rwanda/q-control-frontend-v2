/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable React Strict Mode in development to prevent duplicate requests
    reactStrictMode: false,

    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000, // Check every second
            aggregateTimeout: 300, // Delay before rebuilding
        };
        return config;
    },
};

export default nextConfig;