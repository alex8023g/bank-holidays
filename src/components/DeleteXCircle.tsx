import { XCircleIcon } from '@heroicons/react/20/solid';
import {
  upsertPersonalRanges,
  upsertPersonalRangesNoUser,
} from '@/lib/actions';
import { Session } from 'next-auth';
import { SelectedDateContext } from './ContainerClientProviderVH';
import { useEffect, useRef } from 'react';
import { twJoin } from 'tailwind-merge';

export function DeleteXCircleIcon({
  ctx,
  day,
  year,
  session,
  position,
}: {
  ctx: SelectedDateContext;
  day: {
    monthDay?: string;
    dayOfYear: number;
    dateString: string;
    isHoliday: boolean;
    isWeekend: boolean;
  };
  year: number;
  session: Session | null;
  position: 'left' | 'right';
}) {
  const activeEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ctx?.clickPlace === 'resultBlock') {
      activeEl.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [ctx?.clickPlace]);

  return (
    <div
      ref={activeEl}
      className={twJoin(
        'absolute -top-2.5 z-10 size-5 h-5 w-5 cursor-pointer rounded-full bg-white',
        position === 'left' ? '-left-2.5' : '-right-2.5',
      )}
      onClick={(e) => {
        e.stopPropagation();
        const updRanges = ctx.dateRanges.filter(
          (r) => !(r.start.dayOfYear === day.dayOfYear && r.year === year),
        );
        console.log('🚀 ~ click on XCircleIcon');
        ctx.setDateRanges(updRanges);
        ctx.setSelectedRange(null);
        if (session?.user?.id) {
          upsertPersonalRanges({
            userId: session?.user?.id,
            rangesJson: JSON.stringify(updRanges),
          });
        } else if (ctx.lsRangesData.id) {
          upsertPersonalRangesNoUser({
            rangesJson: JSON.stringify(updRanges),
            personalRangesId: ctx.lsRangesData.id,
          });
        }
      }}
    >
      <XCircleIcon className='absolute -top-0.5 -left-0.5 size-6 text-red-600' />
    </div>
  );
}
