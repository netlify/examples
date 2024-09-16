// stackbit.config.ts
import path from "path";
import {
  defineStackbitConfig,
  SiteMapOptions,
  SiteMapEntry,
  Document,
} from "@stackbit/types";
import { GitContentSource, DocumentContext } from "@stackbit/cms-git";
import { page } from "./.stackbit/models/page";

const PAGES_DIR = "src/content/pages";
function filePathToPageUrl(filePath: string): string {
  const pathObject = path.parse(filePath.substring(PAGES_DIR.length));
  return (
    (pathObject.name === "index"
      ? '/index'
      : path.join(pathObject.dir, pathObject.name)) || "/index"
  );
}

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",
  postInstallCommand: `npm run build-custom-controls-config && npm run build-custom-controls`,
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
      contentDirs: ["src/content"],
      models: [page],
    }),
  ],
  modelExtensions: [{ name: "page", type: "page", urlPath: "/{slug}" }],
  sitemap: ({ documents }: SiteMapOptions): SiteMapEntry[] => {
    return (documents as Document<DocumentContext>[]).map((document) => {
      const filePath = document.context?.["filePath"] ?? document.id;
      return {
        stableId: document.id,
        label: filePath,
        urlPath: filePathToPageUrl(filePath),
        document: document,
      };
    });
  },
});
