/**
 * @type {import('next').NextConfig}
 *
 * This configuration explicitly enables the SWC minifier and sets a couple
 * of optimization flags that help tree‑shaking.  Next.js normally handles
 * these settings for you, but including the file makes the intent clear and
 * provides a place to add bundle analysis later.
 */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  webpack(config, { dev, isServer }) {
    // Ensure usedExports is enabled for client bundles so unused code can be
    // dropped during the production build.  This is Next's default but
    // reinforcing it makes the config easier to audit.
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
    }
    return config;
  }
};

module.exports = nextConfig;
