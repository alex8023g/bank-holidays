import { Day } from '@/lib/createDaysArr';
import { DateRange } from './ContainerClientProviderVH';
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
      Gesamt:{' '}
      {ranges
        .filter((range) => range.year === year)
        .reduce((acc, range) => {
          return (
            acc +
            (range.end.dayOfYear - range.start.dayOfYear + 1) -
            holidaysCount({ range, days })
          );
        }, 0)}{' '}
      T.
    </h2>
  );
}
