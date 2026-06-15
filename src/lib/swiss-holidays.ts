/**
 * Schweizer Feiertage nach Kanton
 *
 * Verwendungszweck:
 * - Abwesenheits-Berechnung (Urlaubstage)
 * - Zeiterfassung (Arbeitstage)
 * - Kalender-Ansichten
 *
 * Stand: Juni 2026
 */

// ─── Typen ────────────────────────────────────────────────────────────────────

export type Canton =
  | "AG" | "AI" | "AR" | "BE" | "BL" | "BS"
  | "FR" | "GE" | "GL" | "GR" | "JU"
  | "LU" | "NE" | "NW" | "OW" | "SG"
  | "SH" | "SO" | "SZ" | "TG" | "TI"
  | "UR" | "VD" | "VS" | "ZG" | "ZH";

export interface Holiday {
  date: string;  // ISO format: YYYY-MM-DD
  name: string;
  type: "national" | "canton";
}

/** Kanton-Informationen */
export const CANTONS: { code: Canton; name: string; shortName: string }[] = [
  { code: "AG", name: "Aargau", shortName: "AG" },
  { code: "AI", name: "Appenzell Innerrhoden", shortName: "AI" },
  { code: "AR", name: "Appenzell Ausserrhoden", shortName: "AR" },
  { code: "BE", name: "Bern", shortName: "BE" },
  { code: "BL", name: "Basel-Landschaft", shortName: "BL" },
  { code: "BS", name: "Basel-Stadt", shortName: "BS" },
  { code: "FR", name: "Freiburg", shortName: "FR" },
  { code: "GE", name: "Genf", shortName: "GE" },
  { code: "GL", name: "Glarus", shortName: "GL" },
  { code: "GR", name: "Graubünden", shortName: "GR" },
  { code: "JU", name: "Jura", shortName: "JU" },
  { code: "LU", name: "Luzern", shortName: "LU" },
  { code: "NE", name: "Neuenburg", shortName: "NE" },
  { code: "NW", name: "Nidwalden", shortName: "NW" },
  { code: "OW", name: "Obwalden", shortName: "OW" },
  { code: "SG", name: "St. Gallen", shortName: "SG" },
  { code: "SH", name: "Schaffhausen", shortName: "SH" },
  { code: "SO", name: "Solothurn", shortName: "SO" },
  { code: "SZ", name: "Schwyz", shortName: "SZ" },
  { code: "TG", name: "Thurgau", shortName: "TG" },
  { code: "TI", name: "Tessin", shortName: "TI" },
  { code: "UR", name: "Uri", shortName: "UR" },
  { code: "VD", name: "Waadt", shortName: "VD" },
  { code: "VS", name: "Wallis", shortName: "VS" },
  { code: "ZG", name: "Zug", shortName: "ZG" },
  { code: "ZH", name: "Zürich", shortName: "ZH" },
];

// ─── Ostern (Gauß'sche Osterformel) ──────────────────────────────────────────

