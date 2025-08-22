import type { Config } from "@react-router/dev/config";

export default {
  // Enable SPA mode for GitHub Pages static hosting
  ssr: false,
  // Set base path for GitHub Pages (will be your repo name)
  basename: process.env.NODE_ENV === 'production' ? '/sports-leagues' : '/',
} satisfies Config;
