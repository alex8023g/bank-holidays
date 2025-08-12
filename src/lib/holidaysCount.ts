import { Day } from '@/app/page';
import { DateRange } from '@/components/ClientContainerVH';

export function holidaysCount({
  range,
  days,
}: {
  range: {
    year?: number;
    start: { dayOfYear: number; dateStr?: string };
    end: { dayOfYear: number; dateStr?: string };
  };
  days: Day[];
}) {
  const res = days.filter(
    (day) =>
      day.isHoliday /* || day.isWeekend */ &&
      day.dayOfYear >= range.start.dayOfYear &&
      day.dayOfYear <= range.end.dayOfYear,
  ).length;
  console.log('🚀 ~ daysOffCount ~ res:', res);
  return res;
}
