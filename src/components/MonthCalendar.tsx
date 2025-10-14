'use client';
import { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from './ClientContainerVH';
import dayjs from 'dayjs';
import { Month } from '@/lib/createYearCalendar';
import { Day } from '@/lib/createDaysArr';
import { toast } from 'sonner';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { dayInRanges } from '@/lib/dayInRanges';
import { twJoin } from 'tailwind-merge';
import { useSession } from 'next-auth/react';
import {
  upsertPersonalRanges,
  upsertPersonalRangesNoUser,
} from '@/lib/actions';

export function MonthCalendar({
  i,
  month,
  days,
  isActive,
}: {
  i: number;
  month: Month;
  days: Day[];
  isActive: boolean;
}) {
  const ctx = useContext(ThemeContext);
  const activeEl = useRef<HTMLDivElement>(null);
  const session = useSession();
  console.log('🚀 ~ MonthCalendar ~ session:', session);

  useEffect(() => {
    if (isActive) {
      activeEl.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isActive]);

  if (!ctx) {
    return <div>no context</div>;
  }
  const year = ctx.selectedYear;

  return (
    <section
      key={i}
      ref={activeEl}
      className={twJoin('text-center', `${isActive ? 'active' : ''}`)}
    >
      <h2 className='mb-2 text-sm font-semibold text-gray-900'>
        {dayjs().year(year).month(i).format('MMMM')}
      </h2>
      <div className='grid grid-cols-7 text-xs/6 text-gray-500'>
        <div>ПН</div>
        <div>ВТ</div>
        <div>СР</div>
        <div>ЧТ</div>
        <div>ПТ</div>
        <div>СБ</div>
        <div>ВС</div>
      </div>
      <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200'>
        {month.days.map((day, di) =>
          day.dateString ? (
            <button
              key={di}
              type='button'
              // data-is-today={day.isToday ? '' : undefined}
              // data-is-current-month={day ? '' : undefined}
              className={`relative bg-white py-1.5 text-gray-900 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 nth-36:rounded-bl-lg nth-7:rounded-tr-lg ${day?.isHoliday ? 'font-bold' : ''}`}
              style={{
                backgroundColor: ctx.dateRanges.some(
                  (d) =>
                    day?.dayOfYear &&
                    d.year === year &&
                    d.start.dayOfYear <= day?.dayOfYear &&
                    d.end.dayOfYear >= day.dayOfYear,
                )
                  ? '#51a2ff'
                  : '',
                color: day?.isWeekend ? 'red' : day?.isHoliday ? 'red' : '',
                outline:
                  ctx.selectedDayOfYear && ctx.hoverDayOfYear && day.dayOfYear
                    ? ctx.selectedDayOfYear <= day.dayOfYear &&
                      day.dayOfYear <= ctx.hoverDayOfYear
                      ? '1px solid red'
                      : ''
                    : ctx.selectedRange
                      ? ctx.selectedRange.start.dayOfYear <= day.dayOfYear &&
                        day.dayOfYear <= ctx.selectedRange.end.dayOfYear
                        ? '1px solid red'
                        : ''
                      : '',
              }}
              onClick={() => {
                console.log('🚀 ~ onClick ~ start');
                if (ctx.selectedDayOfYear) {
                  /*  первый день уже выбран */
                  if (
                    day?.dayOfYear &&
                    ctx.selectedDayOfYear &&
                    day?.dayOfYear < ctx.selectedDayOfYear
                  ) {
                    if (day.isHoliday || day.isWeekend) {
                      toast.error('Отпуск не может начинаться в выходной');
                      return;
                    }
                    ctx.setSelectedDayOfYear(day.dayOfYear);
                    return;
                  } else if (day.isHoliday) {
                    toast.error(
                      'Отпуск не может заканчиваться в праздничный день',
                    );
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
                  }
                  const newRange = {
                    start: {
                      dayOfYear: ctx.selectedDayOfYear || 0,
                      dateStr:
                        days.find(
                          (day2) =>
                            day2.dayOfYear === ctx.selectedDayOfYear &&
                            day2.year === year,
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
                  if (session.data?.user.id) {
                    upsertPersonalRanges({
                      userId: session.data?.user.id,
                      rangesJson: JSON.stringify(updDateRanges),
                    });
                  } else if (ctx.dateRangesId) {
                    upsertPersonalRangesNoUser({
                      rangesJson: JSON.stringify(updDateRanges),
                      personalRangesId: ctx.dateRangesId,
                    });
                  }
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
              }}
              onMouseEnter={() => {
                // if (ctx.selectedDayOfYear) {
                ctx.setHoverDayOfYear(day.dayOfYear);
                // }
              }}
            >
              <time
                dateTime={day.monthDay || ''}
                className='mx-auto flex size-7 items-center justify-center rounded-full in-data-is-today:bg-indigo-600 in-data-is-today:font-semibold in-data-is-today:text-white'
              >
                {dayjs(day?.dateString)?.format('D')}
              </time>
              {/* {day?.dateString} */}
              {ctx.selectedRange?.start.dayOfYear === day.dayOfYear && (
                <div
                  className='absolute -top-2.5 -left-2.5 z-10 size-5 h-5 w-5 cursor-pointer rounded-full bg-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    const updRanges = ctx.dateRanges.filter(
                      (r) =>
                        !(
                          r.start.dayOfYear === day.dayOfYear && r.year === year
                        ),
                    );
                    console.log('🚀 ~ click on XCircleIcon');
                    ctx.setDateRanges(updRanges);
                    ctx.setSelectedRange(null);
                  }}
                >
                  <XCircleIcon className='absolute -top-0.5 -left-0.5 size-6 text-red-600' />
                </div>
              )}
            </button>
          ) : (
            <button
              key={di}
              type='button'
              // data-is-today={day.isToday ? '' : undefined}
              data-is-current-month={day.dayOfYear ? '' : undefined}
              className='/hover:bg-gray-100 bg-gray-50 py-1.5 text-gray-400 first:rounded-tl-lg last:rounded-br-lg focus:z-10 data-is-current-month:bg-white data-is-current-month:text-gray-900 data-is-current-month:hover:bg-gray-100 nth-36:rounded-bl-lg nth-7:rounded-tr-lg'
            >
              <time
                dateTime={day.monthDay || ''}
                className='mx-auto flex size-7 items-center justify-center rounded-full in-data-is-today:bg-indigo-600 in-data-is-today:font-semibold in-data-is-today:text-white'
              ></time>
            </button>
          ),
        )}
      </div>
    </section>
  );
}
