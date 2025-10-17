import { DateRange } from '@/components/ContainerClientProviderVH';
import dayjs from 'dayjs';
import { holidaysCount } from './holidaysCount';
import { Day } from './createDaysArr';

export function vocationScheduleText({
  dateRanges,
  days,
}: {
  dateRanges: DateRange[];
  days: Day[];
}) {
  return (
    dateRanges
      ?.map(
        (range) =>
          'c ' +
          dayjs(range.start.dateStr).format('DD.MM.YYYY') +
          ' по ' +
          dayjs(range.end.dateStr).format('DD.MM.YYYY') +
          '  ' +
          '(' +
          (range.end.dayOfYear -
            range.start.dayOfYear +
            1 -
            holidaysCount({ range, days })) +
          ' к.д.)',
      )
      .join('\n') +
    '\n' +
    'Итого: ' +
    dateRanges.reduce((acc, range) => {
      return (
        acc +
        (range.end.dayOfYear - range.start.dayOfYear + 1) -
        holidaysCount({ range, days })
      );
    }, 0) +
    ' к.д.'
  );
}
