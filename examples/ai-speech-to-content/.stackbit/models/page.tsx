import { type PageModel } from "@stackbit/types";

export const page: PageModel = {
  name: "page",
  type: "page",
  hideContent: true,
  filePath: "src/content/pages/{slug}.md",
  fields: [
    {
      name: "title",
      type: "string",
      required: true,
    },
    {
      name: "text",
      type: "string",
      required: true,
      controlType: "custom-inline-html",
      controlFilePath: ".stackbit/custom-controls/dist/speech-to-text.html",
    },
  ],
};
