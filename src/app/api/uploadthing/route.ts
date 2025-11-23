import { customFileRouter } from "@/services/uploadthig/router";
import { createRouteHandler } from "uploadthing/next";

export const { GET, POST } = createRouteHandler({
  router: customFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
