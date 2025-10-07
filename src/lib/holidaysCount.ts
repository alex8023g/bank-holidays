import { Day } from './createDaysArr';

export function holidaysCount({
  range,
  days,
}: {
  range: {
    year: number;
    start: { dayOfYear: number; dateStr?: string };
    end: { dayOfYear: number; dateStr?: string };
  };
  days: Day[];
}) {
  const res = days.filter(
    (day) =>
      day.isHoliday &&
      day.year === range.year &&
      day.dayOfYear >= range.start.dayOfYear &&
      day.dayOfYear <= range.end.dayOfYear,
  ).length;
  console.log('🚀 ~ daysOffCount ~ res:', res, range);
  return res;
}
