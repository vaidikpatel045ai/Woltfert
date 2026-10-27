"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Reveal direction for the clip-path */
  from?: "bottom" | "top" | "left" | "right";
  /** Parallax distance in % of image height while scrolling through (0 = none) */
  parallax?: number;
};

const insets = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Clip-path reveal (inset 100% → 0) with the image settling from scale 1.2 → 1. */
export default function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  from = "bottom",
  parallax = 0,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: "top 85%", once: true } });
        tl.fromTo(wrap.current, { clipPath: insets[from] }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }).fromTo(
          inner.current,
          { scale: 1.2 },
          { scale: 1, duration: 2, ease: "expo.out" },
          0.1,
        );
        if (parallax) {
          gsap.fromTo(
            inner.current!.firstElementChild,
            { yPercent: -parallax },
            {
              yPercent: parallax,
              ease: "none",
              scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={cn("relative overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        <div className={cn("absolute", parallax ? "-inset-y-[12%] inset-x-0" : "inset-0")}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", imgClassName)} />
        </div>
      </div>
    </div>
  );
}
