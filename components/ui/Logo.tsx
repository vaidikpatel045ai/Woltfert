import Image from "next/image";
import { cn } from "@/lib/utils";

/** Official gold wordmark (311×105). `compact` shrinks it for the scrolled nav. */
export default function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Image
      src="/Wolsfelts_Gold_Logo.png"
      alt="Wolsfelt's Bridal"
      width={311}
      height={105}
      priority
      className={cn(
        "w-auto transition-[height] duration-500 ease-luxe",
        // cn() doesn't merge Tailwind classes, so a passed className replaces the default sizing
        className ?? (compact ? "h-9 md:h-10" : "h-11 md:h-14"),
      )}
    />
  );
}
