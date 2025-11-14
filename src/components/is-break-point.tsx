"use client";

import { useEffect, useState } from "react";

interface IsBreakPointProps {
  breakpoint: string;
  children: React.ReactNode;
  otherwise?: React.ReactNode;
}

const IsBreakPoint: React.FC<IsBreakPointProps> = ({
  breakpoint,
  children,
  otherwise,
}) => {
  const isBreakPoint = useIsBreakpoint(breakpoint);
  return isBreakPoint ? children : otherwise;
};

function useIsBreakpoint(breakpoint: string) {
  const [isBreakpoint, setIsBreakpoint] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const media = window.matchMedia(`(${breakpoint})`);
    media.addEventListener(
      "change",
      (e) => {
        setIsBreakpoint(e.matches);
      },
      { signal: controller.signal },
    );
    setIsBreakpoint(media.matches);

    return () => {
      controller.abort();
    };
  }, [breakpoint]);

  return isBreakpoint;
}

export { IsBreakPoint };
