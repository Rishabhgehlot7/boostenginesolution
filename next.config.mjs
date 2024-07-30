/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 's3-clothinix-images-bucket.s3.ap-south-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'newbucketfortext.s3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'newbucketfortext.s3.ap-south-1.amazonaws.com',
            },
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;
