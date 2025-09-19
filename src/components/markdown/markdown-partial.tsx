"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function MarkdownPartial({
  dialogMarkdown,
  dialogTitle,
  mainMarkdown,
}: {
  dialogMarkdown: ReactNode;
  dialogTitle: string;
  mainMarkdown: ReactNode;
}) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const mainMarkdownRef = useRef<HTMLDivElement>(null);

  function checkOverflow(node: HTMLDivElement) {
    if (node) {
      setIsOverflowing(node.scrollHeight > node.clientHeight);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "resize",
      () => {
        if (mainMarkdownRef.current === null) {
          return;
        }
        checkOverflow(mainMarkdownRef.current);
      },
      {
        signal: controller.signal,
      }
    );
    return () => controller.abort();
  }, []);

  useLayoutEffect(() => {
    if (mainMarkdownRef.current === null) {
      return;
    }
    checkOverflow(mainMarkdownRef.current);
  }, []);

  return (
    <>
      <div
        ref={mainMarkdownRef}
        className="max-h-[calc(100vh-200px)] overflow-hidden relative"
      >
        {mainMarkdown}
        {isOverflowing && (
          <div className="bg-gradient-to-t from-background to-transparent to-15% inset-0 absolute pointer-events-none"></div>
        )}
      </div>

      {isOverflowing && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="underline -ml-3">
              Read More
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-3xl lg:max-w-4xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">{dialogMarkdown}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
