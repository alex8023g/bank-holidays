import { DateRange } from '@/components/ClientContainerVH';

export function dayOfYearInRanges({
  ranges,
  dayOfYear,
}: {
  ranges: DateRange[];
  dayOfYear: number;
}) {
  return ranges.some(
    (d) => d.start.dayOfYear <= dayOfYear && dayOfYear <= d.end.dayOfYear,
  );
}
