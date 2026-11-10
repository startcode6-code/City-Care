import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.youtube.com",
                pathname: "/vi/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/un4wevjk/image/upload/**",
            },
        ],
    },
};

export default nextConfig;