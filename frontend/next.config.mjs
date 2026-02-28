/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ESLint is run separately in CI. Skipping during build to prevent
        // unused-import warnings from blocking deployment.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Allow production builds to succeed even with type errors.
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
