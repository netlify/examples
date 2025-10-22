import type { Config } from "@netlify/edge-functions";

export default async () => {
  return Response.json({ hello: "world" });
};

export const config: Config = {
  path: "/json",
};