function easterSunday(year: number): Date {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

// ─── Bundesweite Feiertage (schweizweit gültig) ────────────────────────────────

function getNationalHolidays(year: number): Holiday[] {
  const easter = easterSunday(year);
  return [
    { date: `${year}-01-01`, name: "Neujahr", type: "national" },
    { date: iso(addDays(easter, -2)), name: "Karfreitag", type: "national" },
    { date: iso(addDays(easter, 1)), name: "Ostermontag", type: "national" },
    { date: `${year}-05-01`, name: "Tag der Arbeit", type: "national" },
    { date: iso(addDays(easter, 39)), name: "Auffahrt", type: "national" },
    { date: iso(addDays(easter, 50)), name: "Pfingstmontag", type: "national" },
    { date: `${year}-08-01`, name: "Nationalfeiertag", type: "national" },
    { date: `${year}-12-25`, name: "Weihnachten", type: "national" },
    { date: `${year}-12-26`, name: "Stephanstag", type: "national" },
  ];
}

// ─── Kantonale Feiertage ───────────────────────────────────────────────────────

function getCantonHolidays(canton: Canton, year: number): Holiday[] {
  const holidays: Holiday[] = [];
  const easter = easterSunday(year);

  switch (canton) {
    // Aargau
    case "AG":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-05-19`, name: "Pfingstmontag (Betagtenausflug)", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Appenzell Innerrhoden
    case "AI":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-08-15`, name: "Mariä Himmelfahrt", type: "canton" }
      );
      break;

    // Appenzell Ausserrhoden
    case "AR":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Bern
    case "BE":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-09-01`, name: "Knabenschiessen Montag", type: "canton" }
      );
      break;

    // Basel-Landschaft
    case "BL":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Basel-Stadt
    case "BS":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Freiburg
    case "FR":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: iso(addDays(easter, 50)), name: "Pfingstmontag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Genf
    case "GE":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-06-11`, name: "Jeûne genevois", type: "canton" },
        { date: `${year}-12-31`, name: "Wiederherstellung der Republik", type: "canton" }
      );
      break;

    // Glarus
    case "GL":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" },
        { date: `${year}-11-01`, name: "Allerheiligen", type: "canton" }
      );
      break;

    // Graubünden
    case "GR":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-01`, name: "Josefstag", type: "canton" },
        { date: `${year}-08-15`, name: "Mariä Himmelfahrt", type: "canton" }
      );
      break;

    // Jura
    case "JU":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-06-11`, name: "Jeûne jurassien", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Luzern
    case "LU":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Neuenburg
    case "NE":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-01`, name: "Jeûne fédéral", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Nidwalden
    case "NW":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Obwalden
    case "OW":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // St. Gallen
    case "SG":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Schaffhausen
    case "SH":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-05-01`, name: "Maifeiertag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Solothurn
    case "SO":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-05-01`, name: "Maifeiertag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Schwyz
    case "SZ":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Thurgau
    case "TG":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Tessin
    case "TI":
      holidays.push(
        { date: `${year}-01-06`, name: "Heilige Drei Könige", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-08-15`, name: "Mariä Himmelfahrt", type: "canton" },
        { date: `${year}-11-01`, name: "Allerheiligen", type: "canton" }
      );
      break;

    // Uri
    case "UR":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Waadt
    case "VD":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-06-29`, name: "Peter und Paul", type: "canton" }
      );
      break;

    // Wallis
    case "VS":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-03-19`, name: "Josefstag", type: "canton" },
        { date: `${year}-08-15`, name: "Mariä Himmelfahrt", type: "canton" },
        { date: `${year}-11-01`, name: "Allerheiligen", type: "canton" }
      );
      break;

    // Zug
    case "ZG":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;

    // Zürich
    case "ZH":
      holidays.push(
        { date: `${year}-01-02`, name: "Berchtoldstag", type: "canton" },
        { date: `${year}-05-01`, name: "Maifeiertag", type: "canton" },
        { date: `${year}-09-17`, name: "Eidgenössischer Dank- und Bettag", type: "canton" }
      );
      break;
  }

  return holidays;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const holidayCache = new Map<string, Holiday[]>();

function getCacheKey(canton: Canton, year: number): string {
  return `${canton}-${year}`;
}

// ─── Öffentliche API ──────────────────────────────────────────────────────────

/**
 * Gibt alle Feiertage für einen Kanton und ein Jahr zurück
 */
export function getSwissHolidays(canton: Canton, year: number): Holiday[] {
  const key = getCacheKey(canton, year);

  if (holidayCache.has(key)) {
    return holidayCache.get(key)!;
  }

  const national = getNationalHolidays(year);
  const cantonHolidays = getCantonHolidays(canton, year);
  const all = [...national, ...cantonHolidays];

  // Sortiere nach Datum
  all.sort((a, b) => a.date.localeCompare(b.date));

  holidayCache.set(key, all);
  return all;
}

/**
 * Prüft, ob ein bestimmtes Datum ein Feiertag ist
 * @param isoDate - Datum im ISO-Format (YYYY-MM-DD)
 * @param canton - Schweizer Kanton (Standard: Zürich)
 * @returns Feiertagsname oder null
 */
export function isSwissHoliday(isoDate: string, canton: Canton = "ZH"): string | null {
  const year = Number(isoDate.slice(0, 4));
  const holidays = getSwissHolidays(canton, year);
  const holiday = holidays.find(h => h.date === isoDate);
  return holiday?.name ?? null;
}

/**
 * Prüft, ob ein Tag ein Wochenende ist (Samstag oder Sonntag)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sonntag = 0, Samstag = 6
}

/**
 * Prüft, ob ein Tag ein Arbeitstag ist (kein Wochenende, kein Feiertag)
 */
export function isWorkday(isoDate: string, canton: Canton = "ZH"): boolean {
  const date = new Date(isoDate);
  if (isWeekend(date)) return false;
  if (isSwissHoliday(isoDate, canton)) return false;
  return true;
}

/**
 * Zählt Arbeitstage (Montag-Freitag, ohne Feiertage) zwischen zwei Daten
 * @param start - Startdatum ISO
 * @param end - Enddatum ISO
 * @param canton - Schweizer Kanton
 * @param includeEndpoints - Endpunkte mitzählen (Standard: true)
 */
