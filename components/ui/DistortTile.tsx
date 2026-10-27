"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { TransitionLink } from "@/components/animation/PageTransition";
import { sized } from "@/lib/data";
import { canUseWebGL, cn, isTouch } from "@/lib/utils";

const DistortImage = dynamic(() => import("@/components/three/DistortImage"), { ssr: false });

/**
 * Image link whose photo ripples on hover. The WebGL canvas is only created
 * on first hover (pointer devices that pass the capability check); otherwise
 * it is a plain next/image with a CSS zoom.
 */
export default function DistortTile({
  href,
  src,
  alt,
  sizes,
  className,
  children,
  cursor = "Discover",
  priority,
}: {
  href: string;
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  children?: ReactNode;
  cursor?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [gl, setGl] = useState(false);

  const arm = () => {
    if (!gl && !isTouch() && canUseWebGL()) setGl(true);
  };

  return (
    <TransitionLink ref={ref} href={href} data-cursor={cursor} onPointerEnter={arm} className={cn("group relative block overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]" />
      {gl && <DistortImage src={sized(src, 1200)} hostRef={ref} />}
      {children}
    </TransitionLink>
  );
}
