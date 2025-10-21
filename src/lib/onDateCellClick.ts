import { Day } from './createDaysArr';
import { toast } from 'sonner';
import { Session } from 'next-auth';
import {
  updatePersonalRangesById,
  upsertPersonalRanges,
  upsertPersonalRangesNoUser,
} from './actions';
import { dayInRanges } from './dayInRanges';
import { SelectedDateContext } from '@/components/ContainerClientProviderVH';

export function onDateCellClick({
  ctx,
  day,
  year,
  session,
  days,
}: {
  ctx: SelectedDateContext;
  day: {
    monthDay?: string;
    dayOfYear: number;
    dateString: string;
    isHoliday: boolean;
    isWeekend: boolean;
    isSelected?: boolean;
  };
  year: number;
  session: Session | null;
  days: Day[];
}) {
  console.log('🚀 ~ onClick ~ start');
  ctx.setClickPlace('calendarCell');
  if (ctx.selectedDayOfYear) {
    /*  первый день уже выбран */
    if (day.isHoliday) {
      toast.error('Отпуск не может заканчиваться в праздничный день');
      return;
    } else if (
      ctx.dateRanges.some(
        (range) =>
          (range.year === year &&
            range.start.dayOfYear <= day.dayOfYear &&
            day.dayOfYear <= range.end.dayOfYear) ||
          (range.year === year &&
            ctx.selectedDayOfYear &&
            ctx.selectedDayOfYear < range.start.dayOfYear &&
            range.end.dayOfYear < day.dayOfYear),
      )
    ) {
      toast.error('Периоды отпусков не могут пересекаться');
      return;
    } else if (day.dayOfYear < ctx.selectedDayOfYear) {
      ctx.setSelectedDayOfYear(day.dayOfYear);
      return;
    }
    const newRange = {
      start: {
        dayOfYear: ctx.selectedDayOfYear || 0,
        dateStr:
          days.find(
            (day2) =>
              day2.dayOfYear === ctx.selectedDayOfYear && day2.year === year,
          )?.dateString || '',
      },
      end: {
        dayOfYear: day.dayOfYear,
        dateStr: day.dateString,
      },
      year: year,
    };
    const updDateRanges = ctx.dateRanges
      .concat([newRange])
      .sort((a, b) =>
        a.year > b.year
          ? 1
          : a.year < b.year
            ? -1
            : a.start.dayOfYear > b.start.dayOfYear
              ? 1
              : a.start.dayOfYear < b.start.dayOfYear
                ? -1
                : 0,
      );
    ctx.setDateRanges(updDateRanges);
    ctx.setSelectedDayOfYear(null);
    updatePersonalRangesById({
      id: ctx.personalRangesId,
      rangesJson: JSON.stringify(updDateRanges),
    });
    // if (session?.user?.id) {
    //   upsertPersonalRanges({
    //     userId: session?.user?.id,
    //     rangesJson: JSON.stringify(updDateRanges),
    //   });
    // } else if (ctx.lsRangesData.id) {
    //   upsertPersonalRangesNoUser({
    //     rangesJson: JSON.stringify(updDateRanges),
    //     personalRangesId: ctx.lsRangesData.id,
    //   });
    // }
  } else if (
    /* первый день периода не выбран, а клик попал в один из ranges */
    dayInRanges({
      dateRanges: ctx.dateRanges,
      dayOfYear: day.dayOfYear,
      year,
    })
  ) {
    if (
      /* клик в уже выбранный range */
      ctx.selectedRange?.start.dayOfYear &&
      ctx.selectedRange?.end.dayOfYear &&
      ctx.selectedRange?.start.dayOfYear <= day.dayOfYear &&
      day.dayOfYear <= ctx.selectedRange?.end.dayOfYear /* &&
                            ctx.selectedRange.year === year */
    ) {
      ctx.setSelectedRange(null);
    } else {
      /* клик в еще не выбранный range */
      ctx.setSelectedRange(
        ctx.dateRanges.find(
          (range) =>
            range.start.dayOfYear <= day.dayOfYear &&
            day.dayOfYear <= range.end.dayOfYear &&
            range.year === year,
        ) || null,
      );
    }
  } else if (day.isHoliday || day.isWeekend) {
    /* первый день периода не выбран, и клик попал в выходной или праздничный день */
    toast.error('Отпуск не может начинаться в выходной');
  } else {
    /* первый день периода не выбран, и клик попал в белое поле */

    ctx.setSelectedDayOfYear(day.dayOfYear);
    ctx.setSelectedRange(null);
  }
}