export function swissWorkdaysBetween(
  start: string,
  end: string,
  canton: Canton = "ZH",
  includeEndpoints = true
): number {
  const s = new Date(start);
  const e = new Date(end);
  let count = 0;
  const d = new Date(s);

  while (d <= e) {
    const dateStr = iso(d);
    if (isWorkday(dateStr, canton)) {
      count++;
    }
    d.setDate(d.getDate() + 1);
  }

  return Math.max(count, includeEndpoints ? 1 : 0);
}

/**
 * Findet den nächsten Arbeitstag (z.B. für Brückentage-Analyse)
 */
export function nextWorkday(isoDate: string, canton: Canton = "ZH"): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + 1);

  while (!isWorkday(iso(d), canton)) {
    d.setDate(d.getDate() + 1);
  }

  return iso(d);
}

/**
 * Findet den vorherigen Arbeitstag
 */
export function previousWorkday(isoDate: string, canton: Canton = "ZH"): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() - 1);

  while (!isWorkday(iso(d), canton)) {
    d.setDate(d.getDate() - 1);
  }

  return iso(d);
}

/**
 * Analysiert Brückentage (Tage zwischen Feiertag und Wochenende oder umgekehrt)
 * Gibt die kantonale Feiertags-Belegung im Jahr zurück
 */
export function getBridgeDays(canton: Canton, year: number): { date: string; name: string; isBridgeDay: boolean }[] {
  const holidays = getSwissHolidays(canton, year);
  const bridgeDays: { date: string; name: string; isBridgeDay: boolean }[] = [];

  for (const holiday of holidays) {
    const holidayDate = new Date(holiday.date);
    const prevDay = new Date(holidayDate);
    prevDay.setDate(prevDay.getDate() - 1);
    const nextDay = new Date(holidayDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const prevDayIso = iso(prevDay);
    const nextDayIso = iso(nextDay);

    // Prüfe ob Vortag ein Freitag ist (und kein Feiertag)
    if (prevDay.getDay() === 5 && !isSwissHoliday(prevDayIso, canton)) {
      bridgeDays.push({
        date: prevDayIso,
        name: `Brückentag vor ${holiday.name}`,
        isBridgeDay: true,
      });
    }

    // Prüfe ob Folgetag ein Montag ist (und kein Feiertag)
    if (nextDay.getDay() === 1 && !isSwissHoliday(nextDayIso, canton)) {
      bridgeDays.push({
        date: nextDayIso,
        name: `Brückentag nach ${holiday.name}`,
        isBridgeDay: true,
      });
    }
  }

  return bridgeDays;
}

/**
 * Nächste Feiertage ab heute
 */
export function upcomingSwissHolidays(
  canton: Canton = "ZH",
  limit = 5
): { date: string; name: string; cantonName: string }[] {
  const today = iso(new Date());
  const currentYear = new Date().getFullYear();

  const allHolidays: { date: string; name: string; cantonName: string }[] = [];

  // Aktuelles und nächstes Jahr prüfen
  for (const year of [currentYear, currentYear + 1]) {
    const holidays = getSwissHolidays(canton, year);
    for (const h of holidays) {
      allHolidays.push({ date: h.date, name: h.name, cantonName: h.type });
    }
  }

  return allHolidays
    .filter(h => h.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

/**
 * Kalenderansicht-Daten für einen Monat generieren
 */
export function getMonthCalendar(
  year: number,
  month: number,
  canton: Canton = "ZH"
): {
  day: number;
  iso: string;
  isWeekend: boolean;
  holiday: string | null;
  holidayType: "national" | "canton" | null;
}[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const holidays = getSwissHolidays(canton, year);
  const holidayMap = new Map(holidays.map(h => [h.date, h]));

  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const dayIso = iso(d);
    const holiday = holidayMap.get(dayIso);

    return {
      day: i + 1,
      iso: dayIso,
      isWeekend: isWeekend(d),
      holiday: holiday?.name ?? null,
      holidayType: holiday?.type ?? null,
    };
  });
}

/**
 * Kompatibilitäts-Export für bestehenden Code
 * Diese Funktionen werden beibehalten für Rückwärtskompatibilität
 */

// Alias für bestehende Nutzung (aber jetzt mit CH-Feiertagen)
export const isHoliday = isSwissHoliday;

/**
 * @deprecated Bitte swissWorkdaysBetween verwenden
 */
export const workdaysBetween = (start: string, end: string): number =>
  swissWorkdaysBetween(start, end);

/**
 * @deprecated Bitte upcomingSwissHolidays verwenden
 */
export const upcomingHolidays = (limit = 3) =>
  upcomingSwissHolidays("ZH", limit);