import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* your config */
};

export default withSentryConfig(nextConfig, {
  org: "your-sentry-org",
  project: "your-sentry-project",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  tunnelRoute: "/monitoring",

  // 👇 NEW WAY: move configs under webpack
  webpack: {
    // replaces disableLogger
    treeshake: {
      removeDebugLogging: true,
    },

    // replaces reactComponentAnnotation
    reactComponentAnnotation: {
      enabled: true,
    },

    // replaces automaticVercelMonitors
    automaticVercelMonitors: true,
  },
});