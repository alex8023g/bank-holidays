import { DateRange } from '@/components/ClientContainerVH';

export function dayInRanges({
  dateRanges,
  dayOfYear,
  year,
}: {
  dateRanges: DateRange[];
  dayOfYear: number;
  year: number;
}) {
  return dateRanges.some(
    (d) =>
      year === d.year &&
      d.start.dayOfYear <= dayOfYear &&
      dayOfYear <= d.end.dayOfYear,
  );
}
