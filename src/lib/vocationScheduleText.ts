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
          'vom ' +
          dayjs(range.start.dateStr).format('DD.MM.YYYY') +
          ' bis ' +
          dayjs(range.end.dateStr).format('DD.MM.YYYY') +
          '  ' +
          '(' +
          (range.end.dayOfYear -
            range.start.dayOfYear +
            1 -
            holidaysCount({ range, days })) +
          ' T.)',
      )
      .join('\n') +
    '\n' +
    'Gesamt: ' +
    dateRanges.reduce((acc, range) => {
      return (
        acc +
        (range.end.dayOfYear - range.start.dayOfYear + 1) -
        holidaysCount({ range, days })
      );
    }, 0) +
    ' T.'
  );
}
