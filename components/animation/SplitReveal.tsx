"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "lines" for headings and paragraphs, "chars" for single oversized words */
  type?: "lines" | "chars";
  delay?: number;
  stagger?: number;
  /** Wait for the preloader instead of a ScrollTrigger (hero only) */
  onLoad?: boolean;
  id?: string;
};

/**
 * Masked line-by-line (or char-by-char) reveal: yPercent 110 → 0, expo.out.
 * Server-renders the plain text for SEO; splits on the client.
 */
export default function SplitReveal({
  as: Tag = "div",
  children,
  className,
  type = "lines",
  delay = 0,
  stagger,
  onLoad = false,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        let off = () => {};
        const split = SplitText.create(el, {
          // "words" keeps each word unbreakable when splitting to chars
          type: type === "chars" ? "lines,words,chars" : "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            const targets = type === "chars" ? self.chars : self.lines;
            const tween = gsap.from(targets, {
              yPercent: 110,
              duration: type === "chars" ? 1.5 : 1.4,
              ease: "expo.out",
              stagger: stagger ?? (type === "chars" ? 0.035 : 0.08),
              delay,
              paused: onLoad,
              scrollTrigger: onLoad ? undefined : { trigger: el, start: "top 88%", once: true },
            });
            if (onLoad) off = onPreloaderDone(() => tween.play());
            return tween;
          },
        });
        return () => {
          off();
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-split="" id={id}>
      {children}
    </Tag>
  );
}
