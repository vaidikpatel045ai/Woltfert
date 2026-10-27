"use client";

import { useEffect, useState } from "react";
import { hours } from "@/lib/data";
import { cn, hoursLabel, openStatus, storeNow, type OpenStatus } from "@/lib/utils";

/** Live "Open now / Closed now" pill, computed in the store's timezone. */
export function OpenNow({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(openStatus());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={cn("inline-flex items-center gap-2.5 label", className)} aria-live="polite">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {status?.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", status?.open ? "bg-gold" : "bg-current opacity-40")} />
      </span>
      <span>{status ? status.label : "Tuesday – Saturday"}</span>
    </p>
  );
}

/** Weekly hours table that highlights today (Monday-first, like a shop door). */
export default function HoursTable({ dark = false }: { dark?: boolean }) {
  const [today, setToday] = useState<number | null>(null);
  const [month, setMonth] = useState<number | undefined>();

  useEffect(() => {
    const n = storeNow();
    setToday(n.weekday);
    setMonth(n.month);
  }, []);

  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Boutique hours</caption>
      <tbody>
        {order.map((i) => {
          const d = hours[i];
          const isToday = i === today;
          return (
            <tr
              key={d.day}
              className={cn(
                "border-b transition-colors",
                dark ? "border-ivory/10" : "border-espresso/10",
                isToday && (dark ? "text-gold" : "text-gold-ink"),
              )}
              aria-current={isToday ? "date" : undefined}
            >
              <th scope="row" className="py-3 pr-6 font-normal">
                <span className="font-display text-xl md:text-2xl">{d.day}</span>
                {isToday && <span className="label ml-3 align-middle">Today</span>}
              </th>
              <td className={cn("py-3 text-right tabular-nums", !d.open && "opacity-60")}>
                {hoursLabel(d, month)}
                {d.december && <span className="block text-xs opacity-60">5 pm in December</span>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
