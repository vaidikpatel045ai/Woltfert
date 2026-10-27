import { business, fullAddress, appointmentTypes, timezone } from "./data";
import { toMinutes, minutesToHHMM } from "./utils";

type Slot = { type: string; date: string; time: string };

const stamp = (date: string, time: string) => `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;

function endOf(s: Slot) {
  const mins = appointmentTypes.find((t) => t.id === s.type)?.minutes ?? 90;
  return minutesToHHMM(toMinutes(s.time) + mins);
}

function title(s: Slot) {
  const t = appointmentTypes.find((x) => x.id === s.type)?.title ?? "Bridal";
  return `${t} appointment at Wolsfelt's`;
}

/** iCalendar file content (floating wall-clock time pinned to the store timezone). */
export function buildIcs(s: Slot) {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wolsfelt's Bridal//Appointments//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wolsfelts.com`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=${timezone}:${stamp(s.date, s.time)}`,
    `DTEND;TZID=${timezone}:${stamp(s.date, endOf(s))}`,
    `SUMMARY:${title(s)}`,
    `LOCATION:${fullAddress.replace(/,/g, "\\,")}`,
    `DESCRIPTION:We look forward to welcoming you. Questions? Call ${business.phone}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(s: Slot) {
  const blob = new Blob([buildIcs(s)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wolsfelts-appointment.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function googleCalendarUrl(s: Slot) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: title(s),
    dates: `${stamp(s.date, s.time)}/${stamp(s.date, endOf(s))}`,
    ctz: timezone,
    location: fullAddress,
    details: `Questions? Call ${business.phone}.`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}
