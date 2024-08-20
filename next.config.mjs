/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_API_URL: "https://api.saramoda.shop",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.saramoda.shop",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
