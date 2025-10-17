'use client';
import { useState } from 'react';
import { Day } from '@/lib/createDaysArr';
import { MembersList } from './MembersList';
import { DateRangesList } from './DateRangesList';
import { RangesUsersBtnGroup } from './RangesUsersBtnGroup';

export type RangesUsersBtn = 'users' | 'total';

export default function ContainerRangesUsers({ days }: { days: Day[] }) {
  const [activeBtn, setActiveBtn] = useState<RangesUsersBtn>('total');

  const handleClick = (btn: 'users' | 'total') => {
    setActiveBtn(btn);
  };
  return (
    <>
      <div className='/border-2 /border-blue-500 flex h-full flex-col overflow-y-hidden md:flex-row xl:flex-col'>
        <RangesUsersBtnGroup activeBtn={activeBtn} handleClick={handleClick} />
        {/* <div className='flex h-full flex-row border border-blue-500 xl:flex-col'> */}
        <DateRangesList days={days} activeBtn={activeBtn} />
        <MembersList activeBtn={activeBtn} />
      </div>
    </>
  );
}
