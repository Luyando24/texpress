import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Thunder Express",
    short_name: "Thunder",
    description: "Delivery, fast like thunder!",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f5f7",
    theme_color: "#061f3f",
    orientation: "portrait-primary",
    categories: ["business", "travel", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
