"use client";

import useIsDarkMode from "@/hooks/use-is-dark-mode";
import { cn } from "@/lib/utils";
import {
  MDXEditorProps,
  MDXEditorMethods,
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ListsToggle,
  InsertThematicBreak,
  InsertTable,
} from "@mdxeditor/editor";

const markdownClassNames =
  "max-w-none prose prose-neutral dark:prose-invert font-sans";

export default function Markdown({
  ref,
  className,
  ...props
}: MDXEditorProps & {
  ref?: React.Ref<MDXEditorMethods>;
}) {
  const isDarkMode = useIsDarkMode();

  return (
    <MDXEditor
      {...props}
      ref={ref}
      className={cn(markdownClassNames, isDarkMode && "dark-theme", className)}
      suppressHtmlProcessing
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <InsertThematicBreak />
              <InsertTable />
            </>
          ),
        }),
      ]}
    />
  );
}
