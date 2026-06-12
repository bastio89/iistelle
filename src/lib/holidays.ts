/** Bundesweite deutsche Feiertage (in allen Bundesländern gültig). */

function easterSunday(year: number): Date {
  // Gauß'sche Osterformel
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = März, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function addDays(d: Date, days: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

const cache = new Map<number, Map<string, string>>();

/** Map ISO-Datum → Feiertagsname für ein Jahr. */
export function germanHolidays(year: number): Map<string, string> {
  const hit = cache.get(year);
  if (hit) return hit;
  const easter = easterSunday(year);
  const map = new Map<string, string>([
    [`${year}-01-01`, "Neujahr"],
    [iso(addDays(easter, -2)), "Karfreitag"],
    [iso(addDays(easter, 1)), "Ostermontag"],
    [`${year}-05-01`, "Tag der Arbeit"],
    [iso(addDays(easter, 39)), "Christi Himmelfahrt"],
    [iso(addDays(easter, 50)), "Pfingstmontag"],
    [`${year}-10-03`, "Tag der Deutschen Einheit"],
    [`${year}-12-25`, "1. Weihnachtstag"],
    [`${year}-12-26`, "2. Weihnachtstag"],
  ]);
  cache.set(year, map);
  return map;
}

export function isHoliday(isoDate: string): string | null {
  const year = Number(isoDate.slice(0, 4));
  return germanHolidays(year).get(isoDate) ?? null;
}

/** Arbeitstage (Mo–Fr ohne bundesweite Feiertage) zwischen zwei ISO-Daten, inklusive. */
export function workdaysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  let days = 0;
  const d = new Date(s);
  while (d <= e) {
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6 && !isHoliday(iso(d))) days++;
    d.setDate(d.getDate() + 1);
  }
  return Math.max(days, 1);
}

/** Nächste Feiertage ab heute (für Hinweise). */
export function upcomingHolidays(limit = 3): { date: string; name: string }[] {
  const today = iso(new Date());
  const year = new Date().getFullYear();
  const all = [
    ...Array.from(germanHolidays(year), ([date, name]) => ({ date, name })),
    ...Array.from(germanHolidays(year + 1), ([date, name]) => ({ date, name })),
  ];
  return all
    .filter((h) => h.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}
