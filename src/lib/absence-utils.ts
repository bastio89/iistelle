/**
 * Abwesenheits-Utils mit CH-Feiertags-Unterstützung
 *
 * Verwendet die schweizweiten Feiertage basierend auf dem Kanton des Unternehmens.
 */

import {
  Canton,
  CANTONS,
  getSwissHolidays,
  isSwissHoliday,
  swissWorkdaysBetween,
  upcomingSwissHolidays,
  getBridgeDays,
  Holiday,
} from "./swiss-holidays";

// Re-Exporte für Bequemlichkeit
export type { Canton, Holiday };
export { CANTONS, getSwissHolidays, isSwissHoliday, swissWorkdaysBetween, upcomingSwissHolidays, getBridgeDays };

/**
 * Validiert, ob ein Kanton-Code gültig ist
 */
export function isValidCanton(canton: string): canton is Canton {
  return CANTONS.some((c) => c.code === canton);
}

/**
 * Formatiert einen Feiertag für die Anzeige
 */
export function formatHoliday(holiday: Holiday): string {
  const typeLabel = holiday.type === "national" ? "🇨🇭" : "📍";
  return `${typeLabel} ${holiday.name} (${holiday.date})`;
}

/**
 * Gibt alle Feiertage für einen Monat zurück
 */
export function getMonthHolidays(
  canton: Canton,
  year: number,
  month: number
): Holiday[] {
  const all = getSwissHolidays(canton, year);
  return all.filter((h) => {
    const holidayMonth = new Date(h.date).getMonth();
    return holidayMonth === month;
  });
}

/**
 * Prüft, ob ein Tag ein "langes Wochenende" ist (Feiertag zwischen Freitag und Montag)
 */
export function isLongWeekend(
  isoDate: string,
  canton: Canton
): { isBridgeDay: boolean; holiday?: Holiday } {
  const date = new Date(isoDate);
  const day = date.getDay();

  // Nur montags prüfen (Tag nach einem可能的 Brückentag)
  if (day !== 1) return { isBridgeDay: false };

  const prevFriday = new Date(date);
  prevFriday.setDate(prevFriday.getDate() - 3);
  const prevFridayStr = `${prevFriday.getFullYear()}-${String(prevFriday.getMonth() + 1).padStart(2, "0")}-${String(prevFriday.getDate()).padStart(2, "0")}`;

  const prevFridayHoliday = getSwissHolidays(canton, prevFriday.getFullYear()).find(
    (h) => h.date === prevFridayStr
  );

  if (prevFridayHoliday) {
    return { isBridgeDay: true, holiday: prevFridayHoliday };
  }

  return { isBridgeDay: false };
}

/**
 * Berechnet Urlaubstage unter Berücksichtigung von CH-Feiertagen
 */
export function calculateVacationDays(
  startDate: string,
  endDate: string,
  canton: Canton = "ZH"
): {
  totalDays: number;
  workdays: number;
  holidays: Holiday[];
  weekendDays: number;
} {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const holidays = getSwissHolidays(canton, start.getFullYear());

  let workdays = 0;
  let weekendDays = 0;
  const holidayList: Holiday[] = [];

  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    const isoStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    const holiday = holidays.find((h) => h.date === isoStr);

    if (day === 0 || day === 6) {
      weekendDays++;
    } else if (holiday) {
      holidayList.push(holiday);
    } else {
      workdays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    totalDays: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    workdays,
    holidays: holidayList,
    weekendDays,
  };
}

/**
 * Formatiert die Feiertags-Info für eine Abwesenheits-Benachrichtigung
 */
export function formatHolidayNotice(holidays: Holiday[]): string {
  if (holidays.length === 0) return "";

  return holidays
    .map((h) => `${h.name} am ${new Date(h.date).toLocaleDateString("de-DE")}`)
    .join(", ");
}