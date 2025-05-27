/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ['imgcentauro-a.akamaihd.net', 'm.media-amazon.com', 'static.zara.net'],
  },
};

export default config;
