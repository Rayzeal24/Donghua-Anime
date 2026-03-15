import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // On utilise SafeImage (<img> natif) pour les URLs externes.
    // next/image n'est plus utilisé pour les images de contenu.
    // Cette config reste permissive au cas où on réintroduit next/image plus tard.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
