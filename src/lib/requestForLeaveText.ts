import { DateRange } from '@/components/ContainerClientProviderVH';
import { holidaysCount } from './holidaysCount';
import { Day } from './createDaysArr';
import dayjs from 'dayjs';

export function requestForLeaveText({
  range,
  days,
}: {
  range: DateRange;
  days: Day[];
}) {
  return `Ich bitte um Gewährung des Haupturlaubs vom ${dayjs(range.start.dateStr).format('DD.MM.YYYY')} bis ${dayjs(range.end.dateStr).format('DD.MM.YYYY')} für ${
    range.end.dayOfYear -
    range.start.dayOfYear +
    1 -
    holidaysCount({ range, days })
  } T.`;
}
