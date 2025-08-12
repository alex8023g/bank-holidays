import { DateRange } from '@/components/ClientContainerVH';

export function dayOfYearInRanges({
  dateRanges,
  dayOfYear,
}: {
  dateRanges: DateRange[];
  dayOfYear: number;
}) {
  return dateRanges.some(
    (d) => d.start.dayOfYear <= dayOfYear && dayOfYear <= d.end.dayOfYear,
  );
}
