import { cn } from "@/lib/utils";

/** Infinite CSS ticker. Content is duplicated once (aria-hidden) for a seamless loop. */
export default function Marquee({
  items,
  className,
  itemClassName,
  duration = 40,
  separator = "·",
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  duration?: number;
  separator?: string;
}) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className={cn("flex items-center whitespace-nowrap", itemClassName)}>
          <span>{item}</span>
          <span className="mx-[0.6em] text-gold" aria-hidden="true">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
