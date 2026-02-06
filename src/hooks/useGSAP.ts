"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

export function useGSAP(
  callback: () => (() => void) | void,
  scope?: RefObject<HTMLElement | null>
) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const ctx = gsap.context(() => {
      callback();
    }, scope?.current || undefined);

    return () => {
      ctx.revert();
      hasRun.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
