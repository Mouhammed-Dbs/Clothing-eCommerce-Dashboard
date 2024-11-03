/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_API_URL:
      process.env.NODE_ENV === "development"
        ? "http:localhost:5000/"
        : "https://api.saramoda.shop",
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
