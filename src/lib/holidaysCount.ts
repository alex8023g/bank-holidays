import { Day } from '@/app/c2/page';
import { DateRange } from '@/components/ClientContainerVH';

export function holidaysCount({
  range,
  days,
}: {
  range: DateRange;
  days: Day[];
}) {
  const res = days.filter(
    (day) =>
      day.isHoliday /* || day.isWeekend */ &&
      day.dayOfYear >= range.start &&
      day.dayOfYear <= range.end,
  ).length;
  console.log('🚀 ~ daysOffCount ~ res:', res);
  return res;
}
