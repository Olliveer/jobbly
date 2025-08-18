import { useEffect, useState } from "react";

export default function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const controller = new AbortController();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    mql.addEventListener(
      "change",
      () => {
        setIsDarkMode(mql.matches);
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, []);

  return { isDarkMode };
}
