import { DateRange } from '@/components/ClientContainerVH';
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
  return `Прошу предоставить основной оплачиваемый отпуск с ${dayjs(range.start.dateStr).format('DD.MM.YYYY')} по ${dayjs(range.end.dateStr).format('DD.MM.YYYY')} сроком ${
    range.end.dayOfYear -
    range.start.dayOfYear +
    1 -
    holidaysCount({ range, days })
  } к.д.`;
}
