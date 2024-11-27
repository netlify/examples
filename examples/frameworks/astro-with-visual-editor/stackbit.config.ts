// stackbit.config.ts
import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",
  devCommand: "node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1",
  experimental: {
    ssg: {
      name: "Astro",
      logPatterns: {
        up: ["is ready", "astro"],
      },
      directRoutes: {
        "socket.io": "socket.io",
      },
      passthrough: ["/vite-hmr/**"],
    },
  },
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["src/content/blog"],
      models: [{  
        name: "post",
        type: "page",
        urlPath: "/blog/{slug}",
        filePath: "src/content/blog/{slug}.md",
        fields: [
          { name: "title", type: "string", required: true, default: "Post Title" },
          { name: "pubDate", type: "date", required: true },
          { name: "updatedDate", type: "date" },
          { name: "description", type: "string" },
          { name: "heroImage", type: "string" },
        ],
      }],
      assetsConfig: {
        referenceType: "static",
        staticDir: "src/content",
        uploadDir: "_images",
        publicPath: "/src/content/",
      },
    }),
  ],
});
