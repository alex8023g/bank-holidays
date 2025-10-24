'use client';
import { useState } from 'react';
import { Day } from '@/lib/createDaysArr';
import { DateRangesList } from './DateRangesList';
import { RangesUsersBtnGroup } from './RangesUsersBtnGroup';
import { SharedPlansListByPersPlanId } from '@/lib/actions';
import { ParticipantsSharedPlansList } from './ParticipantsSharedPlansList';
import { twJoin } from 'tailwind-merge';

export type RangesUsersBtn = 'users' | 'total';

export default function ContainerRangesUsers({
  days,
  sharedPlansList,
}: {
  days: Day[];
  sharedPlansList: SharedPlansListByPersPlanId[];
}) {
  const [activeBtn, setActiveBtn] = useState<RangesUsersBtn>('total');

  const handleClick = (btn: 'users' | 'total') => {
    setActiveBtn(btn);
  };
  return (
    <div className='/border-2 /border-blue-500 flex h-full flex-col overflow-y-hidden md:flex-row xl:flex-col'>
      <RangesUsersBtnGroup activeBtn={activeBtn} handleClick={handleClick} />
      <DateRangesList days={days} activeBtn={activeBtn} />
      <div
        className={twJoin(
          '/border-gray-400 /md:border w-full overflow-y-hidden rounded-lg md:flex md:w-1/2 md:flex-col xl:h-1/2 xl:w-full',
          activeBtn === 'users' ? 'flex flex-col' : 'hidden',
        )}
      >
        <ParticipantsSharedPlansList
          activeBtn={activeBtn}
          sharedPlansList={sharedPlansList}
        />
      </div>
    </div>
  );
}
