import { Day } from '@/lib/createDaysArr';
import { DateRange } from './ClientContainerVH';
import { holidaysCount } from '@/lib/holidaysCount';

export function TotalVacationDays({
  ranges,
  days,
  year,
}: {
  ranges: DateRange[];
  days: Day[];
  year: number;
}) {
  return (
    <h2 className='font-semibold'>
      Итого:{' '}
      {ranges
        .filter((range) => range.year === year)
        .reduce((acc, range) => {
          return (
            acc +
            (range.end.dayOfYear - range.start.dayOfYear + 1) -
            holidaysCount({ range, days })
          );
        }, 0)}{' '}
      к.д.
    </h2>
  );
}
