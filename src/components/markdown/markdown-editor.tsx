import dynamic from "next/dynamic";

export const MarkdownEditor = dynamic(() => import("./index"), {
  ssr: false,
});
